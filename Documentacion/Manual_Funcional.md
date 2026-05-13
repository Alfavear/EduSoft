# Manual Funcional: EduSoft - Sistema de Gestión Escolar

Este manual detalla los procedimientos y funcionalidades clave del sistema **EduSoft** para administradores, docentes y estudiantes.

---

## 1. Módulo de Autenticación y Perfil
El sistema utiliza un acceso seguro basado en roles.

### Registro y Credenciales
- **Formato de Usuario:** `nombre.apellido`
- **Contraseña Inicial:** Número de documento del usuario.
- **Cambio de Contraseña:** Todo usuario puede cambiar su contraseña desde el módulo de **Perfil**. Se requiere validar la contraseña actual.

### Restablecimiento de Contraseña (Admin)
Si un usuario olvida su clave, el administrador puede restablecerla desde la **Gestión de Usuarios** usando el ícono de llave. La clave volverá a ser el número de documento.

---

## 2. Dashboard e Indicadores
El Dashboard es el centro de control del sistema.

### Sistema de Alerta Temprana (Admin/Docente)
Identifica automáticamente a estudiantes con dificultades académicas.
- **Umbral:** Configurable desde el módulo de Configuración (ej. 3.0).
- **Visualización:** Aparece una lista roja con los estudiantes cuyo promedio general es inferior al umbral.

![Dashboard Alerta Temprana](file:///C:/Users/ALVEAR/.gemini/antigravity/brain/aa5e0b85-d095-4691-8805-735977444d98/.tempmediaStorage/academic_catalog_with_director.png)
*(Imagen representativa del Dashboard)*

---

## 3. Control de Asistencia
Módulo para el seguimiento diario de la presencia escolar.

### Procedimiento para Docentes
1. Seleccionar la materia y el curso desde el menú **Asistencias**.
2. Elegir la fecha (por defecto es el día de hoy).
3. Marcar el estado: **Presente, Falla, Retraso o Justificado**.
4. Clic en **Guardar Asistencia**.

### Reglas de Registro y Solicitudes
- **Límite de Tiempo:** El sistema permite registrar asistencia de días anteriores según la configuración institucional (ej. hasta 2 días atrás).
- **Solicitud Extemporánea:** Si un docente necesita registrar una asistencia fuera de este plazo, debe llenar un formulario de justificación. El Administrador recibirá la solicitud y deberá aprobarla para habilitar el registro.

---

## 4. Gestión Académica
Configuración de la estructura del colegio.

### Catálogo Académico
- **Cursos:** Creación de salones y asignación de un **Director de Grupo**.
- **Materias:** Definición de asignaturas y su esquema de calificación (Numérico o Letras).
- **Periodos:** Configuración de lapsos académicos con pesos porcentuales (ej. 1P: 30%, 2P: 30%, 3P: 40%).

### Asignaciones con Filtros
Debido al alto volumen de datos, el módulo de asignaciones incluye:
- **Buscador:** Filtrado por nombre de docente o materia.
- **Filtro de Curso:** Visualización segmentada por salón.

![Filtros Asignaciones](file:///C:/Users/ALVEAR/.gemini/antigravity/brain/aa5e0b85-d095-4691-8805-735977444d98/.tempmediaStorage/assignments_with_filters_1777432793585.png)

---

## 5. Calificaciones y Reportes
### Ingreso de Notas
Los docentes acceden a **Mis Clases**, filtran por su curso y cargan las notas de los estudiantes. El sistema calcula automáticamente el promedio ponderado del periodo.

### Boletines e Informes
- **Estudiantes:** Pueden descargar su boletín por periodo en formato PDF.
- **Docentes:** Pueden generar planillas consolidadas de notas para impresión oficial.

---

## 6. Configuración Institucional
Espacio reservado para el Administrador para definir la identidad del colegio:
- Carga de **Logo**.
- Definición del **Umbral de Alerta Temprana**.
- Definición de **Días Límite para Asistencia**.

---
**EduSoft © 2026** - *Software de Gestión Académica Premium*
