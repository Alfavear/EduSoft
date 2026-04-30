const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const assignments = await prisma.teacherAssignment.findMany({
    include: { teacher: true, course: true, subject: true }
  });

  console.log(`Encontradas ${assignments.length} asignaciones. Re-generando horarios sin conflictos...`);

  await prisma.scheduleItem.deleteMany({});
  
  const days = [1, 2, 3, 4, 5];
  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00'];

  const teacherBusy = {}; // { teacherId: { day: [times] } }
  const courseBusy = {};  // { courseId: { day: [times] } }

  const itemsToCreate = [];

  // Sort assignments to prioritize those with more hours? No, just iterate.
  for (const day of days) {
    for (const assignment of assignments) {
      // Find the first available slot for both teacher and course
      let assigned = false;
      for (const time of timeSlots) {
        if (!teacherBusy[assignment.teacherId]) teacherBusy[assignment.teacherId] = {};
        if (!teacherBusy[assignment.teacherId][day]) teacherBusy[assignment.teacherId][day] = [];
        
        if (!courseBusy[assignment.courseId]) courseBusy[assignment.courseId] = {};
        if (!courseBusy[assignment.courseId][day]) courseBusy[assignment.courseId][day] = [];

        if (!teacherBusy[assignment.teacherId][day].includes(time) && 
            !courseBusy[assignment.courseId][day].includes(time)) {
          
          itemsToCreate.push({
            dayOfWeek: day,
            startTime: time,
            endTime: time.split(':')[0].padStart(2,'0') + ':50',
            assignmentId: assignment.id
          });

          teacherBusy[assignment.teacherId][day].push(time);
          courseBusy[assignment.courseId][day].push(time);
          assigned = true;
          break; // Next assignment
        }
      }
      if (!assigned) {
        console.warn(`No se pudo asignar un slot para ${assignment.subject.name} en ${assignment.course.name} el día ${day}`);
      }
    }
  }

  const created = await prisma.scheduleItem.createMany({ data: itemsToCreate });
  console.log(`✅ Creados ${created.count} items de horario sin conflictos.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
