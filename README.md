# EduSoft — Sistema de Gestión Escolar Integral

> 🎓 Plataforma moderna y premium para la administración académica, comunicación institucional y seguimiento integral de estudiantes.

---

## 🚀 Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Base de Datos | PostgreSQL · Neon.tech |
| ORM | Prisma v5 |
| Autenticación | NextAuth.js + Bcrypt |
| Estilos | Vanilla CSS (sin Tailwind) · Glassmorphism |
| Iconos | Lucide React |
| Excel | SheetJS (xlsx) |

---

## 🏗️ Estructura del Proyecto

```
edusoft/
├── Frontend/            ← Aplicación Next.js (UI + Server Actions)
├── Database/
│   └── prisma/
│       └── schema.prisma ← Modelos de base de datos
├── Backend/             ← Reservado para microservicios futuros
├── bitacora.md          ← Historial de cambios y decisiones
├── HANDOVER.md          ← Prompt de contexto para IA
└── README.md            ← Este archivo
```

---

## ✨ Módulos de la Fase 1 (Completados)

### 👨‍💼 Rol Administrador
| Módulo | Descripción |
|---|---|
| Gestión de Usuarios | CRUD completo con búsqueda, filtros por rol y paginación |
| Catálogo Académico | Cursos, Materias, Esquemas de calificación |
| Configuración | Años lectivos, periodos con ponderación % y branding institucional |
| Asignaciones | Vinculación Docente–Curso–Materia |
| Control de Periodos | Apertura/cierre + aprobación de solicitudes de desbloqueo |
| Reportes Analíticos | Dashboard con alertas, cuadro de honor y planillas dinámicas |
| Calendario Escolar | Creación de eventos institucionales con segmentación de audiencia |
| Horario Institucional | Consulta de horario por Curso o Docente |
| Recuperación de Credenciales | Aprobación de solicitudes de reseteo (usuario + contraseña) |

### 👩‍🏫 Rol Docente
| Módulo | Descripción |
|---|---|
| Planilla de Notas | Ingreso por estudiante/periodo con cálculo automático de promedios |
| Importación Excel | Carga masiva con plantilla descargable |
| Asistencia | Registro diario con solicitudes para ajustes retroactivos |
| Horario Personal | Vista semanal con materia y grado por bloque |
| Calendario | Visualización de eventos generales + creación de actividades propias |
| Mensajería | Envío individual y masivo a clases con soporte de adjuntos |

### 👨‍🎓 Rol Estudiante
| Módulo | Descripción |
|---|---|
| Boletín Personal | Notas por periodo con promedio ponderado e impresión en PDF |
| Horario Personal | Vista semanal con materia y docente por bloque |
| Calendario | Visualización de eventos y actividades del curso |
| Mensajería | Buzón personal (Entrada/Enviados) |

---

## 🎨 Filosofía de Diseño

- **Premium Visual:** Sidebar oscuro institucional + área de contenido clara.
- **Glassmorphism:** Tarjetas con blur y transparencias.
- **Micro-animaciones:** Hover effects y transiciones suaves.
- **Color semántico:** Verde = OK, Naranja = Alerta, Rojo = Crítico, Azul = Info.
- **Imprimible:** Estilos `@media print` para boletines, planillas y horarios.

---

## 🛠️ Instalación y Configuración

### 1. Pre-requisitos
- Node.js 18+
- Cuenta en Neon.tech (PostgreSQL)

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de Entorno (`.env` en la raíz)
```env
DATABASE_URL="postgresql://usuario:password@host/neondb?sslmode=require"
NEXTAUTH_SECRET="tu-secreto-seguro"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Sincronizar Base de Datos
```bash
npx prisma db push --schema=./Database/prisma/schema.prisma
npx prisma generate --schema=./Database/prisma/schema.prisma
```

### 5. Iniciar el servidor de desarrollo
```bash
npm run dev --workspace=Frontend
```

### 6. Acceder
Abrir [http://localhost:3000](http://localhost:3000) — redirige automáticamente al login.

---

## 🔐 Credenciales de Prueba

| Rol | Usuario | Contraseña |
|---|---|---|
| Admin | admin.general | 123456 |
| Docente | profe.preescolar | 123456 |
| Estudiante | mateo.gomezcmo1 | 123456 |

**Regla de credenciales:** Usuario = `nombre.apellido`, Contraseña = número de identificación.

---

## 🗺️ Roadmap

### ✅ Fase 1: Sistema Académico Integral
Gestión de notas, reportes, comunicación, calendario y horarios. **COMPLETADA.**

### 🔄 Fase 2: Módulo de Tesorería
- Conceptos de cobro configurables (Pensión, Matrícula, Transporte).
- Generación automática de facturas por estudiante.
- Estado de cuenta en tiempo real.
- Registro de pagos y recibos.
- Reporte de recaudo mensual/anual.

### ⏳ Fase 3: Portal de Padres
- Vista simplificada para acudientes.
- Circulares, estado de cuenta y boletines.
- Notificaciones push.

---

## 📄 Documentación Interna

- **Historial de cambios:** [`bitacora.md`](./bitacora.md)
- **Contexto para IA:** [`HANDOVER.md`](./HANDOVER.md)

---

Desarrollado con ❤️ para la modernización educativa.  
*v2.0 — Fase 1 completada el 29 de Abril de 2026.*
