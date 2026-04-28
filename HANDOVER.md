# PROMPT DE CONTINUACIÓN - EduSoft

Este prompt está diseñado para ser entregado a una nueva instancia de IA (Antigravity/Gemini) para continuar el desarrollo del sistema EduSoft sin perder contexto.

---

**Contexto del Proyecto:**
EduSoft es un sistema de gestión escolar (SIS) moderno construido con un monorepositorio que separa Frontend (Next.js 15), Database (Prisma/PostgreSQL) y Backend (integrado en Next.js Server Actions). El diseño es "Premium", utilizando una paleta de colores claros/pasteles, glassmorphism y una experiencia de usuario fluida.

**Arquitectura Técnica:**
- **Frontend:** `/Frontend` (Next.js 15, React 19, Vanilla CSS en `globals.css`).
- **Base de Datos:** `/Database` (Prisma ORM, PostgreSQL en Neon.tech).
- **Autenticación:** NextAuth.js con perfiles de ADMIN, TEACHER y STUDENT (validación real contra DB y Bcrypt).
- **Reportes:** Generación de boletines y planillas mediante vistas optimizadas para impresión (`@media print`).
- **Mensajería:** Sistema interno con adjuntos y soporte para envíos masivos.

**Estado Actual (Fase 9 completada):**
1.  **Académico:** Gestión de periodos con pesos dinámicos y esquemas de calificación.
2.  **Seguridad:** Bloqueo de periodos y flujo de solicitudes de acceso temporal (24h).
3.  **Importación:** Carga masiva de notas vía Excel (SheetJS).
4.  **Comunicación:** Sistema de mensajería interna con **Adjuntos** y **Mensajes Masivos** (Ej: Docente a todo su curso).
5.  **Notificaciones:** Campana en el Topbar con alertas en tiempo real y contador de no leídos.
6.  **Reportes:** Boletines y planillas consolidadas 100% operativos e imprimibles.

**Tareas Pendientes / Hoja de Ruta:**
- [ ] **Módulo de Tesorería:** Implementar gestión de pensiones, cobros, estados de cuenta de estudiantes y reportes de recaudo.
- [ ] **Dashboard Estadístico:** Crear widgets visuales para el Admin con tasas de aprobación, deserción y promedios por curso.
- [ ] **Asistencia:** Módulo para que los docentes tomen asistencia diaria desde el dashboard.
- [ ] **App de Padres:** Vista simplificada para que padres reciban circulares y estados de cuenta.

**Instrucciones para la IA:**
1. Lee la `bitacora.md` para entender el historial de cambios.
2. Revisa el `README.md` para la configuración técnica.
3. El cliente de Prisma se genera desde `Database` hacia `Frontend/node_modules/@prisma/client`.
4. Mantén siempre el estilo visual "Premium" definido en `globals.css`.
5. Los Server Actions en `mensajeria/actions.ts` y `clases/actions.ts` son el corazón de la lógica de negocio.

---
*Fin del Prompt.*
