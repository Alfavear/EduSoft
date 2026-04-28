"use client";

import { useSession } from "next-auth/react";
import { Users, BookOpen, UserPlus, CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session?.user) return null;
  const role = (session.user as any).role;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Bienvenido de nuevo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Resumen general del sistema</p>
      </div>

      {role === "ADMIN" && (
        <>
          <div className="grid-stats">
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="number">342</span>
              <span className="label">Estudiantes Activos</span>
              <Users size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-success)' }}>
              <span className="number">24</span>
              <span className="label">Docentes</span>
              <BookOpen size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-purple)' }}>
              <span className="number">12</span>
              <span className="label">Cursos</span>
              <CheckCircle size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-warning)' }}>
              <span className="number">3</span>
              <span className="label">Alertas</span>
              <AlertTriangle size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Accesos Rápidos</h2>
          <div className="grid-cards">
            <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', borderRadius: '0.5rem' }}>
                <UserPlus size={24} />
              </div>
              <div>
                <h3 style={{ fontWeight: 'bold' }}>Matricular Estudiante</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Añadir nuevo registro</p>
              </div>
            </div>
            <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', borderRadius: '0.5rem' }}>
                <BookOpen size={24} />
              </div>
              <div>
                <h3 style={{ fontWeight: 'bold' }}>Asignar Materias</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Gestión académica</p>
              </div>
            </div>
          </div>
        </>
      )}

      {role === "TEACHER" && (
        <>
          <div className="grid-stats">
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-teal)' }}>
              <span className="number">4</span>
              <span className="label">Materias Asignadas</span>
              <BookOpen size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-warning)' }}>
              <span className="number">2</span>
              <span className="label">Pendientes por calificar</span>
              <Clock size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Mis Cursos</h2>
          <div className="grid-cards">
            {/* Tarjeta de Curso tipo Canvas */}
            <div className="card course-card">
              <div className="course-card-banner" style={{ backgroundColor: 'var(--color-primary)' }}></div>
              <div className="course-card-content">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Matemáticas 10°</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Grado 10A</p>
              </div>
              <div className="course-card-actions">
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Ver Notas"><FileText size={20} /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Asistencias"><Users size={20} /></button>
              </div>
            </div>

            <div className="card course-card">
              <div className="course-card-banner" style={{ backgroundColor: 'var(--color-pink)' }}></div>
              <div className="course-card-content">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-pink)' }}>Física Avanzada</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Grado 11B</p>
              </div>
              <div className="course-card-actions">
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Ver Notas"><FileText size={20} /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Asistencias"><Users size={20} /></button>
              </div>
            </div>
          </div>
        </>
      )}

      {role === "STUDENT" && (
        <>
          <div className="grid-stats">
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-success)' }}>
              <span className="number">4.5</span>
              <span className="label">Promedio General</span>
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="number">8</span>
              <span className="label">Materias Inscritas</span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Materias Actuales</h2>
          <div className="grid-cards">
            {/* Tarjetas simplificadas para estudiantes */}
            <div className="card" style={{ display: 'flex', borderLeft: '4px solid var(--color-primary)' }}>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <h3 style={{ fontWeight: 'bold' }}>Historia</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Prof. Carlos Ruiz</p>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>4.8</span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', borderLeft: '4px solid var(--color-success)' }}>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <h3 style={{ fontWeight: 'bold' }}>Inglés B1</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Prof. Ana Blanco</p>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-success)' }}>5.0</span>
              </div>
            </div>
            
            <div className="card" style={{ display: 'flex', borderLeft: '4px solid var(--color-warning)' }}>
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <h3 style={{ fontWeight: 'bold' }}>Química</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Prof. Elena Torres</p>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>3.2</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
