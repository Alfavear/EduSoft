import { getAcademicYears, togglePeriodStatus, toggleYearStatus } from "./actions";
import { getSchoolInfo } from "./schoolActions";
import { ConfigForm } from "./ConfigForm";
import { SchoolInfoForm } from "./SchoolInfoForm";
import { Calendar, Lock, Unlock, CheckCircle2, Circle, Settings2, ShieldCheck } from "lucide-react";
import { StatusToggle } from "./StatusToggle";

export default async function ConfiguracionPage() {
  const years = await getAcademicYears();
  const schoolInfo = await getSchoolInfo();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Configuración Académica</h1>
        <p style={{ color: 'var(--text-muted)' }}>Define la estructura del año escolar y controla el cierre de periodos</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <SchoolInfoForm initialData={schoolInfo} />

        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', alignItems: 'start' }}>
        <ConfigForm />

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar color="var(--color-purple)" />
            Historial de Años Lectivos
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {years.map(year => (
              <div key={year.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '1.5rem', backgroundColor: year.isActive ? 'rgba(59, 130, 246, 0.02)' : 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{year.name}</h3>
                    {year.isActive && (
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-success)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                        ACTIVO
                      </span>
                    )}
                  </div>
                  <StatusToggle yearId={year.id} isActive={year.isActive} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {year.periods.map((period: any) => (
                    <div key={period.id} style={{ padding: '1rem', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{period.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{period.weight}%</span>
                      </div>
                      <StatusToggle periodId={period.id} status={period.status} type="period" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {years.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No hay años lectivos configurados.
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

