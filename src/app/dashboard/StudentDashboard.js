'use client'

import Link from 'next/link'
import { Camera, CalendarX, History, Activity } from 'lucide-react'

export default function StudentDashboard({ user, analytics }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={24} color="var(--primary)" /> Ringkasan Kehadiran
      </h2>
      
      {/* Analytics Grid */}
      <div className="grid-stats">
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{analytics?.totalHadir || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Hadir</span>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{analytics?.totalSakit || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Sakit</span>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{analytics?.totalIzin || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Izin</span>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger)' }}>{analytics?.totalAlpha || 0}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Alpha</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Menu Pintasan</h2>
      <div className="grid-menu">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '4px solid var(--primary)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Camera size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Absen Masuk</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Lakukan absensi dengan foto wajah dan deteksi lokasi.
          </p>
          <Link href="/absen" className="btn btn-primary" style={{ width: '100%' }}>
            Absen Sekarang
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '4px solid var(--warning)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <CalendarX size={32} color="var(--warning)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Pengajuan Izin</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Ajukan izin sakit atau keperluan lainnya.
          </p>
          <Link href="/izin" className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--warning)', color: 'var(--warning)' }}>
            Ajukan Izin
          </Link>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderTop: '4px solid var(--success)' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <History size={32} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Riwayat Absen</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Lihat daftar riwayat absen Anda sebelumnya.
          </p>
          <Link href="/riwayat" className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--success)', color: 'var(--success)' }}>
            Lihat Riwayat
          </Link>
        </div>
      </div>
    </div>
  )
}
