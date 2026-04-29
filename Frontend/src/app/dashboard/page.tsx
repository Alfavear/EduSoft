import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { 
  Users, 
  BookOpen, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  Calendar,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { getDashboardData, getTeacherDashboardData, getStudentDashboardData } from "./dashboardActions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  // Fetch data based on role
  let data: any = {};
  if (role === "ADMIN") data = await getDashboardData();
  if (role === "TEACHER") data = await getTeacherDashboardData(userId);
  if (role === "STUDENT") data = await getStudentDashboardData(userId);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Bienvenido, {session.user.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Resumen general del sistema - {role}</p>
      </div>

      {role === "ADMIN" && (
        <>
          <div className="grid-stats">
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="number">{data.studentCount}</span>
              <span className="label">Estudiantes Activos</span>
              <Users size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-success)' }}>
              <span className="number">{data.teacherCount}</span>
              <span className="label">Docentes</span>
              <BookOpen size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-purple)' }}>
              <span className="number">{data.courseCount}</span>
              <span className="label">Cursos</span>
              <CheckCircle size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: data.studentsAtRisk?.length > 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
              <span className="number">{data.studentsAtRisk?.length || 0}</span>
              <span className="label">Alertas Tempranas</span>
              <AlertTriangle size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingDown color="var(--color-danger)" />
                Sistema de Alerta Temprana
              </h2>
              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderBottom: '1px solid var(--border-light)' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>Estudiante</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>Grado</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>Promedio</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentsAtRisk?.length > 0 ? (
                      data.studentsAtRisk.map((s: any) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '1rem', fontWeight: '500' }}>{s.name}</td>
                          <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{s.course}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: 'var(--color-danger)', fontWeight: 'bold', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                              {s.average.toFixed(2)}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <Link href={`/dashboard/usuarios?id=${s.id}`} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                              Ver Perfil <ChevronRight size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No hay alertas críticas en este momento. ¡Buen trabajo!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Accesos Rápidos</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/dashboard/usuarios" style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', borderRadius: '0.5rem' }}>
                      <UserPlus size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>Matricular Estudiante</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Añadir nuevo registro</p>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/asignaciones" style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', borderRadius: '0.5rem' }}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)' }}>Asignar Materias</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gestión académica</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {role === "TEACHER" && (
        <>
          <div className="grid-stats">
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-teal)' }}>
              <span className="number">{data.assignmentsCount}</span>
              <span className="label">Materias Asignadas</span>
              <BookOpen size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-warning)' }}>
              <span className="number">0</span>
              <span className="label">Solicitudes Pendientes</span>
              <Clock size={48} opacity={0.2} style={{ position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '2rem 0 1rem' }}>Mis Cursos y Materias</h2>
          <div className="grid-cards">
            {data.assignments.map((a: any) => (
              <div key={a.id} className="card course-card">
                <div className="course-card-banner" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                <div className="course-card-content">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{a.subject}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Grado {a.course}</p>
                </div>
                <div className="course-card-actions">
                  <Link href={`/dashboard/clases?subjectId=${a.id}`} title="Calificar"><FileText size={20} /></Link>
                  <Link href={`/dashboard/asistencia?courseId=${a.courseId}`} title="Tomar Asistencia"><Users size={20} /></Link>
                  <Link href={`/dashboard/calendario`} title="Horario"><Calendar size={20} /></Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {role === "STUDENT" && (
        <>
          <div className="grid-stats">
            <div className="widget-stat" style={{ backgroundColor: parseFloat(data.average) < 3.0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
              <span className="number">{data.average}</span>
              <span className="label">Promedio General</span>
            </div>
            <div className="widget-stat" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="number">{data.subjectsCount}</span>
              <span className="label">Materias Registradas</span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '2rem 0 1rem' }}>Resumen Académico</h2>
          <div className="grid-cards">
            {data.recentGrades.map((g: any, index: number) => (
              <div key={index} className="card" style={{ display: 'flex', borderLeft: `4px solid ${parseFloat(g.value) < 3.0 ? 'var(--color-danger)' : 'var(--color-primary)'}` }}>
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <h3 style={{ fontWeight: 'bold' }}>{g.subject}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Calificación actual</p>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: parseFloat(g.value) < 3.0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                    {g.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
