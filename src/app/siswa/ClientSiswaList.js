'use client'

import { useState } from 'react'
import { Key, AlertCircle, CheckCircle } from 'lucide-react'

export default function ClientSiswaList({ initialStudents }) {
  const [students, setStudents] = useState(initialStudents)
  const [loadingId, setLoadingId] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleResetPassword = async (userId, studentName) => {
    const newPassword = prompt(`Masukkan password baru untuk siswa ${studentName}:`)
    
    if (!newPassword) return

    setLoadingId(userId)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/siswa/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword })
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')

      setMessage({ type: 'success', text: `Password untuk ${studentName} berhasil diubah.` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div>
      {message.text && (
        <div style={{ 
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem' 
        }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>Username</th>
              <th style={{ padding: '1rem' }}>Nama Siswa</th>
              <th style={{ padding: '1rem' }}>Kelas</th>
              <th style={{ padding: '1rem' }}>DUDIKA</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{student.username}</td>
                <td style={{ padding: '1rem' }}>{student.name}</td>
                <td style={{ padding: '1rem' }}>{student.kelas || '-'}</td>
                <td style={{ padding: '1rem' }}>{student.dudika || '-'}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    onClick={() => handleResetPassword(student.id, student.name)}
                    disabled={loadingId === student.id}
                  >
                    <Key size={14} /> {loadingId === student.id ? 'Memproses...' : 'Ganti Password'}
                  </button>
                </td>
              </tr>
            ))}
            
            {students.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Belum ada data siswa
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
