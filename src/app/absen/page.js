'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

export default function AbsenPage() {
  const router = useRouter()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [location, setLocation] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [status, setStatus] = useState('Memuat kamera & lokasi...')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Get Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError('Gagal mendapatkan lokasi. Pastikan GPS aktif dan diizinkan.'),
        { enableHighAccuracy: true }
      )
    } else {
      setError('Browser Anda tidak mendukung deteksi lokasi.')
    }

    // Get Camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
          setStatus('')
        })
        .catch(() => setError('Gagal mengakses kamera. Pastikan izin kamera diberikan.'))
    }
  }, [])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      // Set canvas dimensions to match video stream
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8)
      setPhoto(dataUrl)
      
      // Stop camera stream
      const stream = videoRef.current.srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const retakePhoto = () => {
    setPhoto(null)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
  }

  const submitAbsen = async () => {
    if (!photo || !location) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/absen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo,
          latitude: location.lat,
          longitude: location.lng
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
      
      setSuccess('Absensi berhasil dicatat!')
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Absen Masuk</h1>

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

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '500' }}>Lokasi Anda:</span>
          {location ? (
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> Ditemukan
            </span>
          ) : (
             <span className="badge badge-warning">Mencari...</span>
          )}
        </div>

        <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', aspectRatio: '4/3' }}>
          {!photo ? (
             <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <img src={photo} alt="Captured face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{status}</p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {!photo ? (
            <button onClick={capturePhoto} className="btn btn-primary" style={{ flex: 1 }} disabled={!location}>
              <Camera size={18} /> Ambil Foto
            </button>
          ) : (
            <>
              <button onClick={retakePhoto} className="btn btn-outline" style={{ flex: 1 }} disabled={loading}>
                Ulangi
              </button>
              <button onClick={submitAbsen} className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--success)' }} disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Absen'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
