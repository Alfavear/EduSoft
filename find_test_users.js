const { PrismaClient } = require('./Frontend/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.findFirst({ where: { name: "Primero" } });
  const student = await prisma.student.findFirst({ 
    where: { courseId: course.id },
    include: { user: true }
  });
  console.log('Student in Primero:', student.user.username);
  
  const teacher = await prisma.teacher.findFirst({
    include: { user: true }
  });
  console.log('Teacher:', teacher.user.username);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
