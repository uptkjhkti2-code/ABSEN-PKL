'use client'

import { Camera, MapPin, Calendar, LogOut, FileText } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function StudentDashboard({ user }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Camera size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Absen Sekarang</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Ambil foto wajah dan lokasi untuk mencatat kehadiran.
          </p>
          <Link href="/absen" className="btn btn-primary" style={{ width: '100%' }}>
            Mulai Absen
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Calendar size={32} color="var(--warning)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Pengajuan Izin</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Ajukan izin sakit atau keperluan lainnya.
          </p>
          <Link href="/izin" className="btn btn-outline" style={{ width: '100%' }}>
            Ajukan Izin
          </Link>
        </div>

      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Informasi PKL</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Nama</span>
            <span style={{ fontWeight: '500' }}>{user.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Kelas</span>
            <span style={{ fontWeight: '500' }}>{user.kelas}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tempat DUDIKA</span>
            <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={16} /> {user.dudika}
            </span>
          </div>
        </div>
      </div>

      <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
        <LogOut size={18} /> Keluar
      </button>
    </div>
  )
}
