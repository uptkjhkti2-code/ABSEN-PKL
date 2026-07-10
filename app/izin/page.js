'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react'

export default function IzinPage() {
  const router = useRouter()
  const [status, setStatus] = useState('SAKIT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submitIzin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/izin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
      
      setSuccess('Pengajuan izin berhasil!')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Pengajuan Izin</h1>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {success && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} /> {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={submitIzin}>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label>Jenis Izin</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="SAKIT" 
                  checked={status === 'SAKIT'} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                Sakit (S)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="IZIN" 
                  checked={status === 'IZIN'} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                Izin Lainnya (I)
              </label>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <Calendar size={20} style={{ flexShrink: 0 }} /> 
            <span style={{ fontSize: '0.875rem' }}>
              Pengajuan izin ini berlaku untuk absensi Anda <strong>hari ini</strong>. Pastikan Anda telah mengonfirmasi dengan pihak DUDIKA.
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Memproses...' : 'Kirim Pengajuan Izin'}
          </button>
        </form>
      </div>
    </div>
  )
}
