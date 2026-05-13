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

### Módulo: Tesorería (Fase 2 - Core)
- **Facturación Masiva:** Generación de deudas por curso o global.
- **Registro de Pagos:** Interfaz para abonos manuales y control de estados (PENDIENTE/PAGADA).
- **Dashboard Financiero:** Métricas de Cartera, Recaudo y Facturación en tiempo real.
- **Actions:** `/dashboard/tesoreria/actions.ts`.

### Módulo: Boletines y Escalafón (Fase 4)
- **Generación de Boletines:** Plantilla CSS optimizada para impresión (fiel al formato físico).
- **Escalafón (Puestos):** Cálculo automático de ranking por curso basado en el promedio general del periodo.
- **Juicios Valorativos:** Banco de indicadores por asignatura y nivel de desempeño.
- **Configuración Horaria:** Registro de Intensidad Horaria (I.H) por materia.

### Módulo: Cumplimiento Normativo (SIMAT / DANE)
- **Centro de Reportes Oficiales:** Generación de **Anexo 6A** (SIMAT) y preparación para **C-600** (DANE).
- **Auditoría de Calidad:** Herramienta que valida datos obligatorios (SISBÉN, Estrato, PAE) antes de exportar archivos oficiales.
- **Registro Integral de Matrículas:** Formulario normativo que captura metadata oficial y crea automáticamente usuarios de acceso.
- **Repositorio de Documentos Físicos:** Almacenamiento y gestión de archivos (PDF/Imagen) para soportes de matrícula (RC, TI, EPS).
- **Trazabilidad de Identidad:** Histórico de cambios de documento (`DocumentChange`) con auditoría de motivos legales.

---

## 🚀 ROADMAP — FASE 5: Consolidación Financiera y App de Padres

### Próximos Pasos
1. **Facturación Masiva:** Generación automatizada de pensiones mensuales para toda la institución.
2. **Dashboard de Tesorería:** Visualización proactiva de cartera morosa y proyección de ingresos.
3. **App de Padres:** Portal móvil para consulta de boletines, tareas y estado de cuenta.

---

## 📂 Archivos Clave
- **Esquema DB:** `/Database/prisma/schema.prisma`
- **Reportes Oficiales:** `/Frontend/src/app/dashboard/reportes-oficiales/actions.ts`
- **Registro y Matrículas:** `/Frontend/src/app/dashboard/matriculas/actions.ts`
- **Repositorio de Documentos:** `/Frontend/src/app/dashboard/matriculas/DocumentRepository.tsx`
- **Acciones Académicas:** `/Frontend/src/app/dashboard/academico/actions.ts`
- **Observador Estudiante:** `/Frontend/src/app/dashboard/observador/ObserverList.tsx`
- **Control Condicional:** `/Frontend/src/app/dashboard/observador/[studentId]/ConditionalToggle.tsx`
- **Acciones Observador:** `/Frontend/src/app/dashboard/observador/observadorActions.ts`

---

## 🛑 Reglas Críticas
1. **Next.js 15+:** Siempre usar `searchParams` y `params` como `Promise` en `page.tsx`.
2. **Repositorio Físico:** Los archivos se almacenan en `Frontend/public/uploads`.
3. **Prisma:** Cliente generado en `Frontend/node_modules/@prisma/client`.
4. **Estilos:** Mantener diseño "Premium" (Glassmorphism). NO usar Tailwind.
5. **Server Actions:** Lógica en archivos `actions.ts` con `"use server"`.

---
*HANDOVER consolidado: 12 de Mayo de 2026 (Final).*
