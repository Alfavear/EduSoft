const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando Seed con datos dinámicos...");

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedTeacherPassword = await bcrypt.hash('profe123', 10);
  const hashedStudentPassword = await bcrypt.hash('alumno123', 10);

  // Configuración de Notas
  const numericConfig = await prisma.gradingConfig.create({
    data: {
      name: "Escala Numérica 1-5",
      type: "NUMERIC",
      minValue: 1.0,
      maxValue: 5.0
    }
  });

  // Año y Periodos
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

  const periods = year2026.periods;

  // Cursos
  const curso11A = await prisma.course.create({
    data: { name: "Once A", description: "Grado superior jornada mañana" }
  });

  // Materias
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: "Física", gradingConfigId: numericConfig.id } }),
    prisma.subject.create({ data: { name: "Matemáticas", gradingConfigId: numericConfig.id } }),
    prisma.subject.create({ data: { name: "Historia", gradingConfigId: numericConfig.id } })
  ]);

  // Usuarios
  await prisma.user.upsert({
    where: { username: 'admin.general' },
    update: {},
    create: { username: 'admin.general', password: hashedAdminPassword, role: 'ADMIN' }
  });

  const teacher = await prisma.user.create({
    data: {
      username: 'juan.perez',
      password: hashedTeacherPassword,
      role: 'TEACHER',
      teacherProfile: { create: { firstName: "Juan", lastName: "Pérez" } }
    },
    include: { teacherProfile: true }
  });

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

  const student = studentUser.studentProfile;

  // Asignaciones y Notas
  for (const subject of subjects) {
    const assignment = await prisma.teacherAssignment.create({
      data: {
        teacherId: teacher.teacherProfile.id,
        courseId: curso11A.id,
        subjectId: subject.id
      }
    });

    // Agregar nota para el primer periodo
    await prisma.grade.create({
      data: {
        studentId: student.id,
        assignmentId: assignment.id,
        periodId: periods[0].id,
        value: (3 + Math.random() * 2).toFixed(1)
      }
    });
  }

  console.log("Seed completado! Maria ahora tiene notas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
