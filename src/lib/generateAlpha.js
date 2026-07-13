import prisma from '@/lib/prisma'

export async function checkAndGenerateAlphas() {
  try {
    // 1. Dapatkan tanggal hari ini di zona waktu WIB (UTC+7)
    const now = new Date()
    const utcHours = now.getUTCHours()
    const wibHours = (utcHours + 7) % 24
    
    // Create a new Date object representing WIB time for date calculations
    const todayWIB = new Date(now.getTime() + (7 * 60 * 60 * 1000))
    const todayStr = todayWIB.toISOString().split('T')[0] // YYYY-MM-DD
    
    // 2. Cek apakah hari ini sudah pernah diproses
    const lastCheck = await prisma.systemLog.findUnique({
      where: { key: 'LAST_ALPHA_CHECK' }
    })

    if (lastCheck && lastCheck.value === todayStr) {
      // Sudah diproses hari ini, abaikan
      return { status: 'already_checked' }
    }

    // 3. Tentukan rentang waktu pengecekan (dari awal bulan ini sampai KEMARIN)
    // Kemarin dalam WIB
    const yesterdayWIB = new Date(todayWIB)
    yesterdayWIB.setDate(yesterdayWIB.getDate() - 1)
    
    const startOfMonthWIB = new Date(todayWIB.getFullYear(), todayWIB.getMonth(), 1)
    
    if (yesterdayWIB < startOfMonthWIB) {
      // Jika kemarin adalah bulan lalu, kita cek dari awal bulan lalu sampai kemarin
      // Untuk sederhananya, kita batas maksimal cek 30 hari ke belakang
      startOfMonthWIB.setDate(yesterdayWIB.getDate() - 30)
    }

    // 4. Ambil semua tanggal libur nasional
    const holidays = await prisma.holiday.findMany()
    const holidayDates = holidays.map(h => {
      const d = new Date(h.date)
      return d.toISOString().split('T')[0]
    })

    // 5. Ambil semua siswa
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, createdAt: true }
    })

    if (students.length === 0) return { status: 'no_students' }

    // 6. Ambil semua absensi dalam rentang waktu tersebut
    // Kita gunakan UTC untuk database query karena Prisma menyimpan dalam UTC
    const startUtc = new Date(startOfMonthWIB.getTime() - (7 * 60 * 60 * 1000))
    startUtc.setUTCHours(0,0,0,0)
    const endUtc = new Date(yesterdayWIB.getTime() - (7 * 60 * 60 * 1000))
    endUtc.setUTCHours(23,59,59,999)

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startUtc,
          lte: endUtc
        }
      },
      select: { userId: true, date: true }
    })

    // Map attendances to an easy lookup format: { "userId_YYYY-MM-DD": true }
    const attendanceMap = {}
    attendances.forEach(att => {
      const attWIB = new Date(att.date.getTime() + (7 * 60 * 60 * 1000))
      const dateStr = attWIB.toISOString().split('T')[0]
      attendanceMap[`${att.userId}_${dateStr}`] = true
    })

    // 7. Mulai proses pengecekan dari startOfMonthWIB sampai yesterdayWIB
    const alphasToInsert = []
    
    let currentDateWIB = new Date(startOfMonthWIB)
    currentDateWIB.setUTCHours(0,0,0,0) // Normalize

    while (currentDateWIB <= yesterdayWIB) {
      const dayOfWeek = currentDateWIB.getUTCDay()
      const dateStr = currentDateWIB.toISOString().split('T')[0]
      
      // Skip Sabtu (6) dan Minggu (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip Hari Libur Nasional
        if (!holidayDates.includes(dateStr)) {
          
          // Cek setiap siswa
          for (const student of students) {
            // Hanya cek jika siswa sudah terdaftar pada tanggal tersebut
            const studentCreatedWIB = new Date(student.createdAt.getTime() + (7 * 60 * 60 * 1000))
            const studentCreatedStr = studentCreatedWIB.toISOString().split('T')[0]
            
            if (dateStr >= studentCreatedStr) {
              const hasAttended = attendanceMap[`${student.id}_${dateStr}`]
              
              if (!hasAttended) {
                // Konversi kembali ke UTC untuk disimpan ke database (jam 08:00 WIB = 01:00 UTC)
                // Kita set jam 12 siang WIB (05:00 UTC) sebagai waktu Alpha default
                const alphaDateUTC = new Date(currentDateWIB.getTime() - (7 * 60 * 60 * 1000))
                alphaDateUTC.setUTCHours(5, 0, 0, 0)
                
                alphasToInsert.push({
                  userId: student.id,
                  status: 'ALPHA',
                  date: alphaDateUTC
                })
              }
            }
          }
        }
      }
      
      // Lanjut ke hari berikutnya
      currentDateWIB.setDate(currentDateWIB.getDate() + 1)
    }

    // 8. Insert semua Alpha secara bersamaan
    if (alphasToInsert.length > 0) {
      await prisma.attendance.createMany({
        data: alphasToInsert
      })
    }

    // 9. Update log agar tidak dijalankan lagi hari ini
    await prisma.systemLog.upsert({
      where: { key: 'LAST_ALPHA_CHECK' },
      update: { value: todayStr },
      create: { key: 'LAST_ALPHA_CHECK', value: todayStr }
    })

    return { status: 'success', alphasGenerated: alphasToInsert.length }

  } catch (error) {
    console.error('Error in checkAndGenerateAlphas:', error)
    return { status: 'error', error: error.message }
  }
}
