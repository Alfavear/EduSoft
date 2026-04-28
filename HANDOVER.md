# PROMPT DE CONTINUACIÓN - EduSoft

Este prompt está diseñado para ser entregado a una nueva instancia de IA (Antigravity/Gemini) para continuar el desarrollo del sistema EduSoft sin perder contexto.

---

**Contexto del Proyecto:**
EduSoft es un sistema de gestión escolar (SIS) moderno construido con un monorepositorio que separa Frontend (Next.js 15), Database (Prisma/PostgreSQL) y Backend (integrado en Next.js Server Actions). El diseño es "Premium", utilizando una paleta de colores claros/pasteles, glassmorphism y una experiencia de usuario fluida.

**Arquitectura Técnica:**
- **Frontend:** `/Frontend` (Next.js, React 19, Vanilla CSS en `globals.css`).
- **Base de Datos:** `/Database` (Prisma ORM, PostgreSQL en Neon.tech).
- **Autenticación:** NextAuth.js con perfiles de ADMIN, TEACHER y STUDENT.
- **Reportes:** Generación de boletines y planillas mediante vistas optimizadas para impresión (`@media print`).

**Estado Actual (Fase 8 completada):**
1.  **Académico:** Gestión de años lectivos, periodos con pesos porcentuales dinámicos y esquemas de calificación (Numérica/Cualitativa).
2.  **Seguridad:** Bloqueo de periodos cerrados. Los docentes deben solicitar "Habilitación Temporal" (24h) al Admin para subir notas a periodos cerrados.
3.  **Importación:** Soporte completo para carga masiva de notas vía Excel (SheetJS).
4.  **Institucional:** Configuración de logo del colegio (Base64) y datos institucionales operativos.
5.  **Reportes:** Boletines individuales por periodo y planillas consolidadas por materia ya están listos y son imprimibles.

**Tareas Pendientes / Hoja de Ruta:**
- [ ] **Módulo de Tesorería:** Implementar gestión de pensiones, cobros, estados de cuenta de estudiantes y reportes de recaudo.
- [ ] **Dashboard Estadístico:** Crear widgets visuales para el Admin con tasas de aprobación, deserción y promedios por curso.
- [ ] **Notificaciones:** Sistema de alertas internas para nuevas notas, solicitudes de desbloqueo aprobadas o cierres de periodo.
- [ ] **Asistencia:** Módulo para que los docentes tomen asistencia diaria desde el dashboard.

**Instrucciones para la IA:**
1. Lee la `bitacora.md` para entender el historial de cambios.
2. Revisa el `README.md` para la configuración técnica.
3. El cliente de Prisma se genera desde `Database` hacia `Frontend/node_modules/@prisma/client`.
4. Mantén siempre el estilo visual "Premium" definido en `globals.css`.

---
*Fin del Prompt.*
