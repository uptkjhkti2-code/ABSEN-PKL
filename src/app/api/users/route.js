import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username, name, password, role, kelas, dudika } = await req.json()

    if (!username || !name || !password || !role) {
      return NextResponse.json({ error: 'Data wajib belum diisi' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
        role,
        kelas: role === 'STUDENT' ? kelas : null,
        dudika: role === 'STUDENT' ? dudika : null
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error('Create User Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 })
  }
}
