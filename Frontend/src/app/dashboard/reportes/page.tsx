import Link from "next/link";
import { Star, AlertTriangle, FileText, ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const courses = await prisma.course.findMany();

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Centro de Informes y Reportes</h1>
        <p style={{ color: 'var(--text-muted)' }}>Analítica avanzada para la toma de decisiones institucionales.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Cuadro de Honor */}
        <Link href="/dashboard/reportes/excelencia" style={{ textDecoration: 'none' }}>
          <div className="card interactive-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', padding: '1.25rem', borderRadius: '1rem' }}>
              <Star size={32} fill="var(--color-warning)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Cuadro de Honor</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estudiantes destacados por su excelencia académica en este periodo.</p>
            </div>
          </div>
        </Link>

        {/* Alerta de Asistencia */}
        <Link href="/dashboard/reportes/asistencia" style={{ textDecoration: 'none' }}>
          <div className="card interactive-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '1.25rem', borderRadius: '1rem' }}>
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Alerta de Inasistencia</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Seguimiento crítico de estudiantes con altos índices de ausencia.</p>
            </div>
          </div>
        </Link>

        {/* Planilla Consolidada Dinámica */}
        <Link href="/dashboard/reportes/consolidado" style={{ textDecoration: 'none' }}>
          <div className="card interactive-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', padding: '1.25rem', borderRadius: '1rem' }}>
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Planillas Consolidadas</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sábana de notas completa con selector dinámico de cursos y métricas.</p>
            </div>
          </div>
        </Link>

        {/* Boletines Escolares */}
        <Link href="/dashboard/reportes/boletin" style={{ textDecoration: 'none' }}>
          <div className="card interactive-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '1.25rem', borderRadius: '1rem' }}>
              <FileText size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Boletines Escolares</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Generación e impresión de reportes de calificaciones por estudiante para el periodo actual.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
