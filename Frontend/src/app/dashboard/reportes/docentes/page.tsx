import { prisma } from "@/lib/prisma";
import { Users, Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PrintButton from "../../observador/[studentId]/report/PrintButton";

export default async function TeacherDirectoryPage() {
  const teachers = await prisma.teacher.findMany({
    include: {
      assignments: {
        include: {
          course: true,
          subject: true
        }
      }
    },
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/dashboard/reportes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ChevronLeft size={16} />
          Volver a Reportes
        </Link>
        <PrintButton />
      </div>

      <div className="card-premium" style={{ padding: '3rem', backgroundColor: 'white', color: 'black', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid #000', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Institución Educativa EduSoft
          </h1>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#444' }}>
            Directorio Maestro de Docentes
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            Generado el: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Docente</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Especialidad / Contacto</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Carga Académica</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{teacher.lastName}, {teacher.firstName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {teacher.documentId || 'N/A'}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div>{teacher.specialization || 'General'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{teacher.phone || 'Sin teléfono'}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {teacher.assignments.map((as, idx) => (
                      <span key={as.id} style={{ 
                        fontSize: '0.7rem', 
                        backgroundColor: '#f9fafb', 
                        padding: '0.2rem 0.4rem', 
                        borderRadius: '4px', 
                        border: '1px solid #e5e7eb' 
                      }}>
                        {as.subject.name} ({as.course.name})
                        {idx < teacher.assignments.length - 1 ? "" : ""}
                      </span>
                    ))}
                    {teacher.assignments.length === 0 && <span style={{ fontStyle: 'italic', color: '#999' }}>Sin asignaciones</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '0.75rem', color: '#999' }}>
          Este documento es para uso exclusivo administrativo de EduSoft.
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .container { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
          .card-premium { box-shadow: none !important; border: none !important; padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
