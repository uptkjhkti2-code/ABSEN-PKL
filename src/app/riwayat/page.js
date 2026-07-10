import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import ClientRiwayat from './ClientRiwayat'

export default async function RiwayatPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Ambil data absensi khusus user ini
  const attendances = await prisma.attendance.findMany({
    where: {
      userId: session.user.id
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Riwayat Absen Anda</h1>
        <p style={{ color: 'var(--text-muted)' }}>Melihat catatan kehadiran Anda sendiri.</p>
      </header>

      <ClientRiwayat initialData={formattedData} />
    </div>
  )
}
