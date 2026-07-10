import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ClientUserList from './ClientUserList'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      kelas: true,
      dudika: true,
      role: true
    },
    orderBy: { role: 'asc' } // Admin will be listed first (since A < S)
  })

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Kelola Data Pengguna</h1>
        <p style={{ color: 'var(--text-muted)' }}>Daftar pengguna (Admin & Siswa) dan manajemen akun.</p>
      </div>

      <ClientUserList initialUsers={users} />
    </div>
  )
}
