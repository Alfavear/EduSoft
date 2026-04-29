import { getExcellenceReport } from "../actions";
import { Star, Award } from "lucide-react";
import PrintButton from "@/app/components/PrintButton";

export default async function ExcellenceReportPage() {
  const report = await getExcellenceReport();

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Award size={32} color="var(--color-warning)" />
            Cuadro de Honor
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Estudiantes con desempeño académico superior (Promedio ≥ 4.5)</p>
        </div>
        <PrintButton label="Imprimir Reporte" className="btn-secondary" />
      </div>

      <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {report.map((s, idx) => (
            <div key={s.id} className="card interactive-card" style={{ padding: '1.5rem', textAlign: 'center', border: '2px solid var(--color-warning)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: 'var(--color-warning)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                #{idx + 1}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <Star size={48} color="var(--color-warning)" fill="var(--color-warning)" style={{ margin: '0 auto' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{s.course}</p>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-success)' }}>
                {s.average.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {report.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Aún no hay estudiantes en el cuadro de honor para este periodo.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .btn-secondary, .app-sidebar, .app-topbar { display: none !important; }
          .app-main { padding: 0 !important; }
          .container { max-width: 100% !important; padding: 0 !important; }
          .card { border: none !important; box-shadow: none !important; }
        }
      `}} />
    </div>
  );
}
