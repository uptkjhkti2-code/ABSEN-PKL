'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, Users, LogOut, Camera, History } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function Navbar({ role }) {
  const pathname = usePathname()

  if (pathname === '/login') return null

  const adminLinks = [
    { href: '/dashboard', label: 'Beranda', icon: <Home size={20} /> },
    { href: '/rekap', label: 'Rekap Data', icon: <ClipboardList size={20} /> },
    { href: '/users', label: 'Pengguna', icon: <Users size={20} /> },
  ]

  const studentLinks = [
    { href: '/dashboard', label: 'Beranda', icon: <Home size={20} /> },
    { href: '/absen', label: 'Absen', icon: <Camera size={20} /> },
    { href: '/riwayat', label: 'Riwayat', icon: <History size={20} /> },
  ]

  const links = role === 'ADMIN' ? adminLinks : studentLinks

  return (
    <>
      {/* Top Navbar for Desktop */}
      <nav className="desktop-nav" style={{ 
        backgroundColor: 'var(--surface)', 
        borderBottom: '1px solid var(--border)', 
        padding: '1rem 2rem', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
          AbsenPKL
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? '600' : 'normal',
                  textDecoration: 'none'
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--danger)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <nav className="mobile-nav" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'var(--surface)', 
        borderTop: '1px solid var(--border)', 
        justifyContent: 'space-around', 
        padding: '0.75rem 0.5rem',
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        zIndex: 50,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
      }}>
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: '0.25rem', 
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                textDecoration: 'none',
                flex: 1
              }}
            >
              {link.icon}
              <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : 'normal' }}>
                {link.label}
              </span>
            </Link>
          )
        })}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            gap: '0.25rem', 
            color: 'var(--danger)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            flex: 1
          }}
        >
          <LogOut size={20} />
          <span style={{ fontSize: '0.75rem' }}>Logout</span>
        </button>
      </nav>
    </>
  )
}
