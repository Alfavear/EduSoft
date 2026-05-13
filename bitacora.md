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
| Tesorería (Conceptos y Facturación) | ✅ En Pausa |
| Matrículas y Promoción (Decreto 1290) | ✅ Completado |
| Boletines y Escalafón (Puestos) | ✅ Completado |

---

## [12 de Mayo de 2026] - Fase 4: Boletines y Escalafón

### Módulos Implementados
- **Diseño de Boletín:** Plantilla profesional fiel al formato físico del colegio (I.H, Juicios Valorativos, Encabezado).
- **Motor de Escalafón:** Lógica para calcular el **puesto (ranking)** de cada estudiante por curso y periodo.
- **Gestión de Indicadores:** Interfaz para configurar juicios valorativos por asignatura, periodo y nivel de desempeño.
- **Integración Normativa:** Escala de valoración nacional (Superior, Alto, Básico, Bajo) integrada en los reportes impresos.

---

## 📅 ITERACIÓN: 12 DE MAYO DE 2026 (SESIÓN NOCHE) - CUMPLIMIENTO NORMATIVO Y REPOSITORIO DIGITAL

### ✅ LOGROS ALCANZADOS:
1. **Centro de Reportes Oficiales (SIMAT / DANE)**:
   - Implementación del módulo de exportación de **Anexo 6A** con todas las variables de caracterización 2024.
   - Creación del sistema de **Auditoría de Datos** que identifica campos faltantes (SISBÉN, Estrato, etc.) antes de exportar.
   - Preparación para reporte **DANE C-600** (Censo Anual).

2. **Registro Integral de Estudiantes (Ficha SIMAT)**:
   - Desvinculación de la creación de estudiantes del flujo de usuarios generales.
   - Nuevo formulario de registro en Matrículas que captura toda la metadata oficial desde el primer momento.
   - Automatización de creación de usuario/contraseña tras el registro académico.

3. **Repositorio de Documentos Físicos**:
   - Implementación de almacenamiento de archivos reales (PDF/Imágenes) en el servidor.
   - Panel de gestión de documentos obligatorios (RC, TI, Certificados Médicos) en la ficha del estudiante.
   - Trazabilidad normativa de **Cambio de Documento** (Novedad SIMAT) con historial de motivos.

4. **Robustez de Base de Datos**:
   - Nuevos modelos: `OfficialDocument` (Archivos físicos) y `DocumentChange` (Historial de identidad).
   - Campos de caracterización MEN añadidos a `Student` y `Teacher`.

5. **Reingeniería del Observador del Estudiante**:
   - Rediseño visual con filtros avanzados por curso y nombre.
   - Implementación de **Soportes Digitales**: Carga de evidencias (PDF/JPG) vinculadas a observaciones.
   - **Matrícula Condicional**: Automatización basada en umbral de faltas configurable y gestión manual proactiva.
   - Panel de citaciones y compromisos con historial de cumplimiento.

### 🚀 PRÓXIMOS PASOS: FASE 3 - Tesorería y Facturación Masiva
**Objetivo:** Automatizar el recaudo institucional.
1. **Facturación por Lotes:** Generar pensiones para todos los estudiantes de un curso con un solo clic.
2. **Dashboard de Tesorería:** Widgets de cartera morosa y proyección de ingresos mensuales.
3. **App de Padres:** Consulta de boletines y pagos desde dispositivos móviles.

---
*Bitácora consolidada: 12 de Mayo de 2026 (Sesión Final).*

