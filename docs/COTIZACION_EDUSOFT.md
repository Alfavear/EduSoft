# Propuesta Comercial y Cotización: Implementación EduSoft ERP

**Fecha:** 12 de Mayo de 2026
**Proyecto:** Implementación y Despliegue en la Nube de EduSoft ERP
**Preparado para:** [Nombre del Colegio / Institución]

---

## 1. Resumen Ejecutivo
La presente propuesta detalla los costos asociados para llevar el sistema **EduSoft ERP** a un entorno de producción 100% en la nube, garantizando alta disponibilidad, seguridad de la información y rendimiento óptimo. Asimismo, se incluye la estimación de los servicios profesionales necesarios para la implementación, parametrización, migración de datos y capacitación del personal, asegurando que el colegio inicie sus operaciones de manera exitosa.

---

## 2. Costos de Infraestructura en la Nube (Hosting)
El sistema ha sido diseñado con una arquitectura moderna (Serverless y Bases de Datos escalables). Los siguientes costos son **recurrentes (mensuales)** y se pagan a los proveedores de nube (Vercel, Neon, AWS/Cloudflare).

| Componente | Proveedor Recomendado | Propósito | Costo Estimado (Mensual) |
| :--- | :--- | :--- | :--- |
| **Servidor de Aplicaciones** | **Vercel (Plan Pro)** | Alojamiento del frontend y backend (Next.js). Garantiza cargas ultrarrápidas y auto-escalado según la cantidad de usuarios conectados. | ~$20 USD ($80,000 COP) |
| **Base de Datos Relacional** | **Neon.tech (Launch)** | Base de datos PostgreSQL en la nube con copias de seguridad automáticas (Point-in-Time Recovery) para proteger las calificaciones y usuarios. | ~$19 USD ($75,000 COP) |
| **Almacenamiento de Archivos** | **AWS S3 / R2** | Repositorio seguro para documentos físicos (Registros Civiles, Certificados, Memorandos del Observador). | ~$5 - $10 USD ($30,000 COP) |
| **Envío de Correos (Opcional)** | **Resend / SendGrid** | Envío de notificaciones automáticas, recuperación de contraseñas y envío de boletines a padres. | ~$15 USD ($60,000 COP) |
| **TOTAL ESTIMADO MENSUAL** | | **Mantenimiento de infraestructura pura en la nube.** | **~$59 USD ($245,000 COP) / Mes** |

> *Nota: Estos valores pueden fluctuar levemente según el volumen real de tráfico y almacenamiento consumido por el colegio mes a mes.*

---

## 3. Costos de Implementación y Puesta en Marcha (Pago Único)
Para que el colegio no solo tenga el software instalado, sino completamente funcional y adaptado a sus necesidades, se requiere un proceso de implementación ("Onboarding"). 

Este es un **pago único** por servicios profesionales e ingeniería:

| Fase del Proyecto | Descripción de Actividades | Tiempo Estimado | Valor Estimado |
| :--- | :--- | :--- | :--- |
| **1. Despliegue y Configuración de Nube** | Creación de cuentas en servidores, configuración de dominios (ej. *colegio.edu.co*), certificados de seguridad (SSL) y despliegue del código fuente en producción. | 15 Horas | $1,200,000 COP |
| **2. Parametrización Institucional** | Configuración de la malla curricular, materias, creación de salones, esquemas de evaluación (numérico/cualitativo) y configuración de reportes DANE/SIMAT. | 20 Horas | $1,600,000 COP |
| **3. Migración y Carga de Datos** | Limpieza y migración de datos desde Excel o sistemas antiguos. Creación masiva de expedientes de estudiantes, asignación de docentes a cursos y generación de credenciales de acceso. | 35 Horas | $2,800,000 COP |
| **4. Capacitación y Documentación** | Jornadas de capacitación presencial/virtual para administrativos y docentes. Entrega del Manual de Usuario oficial y guías rápidas de uso. | 15 Horas | $1,200,000 COP |
| **5. Soporte de Arranque (Go-Live)** | Acompañamiento prioritario durante las primeras 2 semanas de uso en vivo para resolver dudas inmediatas, corregir inconsistencias de datos y asegurar la adopción. | 25 Horas | $2,000,000 COP |
| **TOTAL IMPLEMENTACIÓN** | | **~110 Horas** | **$8,800,000 COP** |

> *Nota de facturación: Se sugiere un esquema de pagos por hitos (Ej: 40% al iniciar, 30% al finalizar la migración de datos, 30% tras la salida en vivo).*

---

## 4. Soporte y Mantenimiento Continuo (Opcional)
Una vez finalizada la implementación y el soporte de arranque, se sugiere ofrecer una póliza de mantenimiento mensual que incluye:

- Resolución de incidencias técnicas y soporte a usuarios nivel 2.
- Monitoreo de la infraestructura en la nube y gestión de copias de seguridad.
- Actualizaciones menores de seguridad.
- **Valor sugerido:** $800,000 COP / Mensuales.

---

## 5. Cronograma de Trabajo Sugerido

1. **Semana 1:** Despliegue en la nube y configuración de la URL del colegio.
2. **Semana 2:** Parametrización de la lógica de evaluación y cursos.
3. **Semana 3:** Migración masiva de estudiantes y carga de docentes.
4. **Semana 4:** Capacitaciones al personal y entrega de manuales.
5. **Semanas 5 y 6:** Salida en vivo (Go-Live) con soporte presencial/remoto.

---
**Validez de la oferta:** 30 días calendario.
