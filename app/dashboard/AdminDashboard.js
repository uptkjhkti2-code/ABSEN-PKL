'use client'

import { Users, Download, Lock, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AdminDashboard({ user }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Download size={32} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Unduh Rekap</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Download rekapitulasi absensi siswa dalam format CSV/Excel.
          </p>
          <a href="/api/rekap/download" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', backgroundColor: 'var(--success)' }}>
            <Download size={18} /> Download CSV
          </a>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Users size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Kelola Siswa</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Manajemen akun siswa dan reset password.
          </p>
          <Link href="/siswa" className="btn btn-outline" style={{ width: '100%' }}>
            Lihat Data Siswa
          </Link>
        </div>

      </div>

      <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
        <LogOut size={18} /> Keluar
      </button>
    </div>
  )
}
