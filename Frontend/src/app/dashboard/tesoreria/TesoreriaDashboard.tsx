"use client";

import { useState } from "react";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  FileText, 
  List, 
  Settings as SettingsIcon,
  Download
} from "lucide-react";
import { FeeTypeManager } from "./FeeTypeManager";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { InvoiceList } from "./InvoiceList";

export function TesoreriaDashboard({ stats, feeTypes, courses }: { 
  stats: any, 
  feeTypes: any[], 
  courses: any[] 
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Facturado</span>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(stats.totalBilled)}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Acumulado histórico</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Recaudo Total</span>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <TrendingUp size={20} color="var(--color-success)" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(stats.totalPaid)}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem' }}>
            {stats.totalBilled > 0 ? Math.round((stats.totalPaid / stats.totalBilled) * 100) : 0}% de efectividad
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Cartera Pendiente</span>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <DollarSign size={20} color="var(--color-warning)" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(stats.totalPending)}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{stats.pendingCount} facturas pendientes</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Mora Crítica</span>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <AlertCircle size={20} color="var(--color-danger)" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.overdueCount}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.5rem' }}>Facturas vencidas</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab("overview")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "overview" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "overview" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "overview" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <List size={18} /> Listado de Facturas
        </button>
        <button 
          onClick={() => setActiveTab("generate")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "generate" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "generate" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "generate" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={18} /> Generar Cobros
        </button>
        <button 
          onClick={() => setActiveTab("config")}
          style={{ 
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === "config" ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === "config" ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === "config" ? 'bold' : 'normal',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <SettingsIcon size={18} /> Conceptos de Cobro
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        {activeTab === "overview" && (
          <InvoiceList courses={courses} />
        )}
        
        {activeTab === "generate" && (
          <InvoiceGenerator feeTypes={feeTypes} courses={courses} />
        )}

        {activeTab === "config" && (
          <FeeTypeManager feeTypes={feeTypes} />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
