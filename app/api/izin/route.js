import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!['SAKIT', 'IZIN'].includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
    }

    // Periksa apakah sudah ada riwayat absensi/izin hari ini
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAbsen = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingAbsen) {
      return NextResponse.json({ error: `Anda sudah memiliki riwayat absensi (${existingAbsen.status}) hari ini` }, { status: 400 })
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: session.user.id,
        status: status, // SAKIT atau IZIN
      }
    })

    return NextResponse.json({ success: true, attendance })
  } catch (error) {
    console.error('Izin API Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
