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
| TEACHER | profe.preescolar | 123456 |
| STUDENT | mateo.gomezcmo1 | 123456 |

**Regla de creación de usuarios:** `nombre.apellido` / contraseña = número de identificación.

---

## ✅ Módulos Implementados (Fase 1 y 1.5 Completadas)

### Académico y Notas
- Gestión de periodos con ponderación dinámica.
- Planilla de notas con cálculo automático y carga vía Excel.
- **Filtros Avanzados:** Buscadores y selectores en listados masivos.
- **Asistencia:** Registro diario con reglas de retroactividad y flujo de solicitudes.

### Analítica y Seguimiento
- **Dashboard:** Alertas de inasistencia y bajo rendimiento académico (Alerta Temprana).
- **Observador del Estudiante:** Seguimiento conductual, reuniones con padres y acuerdos.
- **Expediente Institucional:** Reportes detallados optimizados para impresión.

### Organización y Comunicación
- **Calendario Escolar:** Vista mensual de eventos segmentada por audiencia.
- **Horario Semanal:** Grilla interactiva para estudiantes y docentes.
- **Mensajería Interna:** Buzón con adjuntos y mensajes masivos.
- **Notificaciones:** Sistema de alertas en tiempo real (Topbar).

### Seguridad y Administración
- **Login Premium:** Interfaz rediseñada con sistema de recuperación de claves.
- **Gestión de Usuarios:** CRUD robusto con paginación servidor y búsqueda en tiempo real.
- **Control de Periodos:** Cierre/Apertura con workflow de solicitud de acceso.

---

## 🚀 ROADMAP — FASE 2: Módulo de Tesorería

### Objetivos Financieros
1. **Modelado de Datos:** `FeeType` (Conceptos), `Invoice` (Deudas), `Payment` (Recaudo).
2. **Generación Masiva:** Crear facturas para todos los estudiantes al inicio de mes.
3. **Estado de Cuenta:** Vista detallada de pagos pendientes y realizados para padres/estudiantes.
4. **Registro de Pagos:** Interfaz administrativa para asentar abonos manuales.
5. **Reportes:** Balance de ingresos y morosidad.

---

## 📂 Archivos Clave
- **Esquema DB:** `/Database/prisma/schema.prisma`
- **Estilos:** `/Frontend/src/app/globals.css`
- **Acciones Académicas:** `/Frontend/src/app/dashboard/clases/actions.ts`
- **Acciones Observador:** `/Frontend/src/app/dashboard/observador/observadorActions.ts`
- **Acciones Asistencia:** `/Frontend/src/app/dashboard/asistencia/actions.ts`

---

## 🛑 Reglas Críticas
1. **Next.js 15+:** Siempre usar `searchParams` y `params` como `Promise` en `page.tsx`.
2. **Prisma:** Cliente generado en `Frontend/node_modules/@prisma/client`.
3. **Estilos:** Mantener diseño "Premium" (Glassmorphism). NO usar Tailwind.
4. **Server Actions:** Lógica en archivos `actions.ts` con `"use server"`.

---
*HANDOVER consolidado: 12 de Mayo de 2026.*
