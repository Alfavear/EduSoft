import { getTesoreriaStats, getFeeTypes, getInvoices } from "./actions";
import { prisma } from "@/lib/prisma";
import { TesoreriaDashboard } from "./TesoreriaDashboard";

export default async function TesoreriaPage() {
  const stats = await getTesoreriaStats();
  const feeTypes = await getFeeTypes();
  const courses = await prisma.course.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Tesorería y Finanzas</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestión de cobros, pensiones y recaudo institucional</p>
      </div>

      <TesoreriaDashboard 
        stats={stats} 
        feeTypes={feeTypes} 
        courses={courses} 
      />
    </div>
  );
}
