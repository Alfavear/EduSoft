const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando Seed...");

  // 1. Limpiar base de datos (Opcional, ten cuidado)
  // await prisma.grade.deleteMany();
  // await prisma.accessRequest.deleteMany();
  // await prisma.teacherAssignment.deleteMany();
  // await prisma.student.deleteMany();
  // await prisma.teacher.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.subject.deleteMany();
  // await prisma.course.deleteMany();
  // await prisma.academicPeriod.deleteMany();
  // await prisma.academicYear.deleteMany();
  // await prisma.gradingConfig.deleteMany();

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedTeacherPassword = await bcrypt.hash('profe123', 10);
  const hashedStudentPassword = await bcrypt.hash('alumno123', 10);

  // 2. Crear Configuración de Notas
  const numericConfig = await prisma.gradingConfig.create({
    data: {
      name: "Escala Numérica 1-5",
      type: "NUMERIC",
      minValue: 1.0,
      maxValue: 5.0
    }
  });

  // 3. Crear Año y Periodos
  const year2026 = await prisma.academicYear.create({
    data: {
      name: "Año Lectivo 2026",
      isActive: true,
      periods: {
        create: [
          { name: "Primer Periodo", weight: 30.0, status: "OPEN" },
          { name: "Segundo Periodo", weight: 30.0, status: "OPEN" },
          { name: "Tercer Periodo", weight: 40.0, status: "OPEN" }
        ]
      }
    },
    include: { periods: true }
  });

  // 4. Crear Cursos y Materias
  const curso11A = await prisma.course.create({
    data: { name: "Once A", description: "Grado superior jornada mañana" }
  });

  const fisica = await prisma.subject.create({
    data: { name: "Física", gradingConfigId: numericConfig.id }
  });

  // 5. Crear Usuarios y Perfiles
  // Admin
  await prisma.user.upsert({
    where: { username: 'admin.general' },
    update: {},
    create: {
      username: 'admin.general',
      password: hashedAdminPassword,
      role: 'ADMIN'
    }
  });

  // Docente
  const teacherUser = await prisma.user.create({
    data: {
      username: 'juan.perez',
      password: hashedTeacherPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: { firstName: "Juan", lastName: "Pérez" }
      }
    },
    include: { teacherProfile: true }
  });

  // Estudiante
  const studentUser = await prisma.user.create({
    data: {
      username: 'maria.gomez',
      password: hashedStudentPassword,
      role: 'STUDENT',
      studentProfile: {
        create: { 
          firstName: "María", 
          lastName: "Gómez",
          courseId: curso11A.id
        }
      }
    },
    include: { studentProfile: true }
  });

  // 6. Crear Asignación (Vincular todo)
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacherUser.teacherProfile.id,
      courseId: curso11A.id,
      subjectId: fisica.id
    }
  });

  console.log("Seed completado con éxito! ✅");
  console.log("Admin: admin.general / admin123");
  console.log("Docente: juan.perez / profe123");
  console.log("Estudiante: maria.gomez / alumno123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
