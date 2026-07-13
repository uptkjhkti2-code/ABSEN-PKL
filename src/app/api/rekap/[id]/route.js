import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const { id } = resolvedParams

    await prisma.attendance.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Data absen berhasil dihapus' })
  } catch (error) {
    console.error('Delete Attendance Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal saat menghapus absen' }, { status: 500 })
  }
}
