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

### Dashboard Evolucionado y Alerta Temprana
- **Widgets en tiempo real:** Asistencia del día, Cuadro de Honor, Materia Crítica.
- **Alerta Temprana (Notas):** Motor de análisis que identifica estudiantes con promedios inferiores a un umbral configurable (ej. 3.0) y los resalta en el Dashboard.
- **Alerta Temprana (Asistencia):** Identificación de estudiantes con inasistencia > 15%.

### Módulo de Asistencias e Inasistencias
- **Toma de Asistencia:** Registro diario con estados (Presente, Falla, Retraso, Justificado).
- **Reglas de Registro:** Configuración de límite de días para registro retroactivo. Sistema de solicitudes de autorización para registros fuera de tiempo con aprobación de Admin.

### Módulo de Calendario Escolar
- Vista de **grilla mensual** con navegación interactiva.
- Eventos categorizados por tipo y segmentación de audiencia (Todos, Docentes, Estudiantes).
- Autogestión docente para actividades y exámenes.

### Módulo de Horario Escolar Semanal
- Diseño premium estilo tablero escolar.
- Vistas personalizadas para Estudiante, Docente y Administrador.
- Optimizado para impresión.

### Seguridad y Gestión de Usuarios
- **Login Premium:** Rediseño visual con feedback de errores.
- **Recuperación de Credenciales:** Flujo de solicitud desde login y aprobación administrativa.
- **Gestión de Usuarios:** Búsqueda en tiempo real, filtros por rol y paginación servidor.
- **Autogestión de Claves:** Cambio de contraseña por el usuario y Reset administrativo.

---

## [8 de Mayo de 2026] - Fase 1.5: Observador del Estudiante y Estabilización

### Módulo: Observador del Estudiante (Seguimiento Conductual)
- **Estructura Relacional:** Implementación de `Observation`, `FollowUp`, `ParentMeeting` y `Agreement`.
- **Dashboard de Seguimiento:** Vista general con contadores de alertas disciplinarias.
- **Expediente Institucional:** Generación de reportes PDF exhaustivos con historial completo.
- **Lógica de Condicionalidad:** Automatización del estado "Matrícula Condicional".

### Centro de Reportes Robustecido
- **Directorio de Docentes:** Carga académica, contacto y especialidad.
- **Central de Observador:** Generación masiva de expedientes disciplinarios.
- **Reporte de Matrícula Condicional:** Filtro crítico para seguimiento de compromisos.
- **Malla Curricular Dinámica:** Resumen estructural de materias por curso.

### Estabilización Técnica
- **Compatibilidad Next.js 15+:** Refactorización de rutas dinámicas (`params` como `Promise`).
- **Optimización de Prisma:** Uso de `_count` y corrección de tipados "implicit any".

---

## ✅ Estado Actual: FASE 1.5 COMPLETADA AL 100%

| Módulo | Estado |
|---|---|
| Autenticación y Seguridad | ✅ Completado |
| Gestión Académica Core | ✅ Completado |
| Control de Notas y Asistencia | ✅ Completado |
| Alerta Temprana | ✅ Completado |
| Mensajería y Notificaciones | ✅ Completado |
| Boletines e Informes | ✅ Completado |
| Calendario y Horarios | ✅ Completado |
| Observador del Estudiante | ✅ Completado |

---

## 🚀 FASE 2: Módulo de Tesorería (Próximos Pasos)
**Objetivo:** Gestión financiera de la institución.
1. **Configuración:** Conceptos de cobro (Pensión, Matrícula).
2. **Facturación:** Generación automática de deudas mensuales.
3. **Recaudo:** Registro de pagos y estados de cuenta por estudiante.
4. **Reportes:** Informe de recaudo mensual/anual para directivos.

---
*Bitácora consolidada: 12 de Mayo de 2026.*
