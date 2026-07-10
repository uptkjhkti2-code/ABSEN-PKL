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
    const { photo, latitude, longitude } = body

    if (!photo || !latitude || !longitude) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Periksa apakah sudah absen hari ini
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
      return NextResponse.json({ error: 'Anda sudah melakukan absensi hari ini' }, { status: 400 })
    }

    // Simpan ke database (Langsung simpan base64 ke photoUrl)
    const attendance = await prisma.attendance.create({
      data: {
        userId: session.user.id,
        status: 'HADIR',
        photoUrl: photo,
        latitude,
        longitude
      }
    })

    return NextResponse.json({ success: true, attendance })
  } catch (error) {
    console.error('Absen API Error:', error)
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
