# Bitácora del Proyecto: EduSoft

Esta bitácora registra el progreso, las decisiones arquitectónicas y el estado lógico del desarrollo de **EduSoft**, un Sistema de Gestión Escolar. Su objetivo es mantener un historial claro para que cualquier desarrollador pueda entender el proyecto y continuarlo en caso de ser necesario.

---

## [28 de Abril de 2026] - Fase 1: Inicialización y Arquitectura Base

### Decisiones Arquitectónicas
- **Stack Tecnológico:** Next.js (React) para Frontend y lógica Full-stack inicial. Base de datos PostgreSQL alojada en Neon.tech. Prisma ORM para el manejo de base de datos.
- **Estilos:** Vanilla CSS con enfoque "Glassmorphism" (modo oscuro/claro). Se evitó explícitamente el uso de Tailwind CSS.
- **Estructura de Carpetas:** Se optó por una arquitectura de **Monorepositorio** (usando npm workspaces):
  - `Frontend/`: Aplicación Next.js.
  - `Database/`: Prisma ORM, migraciones y esquemas.
  - `Backend/`: Espacio reservado para microservicios futuros.

### Lógica de Negocio: Roles
El sistema maneja 3 roles principales:
1. **Administrativo (ADMIN):** Acceso total.
2. **Docente (TEACHER):** Notas restringidas a sus asignaciones.
3. **Estudiante (STUDENT):** Solo lectura de sus notas y boletines.

### Modelo Académico
- **TeacherAssignment:** Docente + Materia + Curso → punto de unión para notas y horarios.
- **AcademicPeriod:** Ponderación dinámica de periodos (ej: 30/30/40%).

---

## [28-29 de Abril de 2026] - Fases 2 al 9: Construcción del Core

### Módulos Implementados
1. **UX/UI Premium:** App Shell con sidebar oscuro, paleta vibrante, glassmorphism y micro-animaciones.
2. **Autenticación Robusta:** NextAuth + Prisma + Bcrypt. Login real contra DB, sesión persistente.
3. **Catálogos CRUD:** Cursos, Materias, Esquemas de calificación, Años lectivos, Periodos con ponderación.
4. **Motor de Calificaciones:** Planilla de notas por Docente, cálculo automático de promedios ponderados.
5. **Seguridad de Periodos:** Cierre/apertura de periodos, flujo de solicitudes temporales de 24h.
6. **Informes y Boletines:** Boletín de Estudiante (imprimible), Planilla Consolidada Dinámica por Curso.
7. **Importación Masiva:** Plantillas Excel (SheetJS) para carga masiva de notas.
8. **Mensajería Interna:** Buzón (Entrada/Enviados), adjuntos Base64, mensajes masivos a clases.
9. **Centro de Notificaciones:** Campana en topbar con contador, tipos INFO/WARN/DANGER.
10. **Identidad Institucional:** Módulo de configuración de branding (Logo, NIT, datos del rector).

---

## [29 de Abril de 2026] - Fase 10-11: Analítica, Organización y Seguridad

### Dashboard Evolucionado
- Widgets en tiempo real: Asistencia del día, Cuadro de Honor, Materia Crítica.
- Alertas tempranas: Identificación de estudiantes con inasistencia > 15%.
- Planilla Consolidada Dinámica con selector de curso y métricas de aprobación.

### Módulo de Calendario Escolar
- Vista de **grilla mensual** (mes a mes) con navegación de flechas.
- Eventos categorizados por tipo: Reunión, Entrega de Boletines, Jornada Pedagógica, Festivo, Actividad.
- **Segmentación de audiencia:** Admin define si el evento es para Todos, Solo Docentes o Solo Estudiantes.
- **Autogestión Docente:** Los profesores pueden crear actividades (exámenes, tareas) para sus cursos.
- **Detalle interactivo:** Clic en un evento abre modal con descripción completa.

### Módulo de Horario Escolar Semanal
- Diseño **premium estilo tablero escolar** (inspirado en referencia del cliente).
- **Estudiante:** Ve Materia + Nombre del Docente en cada bloque.
- **Docente:** Ve Materia + Nombre del Grado/Curso en cada bloque.
- **Admin:** Panel de filtros para consultar el horario de cualquier Curso o Docente específico.
- Optimizado para impresión (`@media print`).

### Login Premium Rediseñado
- Layout split: formulario minimalista a la izquierda, ilustración educativa a la derecha.
- Feedback visual de errores estilizado.

### Sistema de Recuperación de Credenciales
- **Solicitud desde Login:** Botón "¿Olvidó su contraseña?" con modal de identificación.
- **Flujo completo:** Usuario ingresa Tipo y N° de Documento → Admin recibe solicitud → Al aprobar, el sistema resetea automáticamente:
  - **Usuario:** → `nombre.apellido`
  - **Contraseña:** → Número de identificación
- **Admin gestiona** las solicitudes en la sección "Solicitudes" del dashboard.

### Gestión de Usuarios Mejorada
- **Búsqueda en tiempo real** por nombre o username (debounced).
- **Filtro por Rol:** Todos / Administradores / Docentes / Estudiantes.
- **Paginación servidor:** 15 usuarios por página, evita scroll infinito.
- Contador de total de usuarios con filtros aplicados.

---

## ✅ Estado Final: FASE 1 COMPLETADA AL 100%

| Módulo | Estado |
|---|---|
| Autenticación y Roles | ✅ Completado |
| Gestión de Usuarios (CRUD + Filtros) | ✅ Completado |
| Catálogo Académico | ✅ Completado |
| Motor de Calificaciones | ✅ Completado |
| Seguridad de Periodos | ✅ Completado |
| Mensajería Interna | ✅ Completado |
| Boletines e Informes | ✅ Completado |
| Dashboard Analítico | ✅ Completado |
| Calendario Institucional | ✅ Completado |
| Horario Semanal | ✅ Completado |
| Login Premium | ✅ Completado |
| Recuperación de Credenciales | ✅ Completado |

---

## 🚀 FASE 2: Módulo de Tesorería (Próximos Pasos)

**Objetivo:** Gestión financiera de la institución.

### Modelos a Crear (Prisma)
- `FeeType` — Conceptos de cobro (Pensión, Matrícula, Transporte).
- `Invoice` — Deuda generada por estudiante por concepto.
- `Payment` — Abonos registrados contra una factura.

### Módulos a Implementar
- Creación y configuración de conceptos de cobro.
- Generación automática de deudas al inicio de cada mes/periodo.
- Estado de cuenta por estudiante.
- Historial de pagos con registros manuales.
- Reporte de recaudo mensual/anual para el directivo.

---
*Bitácora actualizada: 29 de Abril de 2026 — Fase 1 cerrada.*
