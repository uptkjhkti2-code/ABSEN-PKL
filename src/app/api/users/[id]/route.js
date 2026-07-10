import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { username, name, role, kelas, dudika } = await req.json()

    if (!username || !name || !role) {
      return NextResponse.json({ error: 'Data wajib belum diisi' }, { status: 400 })
    }

    // Cek jika username sudah dipakai orang lain
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: { not: id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Username sudah digunakan oleh akun lain' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        name,
        role,
        kelas: role === 'STUDENT' ? kelas : null,
        dudika: role === 'STUDENT' ? dudika : null
      }
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error('Update User Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Cek apakah menghapus diri sendiri
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Anda tidak dapat menghapus akun Anda sendiri' }, { status: 400 })
    }

    // Prisma akan otomatis menghapus Attendance terkait karena kita menggunakan onDelete: Cascade
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'User berhasil dihapus' })
  } catch (error) {
    console.error('Delete User Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
