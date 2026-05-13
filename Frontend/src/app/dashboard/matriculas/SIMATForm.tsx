"use client";

import { useState } from "react";
import { updateStudentOfficialData, changeStudentDocument } from "./actions";
import { Shield, History, AlertCircle } from "lucide-react";
import { DocumentRepository } from "./DocumentRepository";

export function SIMATForm({ student, onClose }: { student: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [showDocChange, setShowDocChange] = useState(false);
  const [docChangeData, setDocChangeData] = useState({ newId: "", newType: "TI", reason: "" });
  
  const [formData, setFormData] = useState({
    gender: student.gender || "M",
    stratus: student.stratus || "",
    sisben: student.sisben || "",
    eps: student.eps || "",
    ethnicity: student.ethnicity || "",
    disability: student.disability || "",
    isVictim: student.isVictim || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudentOfficialData(student.id, formData);
      onClose();
    } catch (error) {
      alert("Error al actualizar datos oficiales");
    } finally {
      setLoading(false);
    }
  };

  const handleDocChange = async () => {
    if (!docChangeData.newId || !docChangeData.reason) return;
    setLoading(true);
    const res = await changeStudentDocument(student.id, {
      newDocumentId: docChangeData.newId,
      newDocumentType: docChangeData.newType,
      reason: docChangeData.reason
    });
    if (res.success) {
      alert("Documento actualizado correctamente");
      setShowDocChange(false);
      onClose();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.5rem' }}>
        <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{student.firstName} {student.lastName}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.documentType}: {student.documentId}</p>
          <button 
            type="button" 
            onClick={() => setShowDocChange(!showDocChange)}
            style={{ fontSize: '0.7rem', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
          >
            {showDocChange ? "Cancelar" : "Cambiar Documento"}
          </button>
        </div>
      </div>

      {showDocChange && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius)', border: '1px solid var(--color-primary)', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <History size={14} /> Novedad de Cambio de Documento
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <select className="input-field" style={{ fontSize: '0.8rem' }} value={docChangeData.newType} onChange={e => setDocChangeData({...docChangeData, newType: e.target.value})}>
              <option value="TI">Tarjeta Identidad</option>
              <option value="CC">Cédula Ciudadanía</option>
              <option value="CE">Cédula Extranjería</option>
              <option value="PPT">PPT</option>
            </select>
            <input className="input-field" style={{ fontSize: '0.8rem' }} type="text" placeholder="Nuevo Número" value={docChangeData.newId} onChange={e => setDocChangeData({...docChangeData, newId: e.target.value})} />
          </div>
          <input className="input-field" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }} type="text" placeholder="Motivo (Ej: Cambio por mayoría de edad)" value={docChangeData.reason} onChange={e => setDocChangeData({...docChangeData, reason: e.target.value})} />
          <button className="btn-primary" style={{ width: '100%', fontSize: '0.8rem' }} onClick={handleDocChange} disabled={loading}>Procesar Cambio</button>
        </div>
      )}


      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Género</label>
            <select 
              className="input-field"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="OTRO">Otro / No binario</option>
            </select>
          </div>
          <div>
            <label className="label">Estrato</label>
            <select 
              className="input-field"
              value={formData.stratus}
              onChange={e => setFormData({...formData, stratus: e.target.value})}
            >
              <option value="">Seleccione...</option>
              {[1,2,3,4,5,6].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Sisben (Grupo)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: A1, B4..."
              value={formData.sisben}
              onChange={e => setFormData({...formData, sisben: e.target.value})}
            />
          </div>
          <div>
            <label className="label">EPS / IPS</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Entidad de salud"
              value={formData.eps}
              onChange={e => setFormData({...formData, eps: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="label">Etnia / Discapacidad</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Etnia"
              value={formData.ethnicity}
              onChange={e => setFormData({...formData, ethnicity: e.target.value})}
            />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Discapacidad"
              value={formData.disability}
              onChange={e => setFormData({...formData, disability: e.target.value})}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
          <input 
            type="checkbox" 
            id="isVictim" 
            checked={formData.isVictim}
            onChange={e => setFormData({...formData, isVictim: e.target.checked})}
          />
          <label htmlFor="isVictim" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Víctima del Conflicto Armado</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Ficha'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cerrar
          </button>
        </div>
      </form>
      <DocumentRepository studentId={student.id} />
    </div>
  );
}
