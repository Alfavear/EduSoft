# 🔧 EduSoft - Documentación Técnica

> **Guía completa de arquitectura, stack tecnológico e implementación de EduSoft**

---

## 📑 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Base de Datos](#base-de-datos)
5. [Autenticación](#autenticación)
6. [API & Server Actions](#api--server-actions)
7. [Componentes Frontend](#componentes-frontend)
8. [Patrones y Convenciones](#patrones-y-convenciones)
9. [Flujos de Datos](#flujos-de-datos)
10. [Deployment](#deployment)
11. [Performance](#performance)
12. [Testing](#testing)

---

## 🏗️ Arquitectura General

### Arquitectura Monorepositorio (Monorepo)

```
EduSoft/
├── Frontend/           # Next.js App (Client + Server)
├── Database/          # Prisma Schema & Migrations
└── Backend/           # Reservado para microservicios futuros
```

### Modelo de Arquitectura: Full-Stack Next.js 15+

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     React 19 Components + Tailwind CSS + CSS Custom  │  │
│  │     (Formularios, Tablas, Dashboards, Reportes)     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │ (HTTP/TLS)
┌────────────────────────▼─────────────────────────────────────┐
│          SERVIDOR (Next.js 15+ App Router)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Server Components + Server Actions                   │  │
│  │ (Lógica de negocio, Validaciones, Autenticación)    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│        BASE DE DATOS (PostgreSQL @ Neon.tech)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Prisma ORM - Gestión de Modelos y Migraciones       │  │
│  │ Tablas: Users, Courses, Grades, Periods, Requests  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos General

```
Usuario (Browser)
    ↓
React Component (Client)
    ↓
Server Action (Validación + Lógica)
    ↓
Prisma ORM (Operación DB)
    ↓
PostgreSQL (Persistencia)
    ↓
Response → Revalidación de Datos
    ↓
UI Actualizada (React)
```

---

## 🚀 Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|----------|---------|----------|
| **Next.js** | 15+ | Framework React, App Router, SSR/SSG |
| **React** | 19 | Biblioteca UI con hooks y RSC |
| **TypeScript** | Latest | Tipado estático, seguridad de tipos |
| **Tailwind CSS** | Latest | Utility-first CSS framework (base) |
| **Vanilla CSS** | N/A | Glassmorphism, micro-animaciones |
| **Lucide React** | Latest | Iconografía SVG modular |
| **Framer Motion** | Latest | Animaciones avanzadas (futuro) |

### Backend / Runtime

| Tecnología | Versión | Propósito |
|----------|---------|----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Next.js Server Actions** | 15+ | Serverless functions, mutations |
| **NextAuth.js (Auth.js)** | Latest | Autenticación y sesiones |

### Base de Datos

| Tecnología | Propósito |
|----------|----------|
| **PostgreSQL** | Base de datos relacional (Neon.tech serverless) |
| **Prisma ORM** | ORM type-safe, migrations automáticas |

### Utilidades y Librerías

| Librería | Propósito |
|----------|----------|
| **XLSX (SheetJS)** | Importación/exportación masiva Excel |
| **Zod** | Validación de esquemas (futuro) |
| **date-fns** | Manipulación de fechas |
| **jsPDF** | Generación de PDFs (futuro) |

### DevOps & Deployment

| Servicio | Propósito |
|----------|----------|
| **Vercel** | Hosting de Next.js, CI/CD automático |
| **Neon.tech** | PostgreSQL serverless con auto-scaling |
| **Git/GitHub** | Control de versiones, CI/CD |

---

## 📂 Estructura del Proyecto

### Estructura Detallada

```
EduSoft/
├── Frontend/
│   ├── app/                        # App Router de Next.js
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Home page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      # Página login
│   │   │   └── register/page.tsx   # Página registro
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Layout autenticado
│   │   │   ├── page.tsx            # Dashboard principal
│   │   │   ├── admin/
│   │   │   │   ├── users/          # Gestión de usuarios
│   │   │   │   ├── courses/        # Gestión de cursos
│   │   │   │   ├── grades/         # Configuración evaluación
│   │   │   │   ├── periods/        # Gestión períodos
│   │   │   │   └── requests/       # Solicitudes desbloqueo
│   │   │   ├── teacher/
│   │   │   │   ├── grades/         # Planilla de notas
│   │   │   │   ├── bulk-upload/    # Carga masiva
│   │   │   │   └── requests/       # Mis solicitudes
│   │   │   └── student/
│   │   │       ├── courses/        # Mis cursos
│   │   │       └── report-card/    # Boletín académico
│   │   ├── api/                    # API Routes (si aplica)
│   │   └── error.tsx               # Error boundaries
│   ├── components/
│   │   ├── ui/                     # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Form.tsx
│   │   │   └── Card.tsx
│   │   ├── forms/                  # Formularios específicos
│   │   ├── layout/                 # Componentes de layout
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Navigation.tsx
│   │   └── sections/               # Componentes de página
│   ├── lib/
│   │   ├── auth.ts                 # Configuración NextAuth
│   │   ├── db.ts                   # Cliente Prisma
│   │   ├── utils.ts                # Utilidades generales
│   │   ├── validation.ts           # Esquemas Zod
│   │   ├── xlsx-handler.ts         # Manejo de Excel
│   │   └── constants.ts            # Constantes de app
│   ├── styles/
│   │   ├── globals.css             # Estilos globales
│   │   ├── glassmorphism.css       # Componentes glass
│   │   └── animations.css          # Animaciones CSS
│   ├── types/
│   │   ├── index.ts                # Tipos principales
│   │   ├── auth.ts                 # Tipos autenticación
│   │   ├── models.ts               # Tipos de modelos
│   │   └── api.ts                  # Tipos de API
│   ├── actions/                    # Server Actions
│   │   ├── auth.actions.ts         # Acciones autenticación
│   │   ├── users.actions.ts        # Acciones usuarios
│   │   ├── grades.actions.ts       # Acciones calificaciones
│   │   ├── courses.actions.ts      # Acciones cursos
│   │   └── periods.actions.ts      # Acciones períodos
│   ├── hooks/                      # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useForm.ts
│   ├── public/                     # Archivos estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── .env.example                # Variables de ejemplo
│   └── package.json
│
├── Database/
│   ├── schema.prisma               # Schema Prisma
│   ├── migrations/                 # Migraciones SQL
│   │   ├── 001_init/
│   │   ├── 002_users/
│   │   └── ...
│   ├── seed.ts                     # Script seed (datos iniciales)
│   └── .env.example
│
├── Backend/                        # Reservado
│   └── README.md
│
├── .github/
│   ├── workflows/                  # CI/CD workflows
│   │   ├── test.yml
│   │   ├── deploy.yml
│   │   └── lint.yml
│   └── copilot-instructions.md
│
├── .gitignore
├── .env.example
├── package.json                    # Dependencias raíz
├── tsconfig.json
├── next.config.js
└── README.md

```

---

## 🗄️ Base de Datos

### Schema Prisma

```prisma
// Modelos principales

model User {
  id          String    @id @default(cuid())
  email       String    @unique
  password    String    // Hasheada con bcrypt
  fullName    String
  role        Role      @default(STUDENT) // ADMIN, TEACHER, STUDENT
  department  String?
  phone       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relaciones
  courses     Course[]
  grades      Grade[]
  requests    UnblockRequest[]
  
  @@index([email, role])
}

model Course {
  id          String    @id @default(cuid())
  name        String    // "6° A"
  grade       Int       // 6
  section     String    // "A"
  capacity    Int       @default(40)
  schoolYear  Int       // 2026
  createdAt   DateTime  @default(now())
  
  // Relaciones
  students    User[]    @relation("CourseStudents")
  teachers    User[]    @relation("CourseTeachers")
  subjects    Subject[]
  grades      Grade[]
  
  @@unique([grade, section, schoolYear])
}

model Subject {
  id          String    @id @default(cuid())
  name        String    // "Matemáticas"
  code        String    @unique
  courseId    String
  teacherId   String
  
  course      Course    @relation(fields: [courseId], references: [id])
  teacher     User      @relation(fields: [teacherId], references: [id])
  grades      Grade[]
  
  @@index([courseId, teacherId])
}

model EvaluationSchema {
  id          String    @id @default(cuid())
  name        String
  type        EvalType  // NUMERIC | QUALITATIVE
  minValue    Float?
  maxValue    Float?
  scale       String[]? // Para cualitativo: ["Excelente", "Bueno", ...]
  
  periods     Period[]
}

model Period {
  id          String    @id @default(cuid())
  name        String    // "Período 1"
  number      Int       // 1, 2, 3
  startDate   DateTime
  endDate     DateTime
  weight      Float     // 0.30 (30%)
  isOpen      Boolean   @default(true)
  schoolYear  Int
  evaluationSchemaId String
  
  evaluationSchema EvaluationSchema @relation(fields: [evaluationSchemaId], references: [id])
  grades      Grade[]
  
  @@unique([number, schoolYear])
}

model Grade {
  id          String    @id @default(cuid())
  studentId   String
  subjectId   String
  periodId    String
  value       Float
  component   String    // "Examen", "Tarea", etc.
  remarks     String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  student     User      @relation(fields: [studentId], references: [id])
  subject     Subject   @relation(fields: [subjectId], references: [id])
  period      Period    @relation(fields: [periodId], references: [id])
  
  @@unique([studentId, subjectId, periodId, component])
  @@index([studentId, periodId])
}

model UnblockRequest {
  id          String    @id @default(cuid())
  teacherId   String
  periodId    String
  reason      String
  status      RequestStatus @default(PENDING) // PENDING, APPROVED, REJECTED
  approvedBy  String?
  approvedAt  DateTime?
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  
  teacher     User      @relation(fields: [teacherId], references: [id])
  
  @@index([status, teacherId])
}

// --- Módulo: Observador del Estudiante ---

model SchoolInfo {
  id                  String   @id @default(cuid())
  name                String
  nit                 String   @unique
  address             String
  phone               String
  email               String
  website             String?
  principalName       String
  logoUrl             String?
  alertThreshold      Float    @default(3.0)
  attendanceLimitDays Int      @default(1)
  conditionalThreshold Int     @default(3) // Umbral para matrícula condicional
  sessionTimeout      Int      @default(60) // En minutos
  keepSessionOpen     Boolean  @default(false)
}

model OfficialDocument {
  id          String   @id @default(cuid())
  studentId   String
  name        String   // "RC", "TI", "Certificado Médico"
  type        String   // "IMAGE", "PDF"
  url         String   // Path en /public/uploads/
  uploadedAt  DateTime @default(now())
  
  student     Student  @relation(fields: [studentId], references: [id])
}

model DocumentChange {
  id          String   @id @default(cuid())
  studentId   String
  oldValue    String
  newValue    String
  field       String   // "documentId"
  reason      String
  date        DateTime @default(now())
  
  student     Student  @relation(fields: [studentId], references: [id])
}

model Observation {
  id          String      @id @default(cuid())
  studentId   String
  teacherId   String
  date        DateTime    @default(now())
  type        ObservationType // CONDUCTUAL, ACADEMICA, OTRA
  severity    Severity    // LEVE, MODERADA, GRAVE
  description String      @db.Text
  
  student     Student     @relation(fields: [studentId], references: [id])
  teacher     Teacher     @relation(fields: [teacherId], references: [id])
  followUps   FollowUp[]
  agreements  Agreement[]
  meetings    ParentMeeting[]
}

enum ObservationType {
  CONDUCTUAL
  ACADEMICA
  OTRA
}

enum Severity {
  LEVE
  MODERADA
  GRAVE
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
}

enum EvalType {
  NUMERIC
  QUALITATIVE
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### Migraciones

```sql
-- 001_init.sql - Crear tablas base
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  department TEXT,
  phone TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);

-- Más tablas...
```

### Índices y Optimizaciones

```prisma
// Índices estratégicos para queries comunes

model Grade {
  // ... campos ...
  
  @@index([studentId, periodId]) // Query: notas de estudiante por período
  @@index([subjectId, periodId]) // Query: notas de materia en período
  @@index([periodId])            // Query: todas las notas de un período
}

model UnblockRequest {
  // ... campos ...
  
  @@index([status, teacherId])   // Query: solicitudes pendientes de docente
}
```

---

## 🔐 Autenticación

### NextAuth.js (Auth.js) Configuración

```typescript
// lib/auth.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "./db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
};

export const handler = NextAuth(authOptions);
```

### Flujo de Autenticación

```
┌──────────────┐
│ Usuario      │
│ (Browser)    │
└────────┬─────┘
         │
         │ 1. Ingresa email/password
         ▼
┌──────────────────────────────┐
│ POST /api/auth/signin         │
│ (Server Action)              │
└────────┬─────────────────────┘
         │
         │ 2. Valida credenciales
         │ 3. Busca user en DB
         │ 4. Compara password (bcrypt)
         ▼
┌──────────────────────────────┐
│ JWT Token generado           │
│ (Almacenado en cookie)       │
└────────┬─────────────────────┘
         │
         │ 5. Redirige a dashboard
         ▼
┌──────────────────────────────┐
│ Sesión iniciada              │
│ (Acceso a rutas protegidas)  │
└──────────────────────────────┘
```

### Protección de Rutas

```typescript
// app/middleware.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Rutas públicas
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validar acceso por rol
  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/teacher") && token.role !== "TEACHER") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon).*)"],
};
```

---

## 🔄 API & Server Actions

### Server Actions (Mutaciones)

```typescript
// actions/grades.actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "next-auth/react";

interface CreateGradeInput {
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  component: string;
}

export async function createGrade(data: CreateGradeInput) {
  // 1. Validar sesión
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // 2. Validar permisos (es docente de la materia?)
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });

  if (subject?.teacherId !== session.user.id) {
    throw new Error("Forbidden");
  }

  // 3. Validar período abierto
  const period = await prisma.period.findUnique({
    where: { id: data.periodId },
  });

  if (!period?.isOpen) {
    throw new Error("Period is closed");
  }

  // 4. Crear calificación
  const grade = await prisma.grade.create({
    data: {
      studentId: data.studentId,
      subjectId: data.subjectId,
      periodId: data.periodId,
      value: data.value,
      component: data.component,
    },
  });

  // 5. Revalidar caché
  revalidatePath(`/teacher/grades`);
  revalidatePath(`/student/report-card`);

  return grade;
}

export async function updateGrade(
  gradeId: string,
  data: Partial<CreateGradeInput>
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Validaciones similares...

  const grade = await prisma.grade.update({
    where: { id: gradeId },
    data,
  });

  revalidatePath(`/teacher/grades`);
  revalidatePath(`/student/report-card`);

  return grade;
}

export async function getStudentGrades(studentId: string, periodId: string) {
  const grades = await prisma.grade.findMany({
    where: {
      studentId,
      periodId,
    },
    include: {
      subject: true,
    },
  });

  return grades;
}
```

### Bulk Upload de Excel

```typescript
// actions/bulk-upload.actions.ts

"use server";

import XLSX from "xlsx";
import { prisma } from "@/lib/db";

interface BulkGradeRow {
  studentName: string;
  studentId: string;
  [subject: string]: number | string;
}

export async function processBulkGradeFile(
  file: File,
  subjectId: string,
  periodId: string
) {
  // 1. Leer archivo Excel
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<BulkGradeRow>(worksheet);

  // 2. Validar estructura
  const errors: string[] = [];
  data.forEach((row, index) => {
    if (!row.studentId || !row.studentName) {
      errors.push(`Fila ${index + 1}: Datos de estudiante incompletos`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Errores en archivo: ${errors.join(", ")}`);
  }

  // 3. Importar calificaciones
  const results = [];
  for (const row of data) {
    try {
      // Buscar estudiante
      const student = await prisma.user.findUnique({
        where: { id: row.studentId },
      });

      if (!student) {
        results.push({
          studentName: row.studentName,
          status: "error",
          message: "Estudiante no encontrado",
        });
        continue;
      }

      // Extraer calificación
      const gradeValue = parseFloat(row[`grade`] as string);
      if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
        results.push({
          studentName: row.studentName,
          status: "error",
          message: "Calificación fuera de rango (0-100)",
        });
        continue;
      }

      // Crear/Actualizar calificación
      await prisma.grade.upsert({
        where: {
          studentId_subjectId_periodId_component: {
            studentId: row.studentId,
            subjectId,
            periodId,
            component: "bulk_import",
          },
        },
        create: {
          studentId: row.studentId,
          subjectId,
          periodId,
          value: gradeValue,
          component: "bulk_import",
        },
        update: {
          value: gradeValue,
        },
      });

      results.push({
        studentName: row.studentName,
        status: "success",
      });
    } catch (error) {
      results.push({
        studentName: row.studentName,
        status: "error",
        message: (error as Error).message,
      });
    }
  }

  return results;
}
```

---

## 🎨 Componentes Frontend

### Estructura de Componentes

```
components/
├── ui/                    # Componentes base reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── Dropdown.tsx
├── forms/                 # Formularios específicos del dominio
│   ├── LoginForm.tsx
│   ├── CreateUserForm.tsx
│   ├── GradeEntryForm.tsx
│   └── BulkUploadForm.tsx
├── layout/               # Componentes de layout
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Navigation.tsx
│   └── Footer.tsx
└── sections/             # Secciones de página
    ├── GradesTable.tsx
    ├── StudentDashboard.tsx
    └── ReportCard.tsx
```

### Ejemplo: Componente Table

```typescript
// components/ui/Table.tsx

import React from "react";
import styles from "./Table.module.css";

interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  isLoading,
}: TableProps<T>) {
  if (isLoading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className={styles.empty}>No hay datos disponibles</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? styles.clickable : ""}
            >
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Ejemplo: Componente GradeEntry

```typescript
// components/sections/GradeEntry.tsx

"use client";

import { useState } from "react";
import { createGrade, updateGrade } from "@/actions/grades.actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface GradeEntryProps {
  studentId: string;
  subjectId: string;
  periodId: string;
  initialValue?: number;
  onSuccess?: () => void;
}

export function GradeEntry({
  studentId,
  subjectId,
  periodId,
  initialValue,
  onSuccess,
}: GradeEntryProps) {
  const [value, setValue] = useState(initialValue?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const numValue = parseFloat(value);

      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        throw new Error("La calificación debe estar entre 0 y 100");
      }

      if (initialValue !== undefined) {
        await updateGrade(studentId, {
          subjectId,
          periodId,
          value: numValue,
          component: "exam",
        });
      } else {
        await createGrade({
          studentId,
          subjectId,
          periodId,
          value: numValue,
          component: "exam",
        });
      }

      setValue("");
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="number"
        min="0"
        max="100"
        step="0.5"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ingrese calificación"
        disabled={loading}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar"}
      </Button>
      {error && <span className="text-red-500">{error}</span>}
    </form>
  );
}
```

---

## 🎯 Patrones y Convenciones

### Convenciones de Nombres

```typescript
// Archivos
- PascalCase para componentes: UserForm.tsx
- camelCase para utilidades: formatDate.ts
- kebab-case para estilos: grade-entry.module.css

// Funciones
- async prefix para promesas: fetchUser()
- handler prefix para event handlers: handleSubmit()
- use prefix para custom hooks: useAuth()

// Variables
- const para valores constantes: const MAX_GRADE = 100;
- let para variables mutables
- camelCase para variables: studentId

// Base de datos
- PascalCase para modelos: User, Course, Grade
- camelCase para campos: firstName, courseId
- underscore_case para algunos campos legacy: full_name
```

### Error Handling

```typescript
// Patrón de manejo de errores

try {
  const result = await someAsyncOperation();
  return { success: true, data: result };
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("Operation failed:", message);
  return { success: false, error: message };
}

// O con throw para Server Actions:
export async function someAction() {
  try {
    // operación
  } catch (error) {
    throw new Error(
      `Failed to complete action: ${error instanceof Error ? error.message : "Unknown"}`
    );
  }
}
```

### Type Safety

```typescript
// types/models.ts

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  periodId: string;
  value: number;
  component: string;
}

// Usar discriminated unions para roles
export type UserByRole =
  | { role: "ADMIN"; permissions: AdminPermissions }
  | { role: "TEACHER"; subject: string }
  | { role: "STUDENT"; courseId: string };
```

---

## 📊 Flujos de Datos

### Flujo: Crear Calificación

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. UI: Docente ingresa nota en tabla (React Component)          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Client: onChange event dispara validación local             │
│    - Valida: 0 <= nota <= 100                                   │
│    - Muestra error si inválido                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Server Action: createGrade() ejecuta en servidor            │
│    await createGrade({                                          │
│      studentId: "xyz",                                          │
│      subjectId: "abc",                                          │
│      periodId: "123",                                           │
│      value: 85                                                  │
│    })                                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Validaciones en servidor:                                    │
│    - ¿Usuario autenticado?                                      │
│    - ¿Es docente de esta materia?                               │
│    - ¿Período abierto?                                          │
│    - ¿Valor en rango válido?                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Prisma ORM: Operación DB                                     │
│    await prisma.grade.create({                                  │
│      data: { ... }                                              │
│    })                                                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. PostgreSQL: INSERT en tabla grades                           │
│    INSERT INTO "Grade" (...) VALUES (...)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Response: Retorna objeto Grade creado                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Revalidate Cache:                                            │
│    - revalidatePath("/teacher/grades")                          │
│    - revalidatePath("/student/report-card")                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. UI: React actualiza automáticamente                          │
│    - Tabla se refresca con nueva calificación                   │
│    - Promedio se recalcula                                      │
│    - Confirmación visual al usuario                             │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo: Obtener Boletín de Estudiante

```
┌──────────────────────────────────────────────────────┐
│ 1. Student accede a /student/report-card             │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ 2. Server Component renderiza                       │
│    - Valida autenticación                            │
│    - Obtiene studentId de sesión                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ 3. Query DB: Obtener calificaciones                 │
│    SELECT grades.*, subjects.name                    │
│    FROM grades                                       │
│    JOIN subjects ON grades.subjectId = subjects.id  │
│    WHERE grades.studentId = ?                        │
│    ORDER BY periods.number DESC                      │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ 4. Calcular promedios:                              │
│    Para cada período:                                │
│    - Agrupar calificaciones por período              │
│    - Calcular promedio: SUM(grades) / COUNT         │
│    - Aplicar ponderación (30%, 30%, 40%)            │
│    - Promedio final = P1*0.3 + P2*0.3 + P3*0.4     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ 5. Renderizar HTML:                                 │
│    <ReportCard grades={data} />                      │
│    - Tablas con notas por período                    │
│    - Gráfico de tendencias                           │
│    - Promedio final destacado                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│ 6. Caché de Next.js:                                │
│    - HTML cacheado por DEFAULT                       │
│    - Revalidación en demanda con revalidatePath()   │
│    - TTL configurable                                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment

### Arquitectura de Deployment

```
┌───────────────────────────────────────────────────────────────┐
│                        GitHub Repository                      │
│                      (Alfavear/EduSoft)                       │
└────────────────────┬──────────────────────────────────────────┘
                     │
                     │ Push a main branch
                     ▼
┌───────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                    │
│  1. Lint & Type checking (ESLint, TypeScript)                │
│  2. Test (Vitest, Jest)                                       │
│  3. Build Next.js                                             │
│  4. Deploy a Vercel                                           │
└────────────────────┬──────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────────┐
│                     Vercel Platform                           │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Frontend (Next.js 15+)                                   ││
│  │ - Serverless Functions (Server Actions)                  ││
│  │ - Static Site Generation (SSG)                           ││
│  │ - Image Optimization                                     ││
│  └──────────────────────────────────────────────────────────┘│
│                                                               │
│  URL: https://edusoft-gamma.vercel.app                       │
└────────────────────┬──────────────────────────────────────────┘
                     │
                     ▼ (HTTPS/TLS)
┌───────────────────────────────────────────────────────────────┐
│                    Neon.tech Database                         │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ PostgreSQL Serverless                                    ││
│  │ - Auto-scaling                                           ││
│  │ - Backups automáticos                                    ││
│  │ - Connection pooling                                     ││
│  └──────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────┘
```

### Workflow CI/CD

```yaml
# .github/workflows/deploy.yml

name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm install
      
      - run: npm run lint
      
      - run: npm run type-check
      
      - run: npm run test

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Variables de Entorno

```bash
# Frontend/.env.local
NEXTAUTH_URL=https://edusoft-gamma.vercel.app
NEXTAUTH_SECRET=<super-secret-key>
DATABASE_URL=postgresql://user:password@neon.tech/db
NEXT_PUBLIC_API_URL=https://edusoft-gamma.vercel.app

# Database/.env
DATABASE_URL=postgresql://user:password@neon.tech/db
```

---

## ⚡ Performance

### Optimizaciones Implementadas

| Técnica | Beneficio | Implementación |
|---------|-----------|---------|
| **Next.js SSG** | Caché estática, respuestas más rápidas | `generateStaticParams()` |
| **ISR (Incremental Static Regeneration)** | Datos frescos sin rebuild | `revalidate: 3600` |
| **Image Optimization** | Imágenes comprimidas automáticamente | `<Image>` component |
| **Code Splitting** | Bundles más pequeños | Dynamic imports con `next/dynamic` |
| **Database Indexing** | Queries más rápidas | Índices en Prisma |
| **Connection Pooling** | Reutilizar conexiones DB | Neon.tech pooling |
| **CDN** | Contenido servido desde edge | Vercel Edge Network |
| **Caching Headers** | Reducir transferencia | `Cache-Control` headers |

### Métricas de Rendimiento

```typescript
// Monitorar Core Web Vitals

import { reportWebVitals } from "next/web-vitals";

export function webVitals(metric) {
  console.log(`${metric.name}: ${metric.value}ms`);
  
  // Enviar a analytics
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify(metric),
  });
}

// pages/_app.tsx o app/layout.tsx
reportWebVitals(webVitals);
```

### Queries Optimizadas

```typescript
// ❌ MAL - N+1 Query Problem
const students = await prisma.user.findMany({
  where: { role: "STUDENT" },
});

for (const student of students) {
  const grades = await prisma.grade.findMany({
    where: { studentId: student.id },
  });
  // ...
}

// ✅ BIEN - Eager Loading
const studentsWithGrades = await prisma.user.findMany({
  where: { role: "STUDENT" },
  include: {
    grades: true, // Carga en single query
  },
});

// ✅ MEJOR - Con filtros específicos
const studentsWithCurrentGrades = await prisma.user.findMany({
  where: { role: "STUDENT" },
  include: {
    grades: {
      where: {
        periodId: currentPeriodId,
      },
    },
  },
});
```

---

## 🧪 Testing

### Estructura de Tests

```
Frontend/
├── __tests__/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   └── Table.test.tsx
│   ├── actions/
│   │   ├── grades.test.ts
│   │   └── auth.test.ts
│   └── lib/
│       └── utils.test.ts
└── jest.config.js
```

### Ejemplo: Test de Component

```typescript
// __tests__/components/GradeEntry.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GradeEntry } from "@/components/sections/GradeEntry";
import * as gradeActions from "@/actions/grades.actions";

jest.mock("@/actions/grades.actions");

describe("GradeEntry", () => {
  it("should render input and submit button", () => {
    render(
      <GradeEntry
        studentId="123"
        subjectId="456"
        periodId="789"
      />
    );

    expect(screen.getByPlaceholderText(/calificación/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /guardar/i })).toBeInTheDocument();
  });

  it("should call createGrade with correct data", async () => {
    const mockCreateGrade = jest.fn().mockResolvedValue({ id: "new-grade" });
    (gradeActions.createGrade as jest.Mock) = mockCreateGrade;

    const user = userEvent.setup();
    render(
      <GradeEntry
        studentId="123"
        subjectId="456"
        periodId="789"
      />
    );

    const input = screen.getByPlaceholderText(/calificación/i);
    await user.type(input, "85");

    const button = screen.getByRole("button", { name: /guardar/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockCreateGrade).toHaveBeenCalledWith({
        studentId: "123",
        subjectId: "456",
        periodId: "789",
        value: 85,
        component: "exam",
      });
    });
  });

  it("should show error for invalid grade", async () => {
    const user = userEvent.setup();
    render(
      <GradeEntry
        studentId="123"
        subjectId="456"
        periodId="789"
      />
    );

    const input = screen.getByPlaceholderText(/calificación/i);
    await user.type(input, "150"); // Mayor a 100

    const button = screen.getByRole("button", { name: /guardar/i });
    await user.click(button);

    expect(
      screen.getByText(/debe estar entre 0 y 100/i)
    ).toBeInTheDocument();
  });
});
```

### Ejemplo: Test de Server Action

```typescript
// __tests__/actions/grades.test.ts

import { createGrade } from "@/actions/grades.actions";
import { prisma } from "@/lib/db";
import { getSession } from "next-auth/react";

jest.mock("@/lib/db");
jest.mock("next-auth/react");

describe("createGrade action", () => {
  it("should throw error if not authenticated", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    await expect(
      createGrade({
        studentId: "123",
        subjectId: "456",
        periodId: "789",
        value: 85,
        component: "exam",
      })
    ).rejects.toThrow("Unauthorized");
  });

  it("should create grade if authorized", async () => {
    const mockSession = {
      user: { id: "teacher-1", role: "TEACHER" },
    };
    (getSession as jest.Mock).mockResolvedValue(mockSession);

    const mockSubject = { id: "456", teacherId: "teacher-1" };
    (prisma.subject.findUnique as jest.Mock).mockResolvedValue(mockSubject);

    const mockPeriod = { id: "789", isOpen: true };
    (prisma.period.findUnique as jest.Mock).mockResolvedValue(mockPeriod);

    const mockGrade = {
      id: "new-grade",
      studentId: "123",
      subjectId: "456",
      periodId: "789",
      value: 85,
      component: "exam",
    };
    (prisma.grade.create as jest.Mock).mockResolvedValue(mockGrade);

    const result = await createGrade({
      studentId: "123",
      subjectId: "456",
      periodId: "789",
      value: 85,
      component: "exam",
    });

    expect(result).toEqual(mockGrade);
  });
});
```

---

## 📚 Recursos Adicionales

### Documentación Externa

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Prisma ORM](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [PostgreSQL](https://www.postgresql.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Librerías Recomendadas

- **Validación:** Zod, Yup
- **Animaciones:** Framer Motion
- **Gráficos:** Recharts, Chart.js
- **PDF:** jsPDF, react-pdf
- **Excel:** xlsx (SheetJS), exceljs
- **Testing:** Jest, Vitest, React Testing Library
- **HTTP Client:** Fetch API, Axios

---

## 🔗 Links Útiles

- 🌐 **Sitio en Producción:** https://edusoft-gamma.vercel.app
- 📦 **Repositorio:** https://github.com/Alfavear/EduSoft
- 📊 **Prisma Studio:** `npx prisma studio`
- 🔐 **NextAuth Configuration:** `/app/api/auth/[...nextauth]/route.ts`

---

## 📝 Convenciones de Commit

```
feat: Agregar nueva funcionalidad
fix: Corregir bug
docs: Actualizar documentación
style: Cambios de formato (sin cambio de lógica)
refactor: Refactorización de código
test: Agregar o actualizar tests
chore: Cambios en build, dependencias, etc.
perf: Mejoras de performance

Ejemplo:
feat: agregar validación de período cerrado en createGrade
fix: corregir cálculo de promedio ponderado
docs: actualizar documentación técnica
```

---

## 📋 MÓDULO: REPORTE INSTITUCIONAL ROBUSTECIDO

### 13.1 Arquitectura de Consultas Relacionales
Para los nuevos reportes, se utiliza un patrón de **Eager Loading** mediante Prisma para minimizar las peticiones N+1:

```typescript
// Ejemplo: Directorio de Docentes con Carga Académica
const teachers = await prisma.teacher.findMany({
  include: {
    assignments: {
      include: {
        course: true,
        subject: true
      }
    }
  },
  orderBy: { lastName: 'asc' }
});
```

### 13.2 Optimización de Impresión
Se implementó un sistema de componentes compartidos para la generación de PDFs vía navegador:
- **PrintButton**: Componente de cliente que dispara `window.print()`.
- **Global Print CSS**: Clases `.no-print` para ocultar navegación y botones durante la generación del documento.

---
*Documentación Técnica actualizada: 8 de Mayo de 2026 — Centro de Reportes robustecido.*

