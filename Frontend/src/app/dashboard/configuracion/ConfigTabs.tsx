"use client";

import { useState } from "react";
import { SchoolInfoForm } from "./SchoolInfoForm";
import { ConfigForm } from "./ConfigForm";
import { Calendar, Settings2, ShieldCheck, Building } from "lucide-react";
import { StatusToggle } from "./StatusToggle";

export function ConfigTabs({ schoolInfo, years }: { schoolInfo: any, years: any[] }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabStyle = (id: string) => ({
    padding: '1rem 1.5rem',
    cursor: 'pointer',
    borderBottom: activeTab === id ? '3px solid var(--color-primary)' : '3px solid transparent',
    color: activeTab === id ? 'var(--color-primary)' : 'var(--text-muted)',
    fontWeight: activeTab === id ? '700' : '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease',
    backgroundColor: activeTab === id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
    borderTopLeftRadius: 'var(--radius)',
    borderTopRightRadius: 'var(--radius)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '1rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        <div onClick={() => setActiveTab("general")} style={tabStyle("general")}>
          <Building size={18} /> Institución
        </div>
        <div onClick={() => setActiveTab("academico")} style={tabStyle("academico")}>
          <Calendar size={18} /> Periodos Lectivos
        </div>
        <div onClick={() => setActiveTab("seguridad")} style={tabStyle("seguridad")}>
          <ShieldCheck size={18} /> Seguridad y Sistema
        </div>
      </div>

      <div style={{ transition: 'all 0.3s ease' }}>
        {activeTab === "general" && (
          <SchoolInfoForm initialData={schoolInfo} mode="identity" />
        )}

        {activeTab === "academico" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
              </div>
            </div>
          </div>
        )}

        {activeTab === "seguridad" && (
          <SchoolInfoForm initialData={schoolInfo} mode="security" />
        )}
      </div>
    </div>
  );
}
