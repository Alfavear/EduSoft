const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({ take: 10 });
  const today = new Date();
  today.setHours(0,0,0,0);

  for (const s of students) {
    await prisma.attendance.upsert({
      where: {
        studentId_courseId_date: {
          studentId: s.id,
          courseId: s.courseId,
          date: today
        }
      },
      update: { status: 'PRESENT' },
      create: {
        studentId: s.id,
        courseId: s.courseId,
        date: today,
        status: 'PRESENT'
      }
    });
  }
  console.log('Attendance created for today.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
