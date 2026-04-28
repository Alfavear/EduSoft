"use client";

import { useState, useEffect } from "react";
import { Bell, Info, CheckCircle, AlertTriangle, X } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "../dashboard/notificaciones/actions";
import Link from "next/link";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Actualizar cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.isRead).length);
  };

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '0.5rem', 
          position: 'relative',
          color: 'var(--text-main)'
        }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px', 
            backgroundColor: 'var(--color-danger)', 
            color: 'white', 
            fontSize: '10px', 
            padding: '2px 5px', 
            borderRadius: '10px',
            fontWeight: 'bold',
            border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          right: 0, 
          width: '320px', 
          backgroundColor: 'white', 
          boxShadow: 'var(--shadow-lg)', 
          borderRadius: 'var(--radius)', 
          marginTop: '0.5rem', 
          zIndex: 1000,
          border: '1px solid var(--border-light)',
          maxHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Notificaciones</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No tienes notificaciones
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  style={{ 
                    padding: '1rem', 
                    borderBottom: '1px solid var(--border-light)', 
                    backgroundColor: n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                    display: 'flex',
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ color: n.type === 'SUCCESS' ? 'var(--color-success)' : n.type === 'WARNING' ? 'var(--color-warning)' : 'var(--color-primary)' }}>
                    {n.type === 'SUCCESS' ? <CheckCircle size={18} /> : n.type === 'WARNING' ? <AlertTriangle size={18} /> : <Info size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{n.message}</div>
                    {n.link && (
                      <Link 
                        href={n.link} 
                        onClick={() => { handleMarkAsRead(n.id); setIsOpen(false); }}
                        style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'underline' }}
                      >
                        Ver detalles
                      </Link>
                    )}
                  </div>
                  {!n.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(n.id)}
                      style={{ 
                        position: 'absolute', 
                        right: '0.5rem', 
                        top: '0.5rem', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: 'var(--border-light)'
                      }}
                      title="Marcar como leída"
                    >
                      <CheckCircle size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mantenimiento automático cada 30 días</span>
          </div>
        </div>
      )}
    </div>
  );
}
