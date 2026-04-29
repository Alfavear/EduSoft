const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    include: { teacherProfile: true },
    take: 10
  });

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { studentProfile: { include: { course: true } } },
    take: 10
  });

  console.log('\n=== DOCENTES ===');
  teachers.forEach(u => {
    const name = u.teacherProfile ? u.teacherProfile.firstName + ' ' + u.teacherProfile.lastName : '-';
    console.log(`Usuario: ${u.username} | Nombre: ${name}`);
  });

  console.log('\n=== ESTUDIANTES ===');
  students.forEach(u => {
    const name = u.studentProfile ? u.studentProfile.firstName + ' ' + u.studentProfile.lastName : '-';
    const curso = u.studentProfile ? u.studentProfile.course.name : '-';
    console.log(`Usuario: ${u.username} | Nombre: ${name} | Curso: ${curso}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
