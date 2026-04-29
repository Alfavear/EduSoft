const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get all assignments (all teachers, all courses)
  const assignments = await prisma.teacherAssignment.findMany({
    include: { teacher: true, course: true, subject: true }
  });

  console.log(`Encontradas ${assignments.length} asignaciones. Generando horarios...`);

  // Delete existing schedule items to avoid duplicates
  await prisma.scheduleItem.deleteMany({});
  console.log('Items anteriores eliminados.');

  const days = [1, 2, 3, 4, 5]; // Lunes a Viernes
  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00'];

  // Group assignments by course to build a coherent schedule per course
  const byCourse = {};
  assignments.forEach(a => {
    if (!byCourse[a.courseId]) byCourse[a.courseId] = [];
    byCourse[a.courseId].push(a);
  });

  const itemsToCreate = [];

  for (const [courseId, courseAssignments] of Object.entries(byCourse)) {
    // Distribute assignments across the week
    let slotIndex = 0;
    for (const day of days) {
      for (let i = 0; i < courseAssignments.length && slotIndex < timeSlots.length * days.length; i++) {
        const assignment = courseAssignments[i % courseAssignments.length];
        const timeIdx = Math.floor(slotIndex / days.length) % timeSlots.length;
        const time = timeSlots[timeIdx];
        
        // Check if already added this assignment on this day
        const alreadyExists = itemsToCreate.find(
          it => it.assignmentId === assignment.id && it.dayOfWeek === day && it.startTime === time
        );
        
        if (!alreadyExists) {
          itemsToCreate.push({
            dayOfWeek: day,
            startTime: time,
            endTime: time.replace(':00', ':55'),
            assignmentId: assignment.id
          });
        }
        slotIndex++;
      }
    }
  }

  // Smarter approach: assign one slot per subject per day rotated
  const finalItems = [];
  for (const [courseId, courseAssignments] of Object.entries(byCourse)) {
    days.forEach((day, dayIdx) => {
      courseAssignments.forEach((assignment, aIdx) => {
        const time = timeSlots[aIdx % timeSlots.length];
        finalItems.push({
          dayOfWeek: day,
          startTime: time,
          endTime: time.split(':')[0].padStart(2,'0') + ':55',
          assignmentId: assignment.id
        });
      });
    });
  }

  // Create in batches
  const created = await prisma.scheduleItem.createMany({ data: finalItems });
  console.log(`✅ Creados ${created.count} items de horario.`);

  // Verify for profe.preescolar
  const teacher = await prisma.user.findUnique({ 
    where: { username: 'profe.preescolar' }, 
    include: { teacherProfile: true }
  });
  const count = await prisma.scheduleItem.count({ 
    where: { assignment: { teacherId: teacher?.teacherProfile?.id } } 
  });
  console.log(`Items para profe.preescolar: ${count}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
