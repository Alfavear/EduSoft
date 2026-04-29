# PROMPT DE CONTINUACIÓN - EduSoft

Este prompt está diseñado para ser entregado a una nueva instancia de IA para continuar el desarrollo de EduSoft sin perder contexto.

---

## 🏫 Contexto del Proyecto

**EduSoft** es un Sistema de Gestión Escolar (SIS) moderno y premium, construido con un monorepositorio que separa claramente Frontend, Database y Backend. El sistema está en producción de pruebas conectado a Neon.tech (PostgreSQL).

---

## ⚙️ Arquitectura Técnica

| Capa | Tecnología | Ruta |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19 | `/Frontend` |
| Base de Datos | Prisma ORM → PostgreSQL (Neon.tech) | `/Database/prisma/schema.prisma` |
| Autenticación | NextAuth.js + Bcrypt | `/Frontend/src/lib/auth.ts` |
| Estilos | Vanilla CSS (sin Tailwind) | `/Frontend/src/app/globals.css` |
| Iconos | Lucide React | — |
| Excel | SheetJS (xlsx) | — |

**Comando de desarrollo:** `npm run dev --workspace=Frontend` (desde la raíz del monorepositorio).
**Prisma:** `npx prisma db push --schema=./Database/prisma/schema.prisma`
**Generar cliente:** `npx prisma generate --schema=./Database/prisma/schema.prisma`

---

## 🔑 Variables de Entorno (.env en raíz)

```env
DATABASE_URL="postgresql://..."   # Neon.tech connection string
NEXTAUTH_SECRET="edusoft-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 👥 Roles y Credenciales de Prueba

| Rol | Username | Password |
|---|---|---|
| ADMIN | admin.general | 123456 |
| TEACHER | profe.preescolar (y otros) | 123456 |
| STUDENT | mateo.gomezcmo1 (y otros) | 123456 |

**Regla de creación de usuarios:** `nombre.apellido` / contraseña = número de identificación.

---

## ✅ FASE 1 COMPLETADA — Módulos Implementados

### Módulo: Gestión Académica Core
- Años lectivos y periodos con ponderación dinámica (ej: 30/30/40%).
- Cursos, Materias, Esquemas de calificación (Numérico/Cualitativo).
- Asignaciones Docente-Curso-Materia (`TeacherAssignment`).

### Módulo: Control de Notas
- Planilla de notas por Docente con cálculo automático de promedios ponderados.
- Carga masiva de notas vía Excel (SheetJS).
- Bloqueo de periodos + flujo de solicitudes de habilitación temporal (24h).
- Admin con acceso global a todas las planillas.

### Módulo: Boletines e Informes
- Boletín individual de Estudiante (imprimible/PDF).
- Planilla Consolidada Dinámica con selector de curso y métricas de aprobación.
- Cuadro de Honor y Alertas de Inasistencia.

### Módulo: Comunicación
- Mensajería interna con buzón Entrada/Enviados.
- Adjuntos de archivos (Base64).
- Mensajes masivos a grupos (toda una clase, todo el personal).
- Centro de Notificaciones (campana en topbar, contador en tiempo real).

### Módulo: Calendario Institucional
- Vista mensual interactiva (grilla mes a mes, navegación con flechas).
- Tipos de evento: Reunión, Boletines, Jornada Pedagógica, Festivo, Actividad.
- Segmentación por audiencia (Todos / Docentes / Estudiantes) y por curso.
- Autogestión docente: profesores crean actividades para sus cursos.
- Modal de detalle al hacer clic en un evento.
- **DB Model:** `CalendarEvent` con campos `targetRole`, `courseId`, `creatorId`.

### Módulo: Horario Escolar Semanal
- Grilla premium estilo tablero físico (amarillo + blanco).
- **Estudiante:** Materia + nombre del Docente por bloque.
- **Docente:** Materia + nombre del Curso/Grado por bloque.
- **Admin:** Filtros para consultar por Curso o por Docente específico.
- Imprimible (`@media print`).
- **DB Model:** `ScheduleItem` vinculado a `TeacherAssignment`.
- **Actions:** `/dashboard/horario/actions.ts` → `getWeeklySchedule({ courseId?, teacherId? })`.

### Módulo: Seguridad de Acceso
- Login rediseñado (split layout con ilustración educativa).
- Solicitud de restablecimiento de contraseña desde el login (Tipo + N° Documento).
- Aprobación administrativa en "Centro de Solicitudes" → resetea usuario/contraseña automáticamente.
- **DB Model:** `PasswordResetRequest`.

### Módulo: Gestión de Usuarios
- CRUD de Estudiantes, Docentes y Administradores.
- **Filtros:** Búsqueda por nombre/username (debounce 500ms), filtro por Rol.
- **Paginación servidor:** 15 por página, navegación con botones.
- **DB:** Búsquedas con `prisma.user.count()` y `skip/take`.

---

## 🗺️ ROADMAP — FASE 2: Módulo de Tesorería

### Modelos a Crear en Prisma
```prisma
model FeeType {
  id          String   @id @default(cuid())
  name        String   // "Pensión Mensual", "Matrícula"
  amount      Float
  description String?
  invoices    Invoice[]
}

model Invoice {
  id          String    @id @default(cuid())
  studentId   String
  feeTypeId   String
  amount      Float
  dueDate     DateTime
  status      InvoiceStatus @default(PENDING)
  payments    Payment[]
  student     Student   @relation(...)
  feeType     FeeType   @relation(...)
}

model Payment {
  id        String   @id @default(cuid())
  invoiceId String
  amount    Float
  paidAt    DateTime @default(now())
  invoice   Invoice  @relation(...)
}

enum InvoiceStatus { PENDING PARTIAL PAID OVERDUE }
```

### Módulos de UI a Implementar
1. **Configuración de Conceptos de Cobro:** CRUD de FeeType.
2. **Generación de Deudas:** Crear facturas masivas por mes/curso.
3. **Estado de Cuenta:** Vista por estudiante con deudas y pagos.
4. **Registro de Pagos:** Formulario para abonar contra una factura.
5. **Reporte de Recaudo:** Cuánto se recaudó por mes/concepto.

---

## 📂 Archivos Clave para Referenciar

| Función | Archivo |
|---|---|
| Esquema DB | `/Database/prisma/schema.prisma` |
| Estilos globales | `/Frontend/src/app/globals.css` |
| Autenticación | `/Frontend/src/lib/auth.ts` |
| Layout + Nav | `/Frontend/src/app/dashboard/layout.tsx` |
| Dashboard | `/Frontend/src/app/dashboard/page.tsx` |
| Acciones de Notas | `/Frontend/src/app/dashboard/clases/actions.ts` |
| Acciones de Usuarios | `/Frontend/src/app/dashboard/usuarios/actions.ts` |
| Acciones de Calendario | `/Frontend/src/app/dashboard/calendario/actions.ts` |
| Acciones de Horario | `/Frontend/src/app/dashboard/horario/actions.ts` |
| Acciones de Reset | `/Frontend/src/app/login/actions.ts` |

---

## 🛑 Reglas Críticas para la IA

1. **Leer `node_modules/next/dist/docs/`** antes de usar cualquier API de Next.js — la versión usada (16.x) puede diferir del training data.
2. **Siempre usar `searchParams` como `Promise<...>`** en `page.tsx` del App Router (Next.js 15+).
3. **El cliente de Prisma** se genera en `Frontend/node_modules/@prisma/client`, no en el directorio por defecto.
4. **Para `db push`:** detener el servidor (`taskkill /F /IM node.exe`) antes de generar el cliente.
5. **Estilo:** Mantener el diseño "Premium" de `globals.css`. No usar Tailwind. No usar estilos inline simples sin revisar las clases existentes primero.
6. **Server Actions:** Toda lógica de base de datos va en archivos `actions.ts` con `"use server"` al inicio.

---
*HANDOVER actualizado: 29 de Abril de 2026 — Fase 1 completada. Listo para Fase 2: Tesorería.*
