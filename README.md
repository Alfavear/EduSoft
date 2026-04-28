# EduSoft - Sistema de Gestión Escolar Inteligente

EduSoft es una plataforma moderna diseñada para simplificar la administración académica, el seguimiento de estudiantes y la gestión de calificaciones en instituciones educativas.

## 🚀 Tecnologías Principales

- **Frontend:** Next.js 15+ (App Router), React 19, Tailwind CSS (para estructura base) y Vanilla CSS para rediseño vibrante.
- **Backend:** Next.js Server Actions para lógica de negocio segura y eficiente.
- **Base de Datos:** PostgreSQL (Neon.tech) con **Prisma ORM**.
- **Autenticación:** NextAuth.js (Auth.js) con estrategia basada en credenciales personalizadas.
- **Iconografía:** Lucide React.
- **Manejo de Datos:** XLSX (SheetJS) para importación/exportación masiva.

## 🏗️ Estructura del Proyecto

El proyecto está organizado como un monorepositorio estructurado:

- `/Frontend`: Aplicación principal de usuario, interfaces y lógica de servidor.
- `/Database`: Esquema de Prisma, migraciones y configuración de la base de datos.
- `/Backend`: (Reservado para microservicios futuros, actualmente integrado en Next.js).

## ✨ Características Principales

### 👨‍💼 Administrador
- **Gestión de Usuarios:** CRUD de Estudiantes, Docentes y Administrativos.
- **Catálogo Académico:** Configuración de Salones (Cursos) y Materias.
- **Lógica de Evaluación:** Definición de esquemas de calificación dinámica (Numérica o Cualitativa).
- **Configuración de Periodos:** Gestión de años lectivos con ponderación porcentual personalizada (ej: 30%, 30%, 40%).
- **Seguridad:** Control de apertura y cierre de periodos para ingreso de notas.
- **Autorizaciones:** Sistema de aprobación de solicitudes de desbloqueo para docentes.

### 👩‍🏫 Docente
- **Planilla de Notas:** Interfaz intuitiva para el ingreso de calificaciones.
- **Carga Masiva:** Sistema de descarga de plantillas Excel y carga por lotes.
- **Seguridad:** Flujo de solicitud de habilitación para periodos cerrados.

### 👨‍🎓 Estudiante
- **Dashboard Personal:** Visualización de cursos activos.
- **Boletín en Tiempo Real:** Consulta de notas por periodo con cálculo automático de promedio ponderado.

## 🛠️ Instalación y Configuración

1. Clonar el repositorio.
2. Instalar dependencias en la raíz y en la carpeta Frontend:
   ```bash
   npm install
   cd Frontend && npm install
   ```
3. Configurar variables de entorno (`.env`):
   ```env
   DATABASE_URL="tu-url-de-neon-tech"
   NEXTAUTH_SECRET="tu-secreto"
   ```
4. Sincronizar base de datos:
   ```bash
   npx prisma generate --schema=./Database/prisma/schema.prisma
   ```
5. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

---
Desarrollado con ❤️ para la modernización educativa.
