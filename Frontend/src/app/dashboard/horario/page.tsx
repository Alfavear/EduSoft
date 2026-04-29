import { getWeeklySchedule } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Clock, BookOpen, User as UserIcon, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ScheduleFilters from "./ScheduleFilters";

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ courseId?: string, teacherId?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const { courseId, teacherId } = await searchParams;
  const role = session.user.role;

  let schedule: any[] = [];
  let filterTitle = "Tu Horario Semanal";

  // Admin logic
  if (role === "ADMIN") {
    if (courseId) {
      schedule = await getWeeklySchedule({ courseId });
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      filterTitle = `Horario de Curso: ${course?.name}`;
    } else if (teacherId) {
      schedule = await getWeeklySchedule({ teacherId });
      const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
      filterTitle = `Horario de Docente: ${teacher?.firstName} ${teacher?.lastName}`;
    } else {
      filterTitle = "Consulta de Horarios Institucionales";
    }
  } 
  // Student logic
  else if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (student) {
      schedule = await getWeeklySchedule({ courseId: student.courseId });
    }
  } 
  // Teacher logic
  else if (role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (teacher) {
      schedule = await getWeeklySchedule({ teacherId: teacher.id });
    }
  }

  const courses = await prisma.course.findMany({ orderBy: { name: 'asc' } });
  const teachers = await prisma.teacher.findMany({ orderBy: { firstName: 'asc' } });

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
          📅 Horario Escolar
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{filterTitle}</p>
      </div>

      {role === "ADMIN" && (
        <ScheduleFilters courses={courses} teachers={teachers} />
      )}

      {(schedule.length > 0 || role !== "ADMIN") ? (
        <div className="card" style={{ padding: '0.5rem', background: '#fff', border: '10px solid #f3f4f6', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '8px' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: 'var(--color-warning)', color: '#fff', padding: '1rem', borderRadius: '0.5rem', width: '100px' }}>HORA</th>
                {days.map((day, idx) => (
                  <th key={idx} style={{ backgroundColor: 'var(--color-warning)', color: '#fff', padding: '1rem', borderRadius: '0.5rem' }}>
                    {day.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIdx) => (
                <tr key={timeIdx}>
                  <td style={{ backgroundColor: '#fffbe6', border: '2px dashed var(--color-warning)', padding: '1rem', textAlign: 'center', fontWeight: 'bold', borderRadius: '0.5rem', color: 'var(--color-warning)' }}>
                    {time}
                  </td>
                  {days.map((_, dayIdx) => {
                    const dayNum = dayIdx + 1;
                    const items = schedule.filter(i => i.dayOfWeek === dayNum && i.startTime === time);
                    
                    return (
                      <td key={dayIdx} style={{ border: '2px solid #e5e7eb', borderRadius: '0.5rem', verticalAlign: 'top', minHeight: '100px', backgroundColor: items.length > 0 ? 'rgba(59, 130, 246, 0.05)' : '#fff' }}>
                        {items.map(item => (
                          <div key={item.id} style={{ 
                            padding: '0.75rem', 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontWeight: '900', color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                              {item.assignment.subject.name.toUpperCase()}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                              {/* If admin is viewing course, show teacher. If admin is viewing teacher, show course. */}
                              {teacherId 
                                ? `🏫 GRADO: ${item.assignment.course.name}`
                                : `👨‍🏫 ${item.assignment.teacher.firstName} ${item.assignment.teacher.lastName}`
                              }
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Calendar size={48} opacity={0.2} style={{ margin: '0 auto 1rem' }} />
          <p>Seleccione un filtro para consultar el horario institucional.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .app-sidebar, .app-topbar, .btn-secondary, .card:has(select) { display: none !important; }
          .app-main { padding: 0 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          .card { border: none !important; box-shadow: none !important; }
          table { font-size: 0.6rem !important; }
        }
      `}} />
    </div>
  );
}
