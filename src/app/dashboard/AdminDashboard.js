'use client'

import Link from 'next/link'
import { FileText, Users, Download, Activity } from 'lucide-react'

export default function AdminDashboard({ user, analytics }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={24} color="var(--primary)" /> Ringkasan Hari Ini
      </h2>
      
      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{analytics?.totalStudents || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Siswa</span>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{analytics?.todayHadir || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Hadir</span>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{(analytics?.todaySakit || 0) + (analytics?.todayIzin || 0)}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Izin & Sakit</span>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>{Math.max(0, analytics?.todayAlpha || 0)}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Belum Absen (Alpha)</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Menu Pintasan</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '4px solid var(--primary)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <FileText size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Rekap Absensi</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Lihat riwayat absensi secara menyeluruh.
          </p>
          <Link href="/rekap" className="btn btn-primary" style={{ width: '100%' }}>
            Buka Rekap
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '4px solid var(--primary)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Users size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Kelola Pengguna</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Manajemen akun Siswa dan Admin.
          </p>
          <Link href="/users" className="btn btn-outline" style={{ width: '100%' }}>
            Lihat Data Pengguna
          </Link>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '4px solid var(--success)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Download size={32} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Download Laporan</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Unduh rekap absen dalam format CSV/Excel.
          </p>
          <a href="/api/rekap/download" className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--success)', color: 'var(--success)' }}>
            Unduh CSV
          </a>
        </div>
      </div>
    </div>
  )
}
