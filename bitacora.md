# Bitácora del Proyecto: EduSoft

Esta bitácora registra el progreso, las decisiones arquitectónicas y el estado lógico del desarrollo de **EduSoft**, un Sistema de Gestión Escolar. Su objetivo es mantener un historial claro para que cualquier desarrollador pueda entender el proyecto y continuarlo en caso de ser necesario.

## [28 de Abril de 2026] - Fase de Inicialización y Arquitectura Base

### Decisiones Arquitectónicas
- **Stack Tecnológico:** Next.js (React) para Frontend y lógica Full-stack inicial. Base de datos PostgreSQL alojada en Neon.tech. Prisma ORM para el manejo de base de datos.
- **Estilos:** Vanilla CSS con enfoque "Glassmorphism" (modo oscuro/claro). Se evitó explícitamente el uso de Tailwind CSS.
- **Estructura de Carpetas:** Se optó por una arquitectura de **Monorepositorio** (usando npm workspaces) para separar claramente responsabilidades según el requerimiento:
  - `Frontend/`: Aplicación Next.js.
  - `Database/`: Prisma ORM, migraciones y esquemas.
  - `Backend/`: Espacio reservado para una futura API independiente o microservicios (especialmente para el módulo contable futuro).

### Lógica de Negocio: Roles y Modelo Relacional (Aprobación Pendiente)
El modelo de negocio inicial evolucionó tras la definición de usuarios. Se manejarán 3 roles principales con permisos estructurados:
1. **Administrativo (ADMIN):** Acceso total. Gestión de toda la plataforma.
2. **Docente (TEACHER):** Carga de notas restringida a las materias y cursos que le han sido asignados.
3. **Estudiante (STUDENT):** Acceso en modo lectura para consultar notas y descargar boletines.

**Arquitectura de Asignaciones:** Para resolver el problema de un docente impartiendo múltiples materias a los mismos alumnos, se separan los conceptos:
- **Course (Curso/Grado):** Agrupa a los estudiantes (Ej: Noveno A).
- **Subject (Materia):** Cátedra independiente (Ej: Matemáticas).
- **TeacherAssignment (Asignación):** Modelo puente que define: Docente `X` imparte Materia `Y` en el Curso `Z`. Las notas se atan a esta asignación.

### Tareas Completadas
- [x] Repositorio inicializado y conectado a GitHub (`Alfavear/EduSoft`).
- [x] Aplicación Next.js instalada y limpiada de Tailwind.
- [x] Reestructuración en monorepositorio ejecutada.
- [x] Conexión a base de datos en Neon.tech establecida en archivo `.env`.

### Siguientes Pasos
- Reparar compatibilidad de versión de Prisma (downgrade a v5.x) y limpiar `prisma.config.ts`. (Completado)
- Actualizar el modelo `schema.prisma` con el sistema de usuarios y asignaciones relacionales. (Completado)
- Sincronizar el esquema final en Neon.tech. (Completado)
- Integrar sistema de Autenticación (NextAuth.js). (Completado)

## Ajustes UX/UI y Autenticación (Refinamiento Fase 1)
- **Ruta Principal:** Se configuró redirección automática de `/` hacia `/login` para que el sistema esté bloqueado por defecto.
- **Modelo de Login:** Se migró el campo único de autenticación de `email` a `username` (formato `nombre.apellido`) en el modelo Prisma de User y en Auth.js.
- **Roles Visibles:** El rol y nombre del usuario ahora se renderizan inmediatamente como "píldora" visual tras el login en el Dashboard.

## [Fase 2] Rediseño Visual "App Escolar" (En Progreso)
Tras revisar referencias visuales (Brightwheel, Kinderpedia, Canvas), se descartó el diseño monocromático minimalista inicial por ser demasiado "insípido". Se tomaron las siguientes decisiones de producto:
1. **Estructura App Shell:** El sistema no será una página centrada simple, sino una App de escritorio con barra de navegación lateral izquierda (Sidebar) oscura/institucional y área de contenido principal gris clara.
2. **Uso Funcional del Color:** Se introduce una paleta vibrante en el CSS para clasificar módulos y generar alertas visuales rápidas (tarjetas verdes, naranjas, moradas, etc.).
3. **Módulos Gráficos:** Uso intensivo de iconografía (a través de `lucide-react`) en botones de acción y cuadros estadísticos (Widgets). El Dashboard se convertirá en un hub gráfico de tarjetas en lugar de listas de texto.

## [Fase 3] Lógica Académica y Catálogos (En Progreso)
Se introduce una lógica matemática de evaluación avanzada requerida por el negocio:
- **Modelo de Ponderación:** El año lectivo se divide en periodos dinámicos. En lugar de un promedio simple, se introduce el modelo `AcademicPeriod` que cuenta con un atributo `weight` (porcentaje, ej: 30%). 
- **Integridad de Notas:** El modelo `Grade` abandona los periodos definidos por texto (`term String`) para enlazarse de forma estricta (Foreing Key) con un `AcademicPeriod`.
- **Catálogos CRUD:** Se completaron las interfaces para:
  - **Configuración:** Definición de Años Lectivos y Periodos con ponderación porcentual (Validación 100%).
  - **Catálogo Académico:** Gestión de Cursos (Salones), Materias y Esquemas de Calificación Dinámicos (Numéricos/Letras).
  - **Gestión de Usuarios:** Creación de Docentes y Estudiantes con perfiles persistentes en PostgreSQL.
  - **Asignaciones:** Motor de vinculación Docente-Curso-Materia.

## [Fase 4] Motor de Calificaciones y Vista de Docente (Próximamente)
Con la estructura administrativa completa, el foco se desplaza al usuario Docente:
1. **Mis Clases:** Vista donde el docente visualiza sus asignaciones activas.
2. **Planilla de Notas:** Interfaz para ingresar calificaciones por periodo para cada estudiante.
3. **Cálculo Automático:** Implementación de la lógica de promedios ponderados basados en la configuración de periodos activa.

## [Fase 6] Super-Poderes Administrativos
Habilitación de control total para el perfil Admin:
- **Control Global:** Acceso a todas las planillas de notas del sistema.
- **Reporte Individual:** Consulta de boletines proyectados desde el catálogo de usuarios.

## [Fase 7] Control de Seguridad y Autorizaciones
Implementación de flujo de trabajo para el cierre de notas:
- **Lock System:** Los periodos pueden ser cerrados por el Admin para evitar ediciones.
- **Workflow de Solicitud:** Los docentes pueden solicitar aperturas temporales.
- **Aprobación Granular:** El Admin habilita el acceso por 24 horas para casos específicos.

---
## [Fase 8] Identidad Institucional e Informes
Personalización del sistema para reportes oficiales:
- **Branding Institucional:** Nuevo módulo en Configuración para nombre, NIT, dirección y Logo (Base64).
- **Visor de Boletines:** Los estudiantes pueden imprimir su reporte por periodo con firma de rectoría.
- **Planilla Consolidada:** Los docentes pueden imprimir el informe completo de notas de todos sus estudiantes por materia.
- **Print Optimization:** Estilos CSS `@media print` para asegurar que los documentos se vean perfectos al imprimirse o guardarse como PDF.

---
## [Fase 9] Comunicación Integral y Notificaciones
Implementación del módulo de comunicación bidireccional entre todos los actores:
- **Mensajería Interna:** Sistema de buzón (Entrada/Enviados) con soporte para múltiples destinatarios.
- **Adjuntos:** Habilitación de carga de archivos (Base64) en mensajes para intercambio de material o excusas.
- **Mensajería Masiva:** Los docentes pueden enviar mensajes a toda su clase con un clic, y administradores a todo el personal.
- **Centro de Notificaciones:** Notificaciones en tiempo real en la barra superior con contador de mensajes no leídos y alertas del sistema.
- **Autenticación Robusta:** Migración de sesión de "Mock" a validación real contra base de datos (NextAuth + Prisma + Bcrypt).

---
*Estado Actual: Sistema académico estable con módulo de comunicación avanzado y reportes oficiales. Próximo paso: Módulo de Tesorería y Contabilidad.*

