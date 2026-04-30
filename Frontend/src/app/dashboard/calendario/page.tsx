import { getEvents } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Calendar as CalendarIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EventManager from "./EventManager";
import CalendarGrid from "./CalendarGrid";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  let courseId = undefined;
  if (session.user.role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    courseId = student?.courseId;
  }

  const events = await getEvents({ role: session.user.role as any, courseId });
  const isAdmin = session?.user?.role === "ADMIN";
  const isTeacher = session?.user?.role === "TEACHER";

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarIcon size={32} color="var(--color-primary)" />
            Calendario Escolar
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Eventos institucionales y actividades de curso.</p>
        </div>
        {(isAdmin || isTeacher) && <EventManager assignments={[]} />}
      </div>

      <CalendarGrid initialEvents={events} />
    </div>
  );
}
