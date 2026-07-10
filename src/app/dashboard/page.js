import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import StudentDashboard from './StudentDashboard'

import prisma from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  let analytics = {}

  if (session.user.role === 'ADMIN') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const [totalStudents, todayHadir, todaySakit, todayIzin] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.attendance.count({ where: { status: 'HADIR', date: { gte: today } } }),
      prisma.attendance.count({ where: { status: 'SAKIT', date: { gte: today } } }),
      prisma.attendance.count({ where: { status: 'IZIN', date: { gte: today } } })
    ])
    
    analytics = { totalStudents, todayHadir, todaySakit, todayIzin, todayAlpha: totalStudents - (todayHadir + todaySakit + todayIzin) }
  } else {
    const [totalHadir, totalSakit, totalIzin, totalAlpha] = await Promise.all([
      prisma.attendance.count({ where: { userId: session.user.id, status: 'HADIR' } }),
      prisma.attendance.count({ where: { userId: session.user.id, status: 'SAKIT' } }),
      prisma.attendance.count({ where: { userId: session.user.id, status: 'IZIN' } }),
      prisma.attendance.count({ where: { userId: session.user.id, status: 'ALPHA' } })
    ])
    analytics = { totalHadir, totalSakit, totalIzin, totalAlpha }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Selamat datang, {session.user.name}</p>
      </header>

      {session.user.role === 'ADMIN' ? (
        <AdminDashboard user={session.user} analytics={analytics} />
      ) : (
        <StudentDashboard user={session.user} analytics={analytics} />
      )}
    </div>
  )
}
