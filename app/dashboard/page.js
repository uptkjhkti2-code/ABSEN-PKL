import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import StudentDashboard from './StudentDashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Selamat datang, {session.user.name}</p>
        </div>
      </header>

      {session.user.role === 'ADMIN' ? (
        <AdminDashboard user={session.user} />
      ) : (
        <StudentDashboard user={session.user} />
      )}
    </div>
  )
}
