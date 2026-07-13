'use client'

import { useState, useEffect } from 'react'
import { Calendar, Trash2, Plus, AlertCircle } from 'lucide-react'

export default function ClientHolidayList() {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    try {
      const res = await fetch('/api/holidays')
      if (res.ok) {
        const data = await res.json()
        setHolidays(data.holidays || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!newDate || !newDesc) {
      setError('Tanggal dan keterangan wajib diisi')
      return
    }

    try {
      const res = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, description: newDesc })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal menambahkan hari libur')
      } else {
        setNewDate('')
        setNewDesc('')
        setIsAdding(false)
        fetchHolidays()
      }
    } catch (err) {
      setError('Terjadi kesalahan')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus tanggal ini dari daftar libur?')) return

    try {
      const res = await fetch(`/api/holidays/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchHolidays()
      } else {
        alert('Gagal menghapus hari libur')
      }
    } catch (err) {
      alert('Terjadi kesalahan')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Kelola Hari Libur Nasional</h1>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={20} />
          {isAdding ? 'Batal Tambah' : 'Tambah Libur'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tambah Hari Libur Baru</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label>Tanggal Libur</label>
              <input 
                type="date" 
                className="input" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                required
              />
            </div>
            <div className="input-group">
              <label>Keterangan / Nama Libur</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Misal: Tahun Baru" 
                value={newDesc} 
                onChange={(e) => setNewDesc(e.target.value)} 
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Simpan Hari Libur</button>
        </form>
      )}

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data...</div>
        ) : holidays.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Belum ada hari libur yang ditambahkan.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Tanggal</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Keterangan</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => {
                const dateObj = new Date(h.date)
                const formattedDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                return (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} color="var(--primary)" />
                        {formattedDate}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{h.description}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(h.id)}
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
