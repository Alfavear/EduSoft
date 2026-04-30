"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User, LogOut, Settings, Key, ChevronDown, UserCircle } from "lucide-react";
import Link from "next/link";

export function UserDropdown({ session, role }: { session: any, role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: 'var(--radius)',
          transition: 'background-color 0.2s'
        }}
        className="hover-bg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} className="user-info-text">
          <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-main)' }}>{session.user.name}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.user.username}</span>
        </div>
        
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: role === 'ADMIN' ? 'var(--color-purple)' : role === 'TEACHER' ? 'var(--color-teal)' : 'var(--color-primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {session.user.image ? (
            <img src={session.user.image} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            session.user.name?.charAt(0).toUpperCase()
          )}
        </div>
        
        <ChevronDown size={16} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          marginTop: '0.5rem', 
          width: '240px', 
          backgroundColor: 'white', 
          borderRadius: 'var(--radius)', 
          boxShadow: 'var(--shadow-lg)', 
          border: '1px solid var(--border-light)',
          zIndex: 1000,
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', backgroundColor: '#f8fafc' }}>
             <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Rol Actual</p>
             <p style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-primary)' }}>{role}</p>
          </div>

          <div style={{ padding: '0.5rem' }}>
            <Link 
              href="/dashboard/perfil" 
              onClick={() => setIsOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.875rem' }}
              className="dropdown-item"
            >
              <UserCircle size={18} color="var(--text-muted)" />
              Mi Perfil
            </Link>
            
            <Link 
              href="/dashboard/perfil#password-form" 
              onClick={() => setIsOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.875rem' }}
              className="dropdown-item"
            >
              <Key size={18} color="var(--text-muted)" />
              Cambiar Contraseña
            </Link>

            {role === "ADMIN" && (
              <Link 
                href="/dashboard/configuracion" 
                onClick={() => setIsOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.875rem' }}
                className="dropdown-item"
              >
                <Settings size={18} color="var(--text-muted)" />
                Ajustes de Sistema
              </Link>
            )}
          </div>

          <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: 'none', 
                background: 'none', 
                cursor: 'pointer', 
                color: 'var(--color-danger)', 
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
              className="dropdown-item-danger"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-bg:hover { background-color: #f1f5f9; }
        .dropdown-item:hover { background-color: #f8fafc; color: var(--color-primary) !important; }
        .dropdown-item-danger:hover { background-color: rgba(239, 44, 44, 0.05); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
