const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando carga de datos para flujo de boletines...");

  // 1. Obtener año y periodo activo
  const activeYear = await prisma.academicYear.findFirst({
    where: { isActive: true },
    include: { periods: true }
  });
  if (!activeYear || activeYear.periods.length === 0) {
    console.error("No hay año o periodos activos.");
    return;
  }
  const period = activeYear.periods[0];

  // 2. Obtener un curso con estudiantes
  const course = await prisma.course.findFirst({
    include: { students: true, assignments: { include: { subject: true } } }
  });
  if (!course || course.students.length === 0) {
    console.error("No hay cursos con estudiantes.");
    return;
  }

  console.log(`Procesando curso: ${course.name} con ${course.students.length} estudiantes.`);

  // 3. Crear indicadores para las materias del curso
  for (const as of course.assignments) {
    const levels = ['Superior', 'Alto', 'Básico', 'Bajo'];
    for (const level of levels) {
      await prisma.indicator.upsert({
        where: {
          subjectId_periodId_performanceLevel: {
            subjectId: as.subjectId,
            periodId: period.id,
            performanceLevel: level
          }
        },
        update: {},
        create: {
          subjectId: as.subjectId,
          periodId: period.id,
          performanceLevel: level,
          description: `El estudiante demuestra un desempeño ${level.toLowerCase()} en los contenidos de ${as.subject.name}, cumpliendo con los objetivos propuestos para el primer periodo.`
        }
      });
    }
    
    // Asegurar intensidad horaria
    await prisma.subject.update({
      where: { id: as.subjectId },
      data: { weeklyHours: Math.floor(Math.random() * 5) + 2 }
    });
  }

  // 4. Crear notas diferenciadas para ver el ranking
  for (let i = 0; i < course.students.length; i++) {
    const student = course.students[i];
    // Asignar una base de nota según el índice para asegurar puestos distintos
    const baseGrade = 5.0 - (i * 0.2); 
    
    for (const as of course.assignments) {
      const randomVariation = (Math.random() * 0.4) - 0.2;
      const finalValue = Math.max(1.0, Math.min(5.0, baseGrade + randomVariation)).toFixed(1);

      await prisma.grade.upsert({
        where: {
          studentId_assignmentId_periodId: {
            studentId: student.id,
            assignmentId: as.id,
            periodId: period.id
          }
        },
        update: { value: finalValue },
        create: {
          studentId: student.id,
          assignmentId: as.id,
          periodId: period.id,
          value: finalValue
        }
      });
    }
  }

  // 5. Asegurar info institucional
  await prisma.schoolInfo.upsert({
    where: { id: "institutional-info" },
    update: {
      name: "INSTITUTO SENDERO DEL SABER",
      nit: "900274879-0",
      dane: "413433000610",
      license: "Licencia de Funcionamiento N° 00455 de diciembre 12/2007",
      legalStatus: "Personería Jurídica N° 235 de abril 28/2.008",
      address: "Malagana, calle las palmas N° 13 - 114",
      phone: "3114278004",
      rectorName: "MARIA REPARADA"
    },
    create: {
      id: "institutional-info",
      name: "INSTITUTO SENDERO DEL SABER",
      nit: "900274879-0",
      dane: "413433000610",
      license: "Licencia de Funcionamiento N° 00455 de diciembre 12/2007",
      legalStatus: "Personería Jurídica N° 235 de abril 28/2.008",
      address: "Malagana, calle las palmas N° 13 - 114",
      phone: "3114278004",
      rectorName: "MARIA REPARADA"
    }
  });

  console.log("Carga de datos completada exitosamente.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
