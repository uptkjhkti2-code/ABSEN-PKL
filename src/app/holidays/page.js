import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import ClientHolidayList from './ClientHolidayList'

export const metadata = {
  title: 'Kelola Hari Libur - AbsenPKL',
}

export default async function HolidaysPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <ClientHolidayList />
    </div>
  )
}
