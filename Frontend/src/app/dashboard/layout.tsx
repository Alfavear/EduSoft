"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { NotificationBell } from "../components/NotificationBell";

import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  GraduationCap,
  Plus,
  Mail,
  Bell,
  FileText,
  UserCheck,
  ClipboardList,
  Star,
  CheckCircle
} from "lucide-react";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) {
    return <div className="container" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  }

  const role = (session.user as any).role;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
          <GraduationCap size={28} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>EduSoft</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Inicio</span>
          </Link>
          
          {(role === "ADMIN" || role === "TEACHER") && (
            <Link href="/dashboard/clases" className={`nav-item ${pathname.includes('/clases') ? 'active' : ''}`}>
              <BookOpen size={20} />
              <span>{role === 'ADMIN' ? 'Control de Notas' : 'Mis Clases'}</span>
            </Link>
          )}

          {role === "ADMIN" && (
            <Link href="/dashboard/usuarios" className={`nav-item ${pathname.includes('/usuarios') ? 'active' : ''}`}>
              <Users size={20} />
              <span>Gestión de Usuarios</span>
            </Link>
          )}


          {role === "ADMIN" && (
            <Link href="/dashboard/academico" className={`nav-item ${pathname.includes('/academico') ? 'active' : ''}`}>
              <BookOpen size={20} />
              <span>Catálogo Académico</span>
            </Link>
          )}

          {role === "ADMIN" && (
            <Link href="/dashboard/asignaciones" className={`nav-item ${pathname.includes('/asignaciones') ? 'active' : ''}`}>
              <UserCheck size={20} />
              <span>Asignaciones</span>
            </Link>
          )}

          {role === "STUDENT" && (
            <Link href="/dashboard/notas" className={`nav-item ${pathname.includes('/notas') ? 'active' : ''}`}>
              <Star size={20} />
              <span>Mis Notas</span>
            </Link>
          )}

          {role === "ADMIN" && (
            <Link href="/dashboard/admin/solicitudes" className={`nav-item ${pathname.includes('/solicitudes') ? 'active' : ''}`}>
              <ClipboardList size={20} />
              <span>Solicitudes</span>
            </Link>
          )}

          {role === "ADMIN" && (
            <Link href="/dashboard/reportes" className={`nav-item ${pathname.includes('/reportes') ? 'active' : ''}`}>
              <FileText size={20} />
              <span>Reportes</span>
            </Link>
          )}

          {(role === "ADMIN" || role === "TEACHER") && (
            <Link href="/dashboard/asistencia" className={`nav-item ${pathname.includes('/asistencia') ? 'active' : ''}`}>
              <CheckCircle size={20} />
              <span>Asistencias</span>
            </Link>
          )}

          <Link href="/dashboard/calendario" className={`nav-item ${pathname.includes('/calendario') ? 'active' : ''}`}>
            <Calendar size={20} />
            <span>Calendario</span>
          </Link>

          <Link href="/dashboard/mensajeria" className={`nav-item ${pathname.includes('/mensajeria') ? 'active' : ''}`}>
            <Mail size={20} />
            <span>Mensajería</span>
          </Link>




        </nav>

        <div style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
          {role === "ADMIN" && (
            <Link href="/dashboard/configuracion" className={`nav-item ${pathname.includes('/configuracion') ? 'active' : ''}`}>
              <Settings size={20} />
              <span>Configuración</span>
            </Link>
          )}
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <div style={{ fontWeight: '500' }}>
            {/* Opcional: breadcrumbs o título de sección */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <NotificationBell />
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }}></div>
            <a href="/dashboard/perfil" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{session.user.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(session.user as any).username}</span>
              </div>
              <div style={{ 
                backgroundColor: role === 'ADMIN' ? 'var(--color-purple)' : role === 'TEACHER' ? 'var(--color-teal)' : 'var(--color-primary)', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '2rem', 
                fontSize: '0.75rem', 
                fontWeight: 'bold' 
              }}>
                {role}
              </div>
            </a>
          </div>
        </header>


        {/* Content */}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
