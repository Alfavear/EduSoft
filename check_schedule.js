const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check which assignments have schedule items
  const items = await prisma.scheduleItem.findMany({
    include: { assignment: { include: { teacher: true, course: true, subject: true } } },
    take: 10
  });
  
  console.log('Muestra de ScheduleItems existentes:');
  items.forEach(i => {
    const t = i.assignment.teacher;
    console.log(`  Día ${i.dayOfWeek} ${i.startTime} | ${i.assignment.course.name} | ${i.assignment.subject.name} | Docente ID: ${t.id}`);
  });

  // Check if any items belong to profe.preescolar's teacher profile
  const teacher = await prisma.user.findUnique({ where: { username: 'profe.preescolar' }, include: { teacherProfile: true }});
  const teacherId = teacher?.teacherProfile?.id;
  console.log('\nTeacher ID de profe.preescolar:', teacherId);
  
  const myItems = await prisma.scheduleItem.count({ where: { assignment: { teacherId } } });
  console.log('ScheduleItems para este docente:', myItems);
}

main().catch(console.error).finally(() => prisma.$disconnect());
