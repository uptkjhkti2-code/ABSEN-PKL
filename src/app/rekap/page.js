import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ClientRekapList from './ClientRekapList'

export default async function RekapPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Ambil semua data absensi beserta data user-nya
  const attendances = await prisma.attendance.findMany({
    include: {
      user: {
        select: {
          name: true,
          kelas: true,
          dudika: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    }
  })

  // Format the data to pass to client component safely (serialize dates)
  const formattedData = attendances.map(a => ({
    ...a,
    date: a.date.toISOString(),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }))

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Rekap Absensi</h1>
        <p style={{ color: 'var(--text-muted)' }}>Seluruh riwayat absensi siswa.</p>
      </header>

      <ClientRekapList initialData={formattedData} />
    </div>
  )
}
