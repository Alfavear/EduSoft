import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AttendanceManager } from "./AttendanceManager";
import { prisma } from "@/lib/prisma";
import { getAttendanceRequests, approveAttendanceRequest } from "./actions";
import { Clock, Check, X, User } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AsistenciaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  let courses = [];
  let teacherProfile = null;
  let studentData = null;

  if (role === "ADMIN") {
    courses = await prisma.course.findMany();
  } else if (role === "TEACHER") {
    teacherProfile = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        assignments: {
          include: { course: true }
        }
      }
    });
    const courseMap = new Map();
    teacherProfile?.assignments.forEach(a => {
      courseMap.set(a.course.id, a.course);
    });
    courses = Array.from(courseMap.values());
  } else if (role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        attendances: {
          orderBy: { date: 'desc' }
        }
      }
    });
    
    if (student) {
      const absences = student.attendances.filter(a => a.status === 'ABSENT').length;
      const total = student.attendances.length;
      studentData = {
        totalAttendances: total,
        absences: absences,
        percentage: total > 0 ? Math.round(((total - absences) / total) * 100) : 100,
        recentHistory: student.attendances.slice(0, 10)
      };
    }
  }

  const pendingRequests = role === 'ADMIN' ? await getAttendanceRequests() : [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Control de Asistencia</h1>
        <p style={{ color: 'var(--text-muted)' }}>Registro diario y gestión de novedades académicas</p>
      </div>

      {role === 'ADMIN' && pendingRequests.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--color-warning)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--color-warning)" />
            Solicitudes de Registro Extemporáneo
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingRequests.map((req: any) => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>
                    <User size={16} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{req.teacher.firstName} {req.teacher.lastName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Curso: <strong>{req.course.name}</strong> | Fecha: <strong>{new Date(req.date).toLocaleDateString()}</strong>
                    </p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>"{req.reason}"</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <form action={async () => {
                    "use server";
                    await approveAttendanceRequest(req.id, 'APPROVED');
                  }}>
                    <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-success)', fontSize: '0.75rem' }}>
                      <Check size={14} /> Aprobar
                    </button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await approveAttendanceRequest(req.id, 'REJECTED');
                  }}>
                    <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-danger)', fontSize: '0.75rem' }}>
                      <X size={14} /> Rechazar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AttendanceManager 
        courses={courses} 
        teacherId={teacherProfile?.id || ""} 
        role={role} 
        studentData={studentData}
      />
    </div>
  );
}
