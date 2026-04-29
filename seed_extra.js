const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("--- Seeding Calendario y Horario ---");

  // 1. Calendario
  await prisma.calendarEvent.createMany({
    data: [
      {
        title: "Entrega de Boletines - Primer Periodo",
        description: "Reunión de padres de familia para entrega de informes académicos.",
        startDate: new Date("2026-05-15"),
        type: "BULLETIN_DELIVERY",
        isGlobal: true
      },
      {
        title: "Jornada Pedagógica",
        description: "Día sin clases para capacitación docente.",
        startDate: new Date("2026-05-20"),
        type: "PEDAGOGICAL_DAY",
        isGlobal: true
      },
      {
        title: "Reunión de Consejo Directivo",
        description: "Definición de presupuestos y proyectos.",
        startDate: new Date("2026-05-10"),
        type: "MEETING",
        isGlobal: true
      }
    ]
  });

  // 2. Horario para el curso "Primero" (PRI)
  const course = await prisma.course.findFirst({ where: { name: "Primero" } });
  if (course) {
    const assignments = await prisma.teacherAssignment.findMany({
      where: { courseId: course.id },
      include: { subject: true }
    });

    const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00"];
    
    for (let day = 1; day <= 5; day++) {
      for (let i = 0; i < timeSlots.length; i++) {
        const assignment = assignments[i % assignments.length];
        await prisma.scheduleItem.upsert({
          where: {
            dayOfWeek_startTime_assignmentId: {
              dayOfWeek: day,
              startTime: timeSlots[i],
              assignmentId: assignment.id
            }
          },
          update: {},
          create: {
            dayOfWeek: day,
            startTime: timeSlots[i],
            endTime: timeSlots[i].replace(/(\d+):/, (m, p1) => (parseInt(p1) + 1).toString().padStart(2, '0') + ':'),
            assignmentId: assignment.id
          }
        });
      }
    }
  }

  console.log("--- Seed Finalizado ---");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
