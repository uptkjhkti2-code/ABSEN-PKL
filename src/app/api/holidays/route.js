import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const holidays = await prisma.holiday.findMany({
      orderBy: { date: 'desc' }
    })
    return NextResponse.json({ holidays })
  } catch (error) {
    console.error('Fetch Holidays Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, description } = await req.json()
    
    if (!date || !description) {
      return NextResponse.json({ error: 'Tanggal dan deskripsi wajib diisi' }, { status: 400 })
    }

    // Convert date string to ISO date at start of day UTC
    const holidayDate = new Date(date)
    holidayDate.setUTCHours(0, 0, 0, 0)

    const existingHoliday = await prisma.holiday.findUnique({
      where: { date: holidayDate }
    })

    if (existingHoliday) {
      return NextResponse.json({ error: 'Tanggal tersebut sudah ditambahkan sebagai hari libur' }, { status: 400 })
    }

    const holiday = await prisma.holiday.create({
      data: {
        date: holidayDate,
        description
      }
    })

    return NextResponse.json({ success: true, holiday })
  } catch (error) {
    console.error('Create Holiday Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
