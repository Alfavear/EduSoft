"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NotificationBell } from "../components/NotificationBell";
import { UserDropdown } from "../components/UserDropdown";

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
  CheckCircle,
  Clock,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { TopBarInfo } from "../components/TopBarInfo";
import { getTopBarData } from "./layoutActions";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topBarData, setTopBarData] = useState({ schoolName: "EduSoft", periodName: "...", sessionTimeout: 60 });

  useEffect(() => {
    getTopBarData().then(data => {
      setTopBarData(data);
      
      // Idle Timeout Logic
      if (data.keepSessionOpen) {
        console.log("Session persistence enabled: Inactivity timeout disabled.");
        return;
      }

      const timeoutMinutes = data.sessionTimeout || 60;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      let idleTimer: any;

      const resetTimer = () => {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          signOut({ callbackUrl: "/login?reason=timeout" });
        }, timeoutMs);
      };

      // Events to track activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(evt => document.addEventListener(evt, resetTimer));
      
      resetTimer();

      return () => {
        events.forEach(evt => document.removeEventListener(evt, resetTimer));
        if (idleTimer) clearTimeout(idleTimer);
      };
    });
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (status === "loading" || !session?.user) {
    return <div className="container" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  }

  const role = (session.user as any).role;

  return (
    <div className="app-layout">
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`app-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GraduationCap size={28} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>EduSoft</h2>
          </div>
          <button 
            className="mobile-only" 
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
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

          <Link href="/dashboard/horario" className={`nav-item ${pathname.includes('/horario') ? 'active' : ''}`}>
            <Clock size={20} />
            <span>Horario</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="mobile-only"
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.5rem' }}
            >
              <Menu size={24} />
            </button>
            <div style={{ fontWeight: '500' }} className="desktop-only">
              {/* Opcional: breadcrumbs */}
            </div>
          </div>

          <TopBarInfo schoolName={topBarData.schoolName} periodName={topBarData.periodName} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NotificationBell />
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }}></div>
            <UserDropdown session={session} role={role} />
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
