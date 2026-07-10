'use client'

import { useState } from 'react'
import { MapPin, Image as ImageIcon, X } from 'lucide-react'

export default function ClientRiwayat({ initialData }) {
  const [filterBulan, setFilterBulan] = useState('')
  const [modalPhoto, setModalPhoto] = useState(null)

  // Filter logika
  const filteredData = initialData.filter(item => {
    // YYYY-MM
    const dateObj = new Date(item.date)
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()
    const itemBulan = `${year}-${month}`
    
    return filterBulan ? itemBulan === filterBulan : true
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'HADIR': return 'badge badge-success'
      case 'SAKIT': return 'badge badge-warning'
      case 'IZIN': return 'badge badge-warning'
      default: return 'badge badge-danger'
    }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontWeight: '500' }}>Filter Bulan:</span>
        <div className="input-group" style={{ marginBottom: 0, width: '200px' }}>
          <input 
            type="month" 
            className="input" 
            value={filterBulan}
            onChange={(e) => setFilterBulan(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1rem' }}>Tanggal & Waktu</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Bukti</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                  {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                  <small style={{ color: 'var(--text-muted)' }}>{new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</small>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={getStatusBadge(item.status)}>{item.status}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {item.photoUrl && (
                      <button onClick={() => setModalPhoto(item.photoUrl)} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--primary)', borderColor: 'var(--primary)' }} title="Lihat Foto">
                        <ImageIcon size={16} />
                      </button>
                    )}
                    {item.latitude && item.longitude && (
                      <a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--success)', borderColor: 'var(--success)' }} title="Lihat Peta">
                        <MapPin size={16} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Tidak ada data absensi pada bulan ini</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Foto */}
      {modalPhoto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }} onClick={() => setModalPhoto(null)}>
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalPhoto(null)} style={{ position: 'absolute', top: '-2rem', right: '-2rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
              <X size={32} />
            </button>
            <img src={modalPhoto} alt="Bukti Absen" style={{ maxWidth: '100vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        </div>
      )}
    </div>
  )
}
