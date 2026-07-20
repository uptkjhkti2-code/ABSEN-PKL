import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Pastikan hanya admin yang bisa download
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Ambil semua user (siswa)
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        attendances: true
      },
      orderBy: { name: 'asc' }
    })

    const holidays = await prisma.holiday.findMany()
    const holidayDates = holidays.map(h => h.date.toISOString().split('T')[0])

    // Untuk kesederhanaan, kita ambil bulan ini saja, atau 30 hari terakhir.
    // Mari kita buat semua data yang ada saja (flatten).
    // Idealnya ada filter bulan/tahun, tapi untuk MVP kita export semua tanggal.
    
    // Pertama, kumpulkan semua tanggal unik dari semua attendances
    const allDates = new Set()
    let minDate = new Date()
    let hasRecord = false

    users.forEach(u => {
      u.attendances.forEach(a => {
        hasRecord = true
        if (a.date < minDate) {
          minDate = new Date(a.date)
        }
        const dateStr = a.date.toISOString().split('T')[0]
        allDates.add(dateStr)
      })
    })

    // Tambahkan semua tanggal dari minDate sampai hari ini (agar weekend & libur tanpa absen tetap punya kolom)
    const nowWIB = new Date(new Date().getTime() + (7 * 60 * 60 * 1000))
    if (hasRecord) {
      let currentDate = new Date(minDate)
      currentDate.setUTCHours(0,0,0,0)
      
      const endDate = new Date(nowWIB)
      endDate.setUTCHours(0,0,0,0)
      
      while (currentDate <= endDate) {
        allDates.add(currentDate.toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    const sortedDates = Array.from(allDates).sort()

    // Header CSV
    let csvData = `Nama,Kelas,DUDIKA,${sortedDates.join(',')}\n`

    // Baris data per siswa
    users.forEach(user => {
      let row = `"${user.name}","${user.kelas || '-'}","${user.dudika || '-'}"`
      
      const userAttendances = {}
      user.attendances.forEach(a => {
        const dateStr = a.date.toISOString().split('T')[0]
        userAttendances[dateStr] = a.status
      })

      sortedDates.forEach(dateStr => {
        const status = userAttendances[dateStr]
        let symbol = ''
        
        // Cek apakah tanggal ini weekend atau libur
        const d = new Date(dateStr)
        const dayOfWeek = d.getUTCDay() // 0 = Minggu, 6 = Sabtu
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const isHoliday = holidayDates.includes(dateStr)

        if (status) {
          if (status === 'HADIR') symbol = 'V'
          else if (status === 'SAKIT') symbol = 'S'
          else if (status === 'IZIN') symbol = 'I'
          else if (status === 'ALPHA') symbol = 'A'
        } else {
          // Jika tidak ada record absen
          if (isWeekend || isHoliday) {
            symbol = 'LIBUR'
          } else {
            symbol = 'A'
          }
        }
        
        row += `,${symbol}`
      })

      csvData += row + '\n'
    })

    const headers = new Headers()
    headers.set('Content-Type', 'text/csv; charset=utf-8')
    headers.set('Content-Disposition', `attachment; filename="Rekap_Absensi_${new Date().toISOString().split('T')[0]}.csv"`)

    return new NextResponse(csvData, { headers })

  } catch (error) {
    console.error('Rekap API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
