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

    // Untuk kesederhanaan, kita ambil bulan ini saja, atau 30 hari terakhir.
    // Mari kita buat semua data yang ada saja (flatten).
    // Idealnya ada filter bulan/tahun, tapi untuk MVP kita export semua tanggal.
    
    // Pertama, kumpulkan semua tanggal unik dari semua attendances
    const allDates = new Set()
    users.forEach(u => {
      u.attendances.forEach(a => {
        const dateStr = a.date.toISOString().split('T')[0]
        allDates.add(dateStr)
      })
    })

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

      sortedDates.forEach(date => {
        const status = userAttendances[date]
        let symbol = 'A' // Default Alpha jika tidak ada record
        if (status === 'HADIR') symbol = 'V'
        if (status === 'SAKIT') symbol = 'S'
        if (status === 'IZIN') symbol = 'I'
        
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
