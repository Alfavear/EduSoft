const { PrismaClient } = require('../../Frontend/node_modules/@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const firstNames = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Elena", "Diego", "Paula", "Andres", "Sofia", "Jorge", "Lucia", "Mateo", "Valentina", "Gabriel", "Isabella", "Nicolas", "Camila", "Samuel", "Victoria"];
const lastNames = ["Perez", "Gomez", "Rodriguez", "Martinez", "Lopez", "Garcia", "Soto", "Ruiz", "Torres", "Ramirez", "Hernandez", "Diaz", "Vargas", "Morales", "Castillo", "Jimenez", "Rojas", "Moreno", "Blanco", "Ortega"];

async function main() {
  console.log("--- Iniciando Re-Seed Robusto ---");

  // 1. Limpieza de Tablas (Orden para evitar errores de FK)
  console.log("Limpiando base de datos...");
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.teacherAssignment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.course.deleteMany();
  await prisma.academicPeriod.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.user.deleteMany({ where: { role: { in: ['STUDENT', 'TEACHER'] } } });

  const hashedDefaultPassword = await bcrypt.hash('123456', 10);

  // 2. Configuración Base
  const numericConfig = await prisma.gradingConfig.upsert({
    where: { id: 'config-1-5' },
    update: {},
    create: {
      id: 'config-1-5',
      name: "Escala 1 a 5",
      type: "NUMERIC",
      minValue: 1.0,
      maxValue: 5.0
    }
  });

  const year2026 = await prisma.academicYear.create({
    data: {
      name: "Año Lectivo 2026",
      isActive: true,
      periods: {
        create: [
          { id: 'period-1', name: "Primer Periodo", weight: 30, status: "OPEN" },
          { id: 'period-2', name: "Segundo Periodo", weight: 30, status: "OPEN" },
          { id: 'period-3', name: "Tercer Periodo", weight: 40, status: "OPEN" }
        ]
      }
    },
    include: { periods: true }
  });

  const periodId = year2026.periods[0].id;

  // 3. Definición de Materias
  const preschoolSubjects = ["Dimensión Cognitiva", "Dimensión Comunicativa", "Dimensión Estética", "Dimensión Corporal", "Dimensión Ética"];
  const primarySubjects = ["Matemáticas", "Lenguaje", "Ciencias Naturales", "Ciencias Sociales", "Inglés", "Educación Física", "Artes"];

  const preschoolSubjs = await Promise.all(preschoolSubjects.map(name => prisma.subject.create({ data: { name, gradingConfigId: numericConfig.id } })));
  const primarySubjs = await Promise.all(primarySubjects.map(name => prisma.subject.create({ data: { name, gradingConfigId: numericConfig.id } })));

  // 4. Cursos
  const coursesData = [
    { name: "Prejardín", type: 'PRE' },
    { name: "Jardín", type: 'PRE' },
    { name: "Transición", type: 'PRE' },
    { name: "Primero", type: 'PRI' },
    { name: "Segundo", type: 'PRI' },
    { name: "Tercero", type: 'PRI' },
    { name: "Cuarto", type: 'PRI' },
    { name: "Quinto", type: 'PRI' }
  ];

  const courses = [];
  for (const c of coursesData) {
    const course = await prisma.course.create({ data: { name: c.name } });
    courses.push({ ...course, type: c.type });
  }

  // 5. Docentes
  console.log("Creando docentes...");
  const preschoolTeacher = await prisma.user.create({
    data: {
      username: 'profe.preescolar',
      password: hashedDefaultPassword,
      role: 'TEACHER',
      teacherProfile: { create: { firstName: "Ana", lastName: "Maria", documentId: "12345", specialization: "Educación Inicial" } }
    },
    include: { teacherProfile: true }
  });

  const primaryTeachers = [];
  for (let i = 1; i <= 5; i++) {
    const t = await prisma.user.create({
      data: {
        username: `profe.primaria${i}`,
        password: hashedDefaultPassword,
        role: 'TEACHER',
        teacherProfile: { create: { firstName: `Docente${i}`, lastName: `Primaria`, documentId: `DOC00${i}`, specialization: "Educación Básica" } }
      },
      include: { teacherProfile: true }
    });
    primaryTeachers.push(t.teacherProfile);
  }

  // 6. Estudiantes y Notas por Salón
  console.log("Generando estudiantes y notas (20 por salón)...");
  for (const course of courses) {
    const isPre = course.type === 'PRE';
    const subjs = isPre ? preschoolSubjs : primarySubjs;

    for (let i = 1; i <= 20; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const docId = `EST-${course.name.substring(0,2).toUpperCase()}-${i.toString().padStart(2, '0')}`;

      const studentUser = await prisma.user.create({
        data: {
          username: `${fName.toLowerCase()}.${lName.toLowerCase()}${course.id.substring(0,3)}${i}`,
          password: hashedDefaultPassword,
          role: 'STUDENT',
          studentProfile: {
            create: {
              firstName: fName,
              lastName: lName,
              documentId: docId,
              courseId: course.id,
              guardianName: "Padre de Familia",
              guardianPhone: "3000000000"
            }
          }
        },
        include: { studentProfile: true }
      });

      const studentId = studentUser.studentProfile.id;

      // Asignar docente y nota para cada materia
      for (const [idx, subject] of subjs.entries()) {
        // Docente: Uno solo para preescolar, varios para primaria
        const teacherProfileId = isPre ? preschoolTeacher.teacherProfile.id : primaryTeachers[idx % primaryTeachers.length].id;

        // Buscar o crear asignación
        let assignment = await prisma.teacherAssignment.findUnique({
          where: { teacherId_courseId_subjectId: { teacherId: teacherProfileId, courseId: course.id, subjectId: subject.id } }
        });

        if (!assignment) {
          assignment = await prisma.teacherAssignment.create({
            data: { teacherId: teacherProfileId, courseId: course.id, subjectId: subject.id }
          });
        }

        // Crear nota aleatoria Primer Periodo (3.5 a 5.0)
        await prisma.grade.create({
          data: {
            studentId,
            assignmentId: assignment.id,
            periodId,
            value: (3.5 + Math.random() * 1.5).toFixed(1)
          }
        });
      }
    }
  }

  console.log("--- Seed Completado Exitosamente ---");
  console.log(`Cursos creados: ${courses.length}`);
  console.log(`Estudiantes creados: ${courses.length * 20}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
