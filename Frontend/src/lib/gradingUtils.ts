/**
 * Utilidades centralizadas para el Sistema Institucional de Evaluación (SIEE)
 * basándose en el Decreto 1290 de Colombia.
 */

export const PERFORMANCE_LEVELS = {
  SUPERIOR: { label: "Superior", min: 4.6, max: 5.0, color: "#10b981" },
  ALTO: { label: "Alto", min: 4.0, max: 4.5, color: "#3b82f6" },
  BASICO: { label: "Básico", min: 3.0, max: 3.9, color: "#f59e0b" },
  BAJO: { label: "Bajo", min: 1.0, max: 2.9, color: "#ef4444" }
};

/**
 * Determina el nivel de desempeño a partir de una nota numérica.
 */
export function getPerformanceLevel(value: number | string) {
  const grade = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(grade)) return null;

  if (grade >= 4.6) return "Superior";
  if (grade >= 4.0) return "Alto";
  if (grade >= 3.0) return "Básico";
  return "Bajo";
}

/**
 * Determina si una nota es aprobatoria.
 */
export function isPassed(value: number | string) {
  const grade = typeof value === "string" ? parseFloat(value) : value;
  return !isNaN(grade) && grade >= 3.0;
}

/**
 * Calcula el promedio de un arreglo de notas.
 */
export function calculateAverage(grades: (number | string)[]) {
  const validGrades = grades
    .map(g => typeof g === "string" ? parseFloat(g) : g)
    .filter(g => !isNaN(g));

  if (validGrades.length === 0) return 0;
  
  const sum = validGrades.reduce((a, b) => a + b, 0);
  return sum / validGrades.length;
}
