'use client'

import { useState } from 'react'
import { Key, AlertCircle, CheckCircle, Edit, Trash2, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ClientUserList({ initialUsers }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    id: '', username: '', name: '', password: '', role: 'STUDENT', kelas: '', dudika: ''
  })

  const resetForm = () => {
    setFormData({ id: '', username: '', name: '', password: '', role: 'STUDENT', kelas: '', dudika: '' })
    setIsEditMode(false)
    setIsModalOpen(false)
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      name: user.name,
      password: '', // Kosongkan password saat edit
      role: user.role,
      kelas: user.kelas || '',
      dudika: user.dudika || ''
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const url = isEditMode ? `/api/users/${formData.id}` : '/api/users'
      const method = isEditMode ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')

      setMessage({ type: 'success', text: `Pengguna berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.` })
      resetForm()
      router.refresh() // Refresh data dari server
      
      // Update local state temporarily so user sees change immediately
      if (isEditMode) {
        setUsers(users.map(u => u.id === data.user.id ? data.user : u))
      } else {
        setUsers([...users, data.user])
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, name) => {
    if (!confirm(`Yakin ingin menghapus pengguna ${name}? Semua riwayat absensi pengguna ini juga akan terhapus secara permanen.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus')
      
      setUsers(users.filter(u => u.id !== userId))
      setMessage({ type: 'success', text: `Pengguna ${name} berhasil dihapus.` })
      router.refresh()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (userId, name) => {
    const newPassword = prompt(`Masukkan password baru untuk pengguna ${name}:`)
    if (!newPassword) return

    setLoading(true)
    try {
      const res = await fetch('/api/users/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')

      setMessage({ type: 'success', text: `Password untuk ${name} berhasil diubah.` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Daftar Pengguna</h2>
        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      {message.text && (
        <div style={{ backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? 'var(--success)' : 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem' }}>Username</th>
              <th style={{ padding: '1rem' }}>Nama</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Kelas</th>
              <th style={{ padding: '1rem' }}>DUDIKA</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{user.username}</td>
                <td style={{ padding: '1rem' }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${user.role === 'ADMIN' ? 'badge-danger' : 'badge-success'}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{user.kelas || '-'}</td>
                <td style={{ padding: '1rem' }}>{user.dudika || '-'}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleResetPassword(user.id, user.name)} className="btn btn-outline" style={{ padding: '0.4rem' }} title="Reset Password" disabled={loading}>
                      <Key size={16} />
                    </button>
                    <button onClick={() => handleOpenEdit(user)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--primary)', borderColor: 'var(--primary)' }} title="Edit Data" disabled={loading}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(user.id, user.name)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} title="Hapus Akun" disabled={loading}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--surface)', position: 'relative' }}>
            <button onClick={resetForm} style={{ position: 'absolute', right: '1rem', top: '1rem', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Nama Lengkap *</label>
                <input type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Username *</label>
                <input type="text" className="input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
              </div>
              {!isEditMode && (
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Password *</label>
                  <input type="password" className="input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEditMode} />
                </div>
              )}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Role *</label>
                <select className="input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="STUDENT">Siswa (STUDENT)</option>
                  <option value="ADMIN">Admin (ADMIN)</option>
                </select>
              </div>
              
              {formData.role === 'STUDENT' && (
                <>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Kelas</label>
                    <input type="text" className="input" value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Nama Bengkel / DUDIKA</label>
                    <input type="text" className="input" value={formData.dudika} onChange={e => setFormData({...formData, dudika: e.target.value})} />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={resetForm} className="btn btn-outline" disabled={loading}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
