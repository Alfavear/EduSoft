import { getAcademicYears } from "./actions";
import { getSchoolInfo } from "./schoolActions";
import { ConfigTabs } from "./ConfigTabs";

export default async function ConfiguracionPage() {
  const years = await getAcademicYears();
  const schoolInfo = await getSchoolInfo();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Configuración Global</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestiona la identidad institucional, periodos académicos y parámetros de seguridad</p>
      </div>

      <ConfigTabs schoolInfo={schoolInfo} years={years} />
    </div>
  );
}

