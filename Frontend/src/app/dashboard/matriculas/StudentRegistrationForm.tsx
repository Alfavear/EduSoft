"use client";

import { useState } from "react";
import { registerStudent } from "./actions";
import { UserPlus, Save, X, Shield, Info } from "lucide-react";

export function StudentRegistrationForm({ courses, onClose }: { courses: any[], onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentId: "",
    documentType: "RC",
    gender: "F",
    birthDate: "",
    bloodType: "",
    stratus: "1",
    sisben: "",
    eps: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    courseId: "",
    paeBeneficiary: "false",
    transportBeneficiary: "false",
    disabilityType: "NINGUNA",
    isVictim: "false"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    idDocument: null,
    medicalCert: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
    if (files.idDocument) submitData.append("idDocument", files.idDocument);
    if (files.medicalCert) submitData.append("medicalCert", files.medicalCert);

    const res = await registerStudent(submitData);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Error al registrar estudiante");
    }
    setIsLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserPlus color="var(--color-primary)" /> Registro Integral de Estudiante (SIMAT)
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SECCIÓN 1: Identificación Oficial */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} /> Identificación Oficial y Datos Básicos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label">Nombres *</label>
                <input className="input-field" type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
              </div>
              <div>
                <label className="label">Apellidos *</label>
                <input className="input-field" type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
              <div>
                <label className="label">Tipo Documento *</label>
                <select className="input-field" value={formData.documentType} onChange={e => setFormData({...formData, documentType: e.target.value})}>
                  <option value="RC">Registro Civil</option>
                  <option value="TI">Tarjeta Identidad</option>
                  <option value="CC">Cédula Ciudadanía</option>
                  <option value="CE">Cédula Extranjería</option>
                  <option value="PEP">PEP</option>
                  <option value="PPT">PPT</option>
                  <option value="VISA">Visa</option>
                </select>
              </div>
              <div>
                <label className="label">Número Documento *</label>
                <input className="input-field" type="text" value={formData.documentId} onChange={e => setFormData({...formData, documentId: e.target.value})} required />
              </div>
              <div>
                <label className="label">Fecha Nacimiento *</label>
                <input className="input-field" type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} required />
              </div>
              <div>
                <label className="label">Género *</label>
                <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: Caracterización y Ubicación */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' }}>Socio-Económico (SIMAT)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">Estrato</label>
                    <select className="input-field" value={formData.stratus} onChange={e => setFormData({...formData, stratus: e.target.value})}>
                      <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                      <option value="4">4</option><option value="5">5</option><option value="6">6</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">SISBÉN</label>
                    <input className="input-field" type="text" placeholder="Ej: A1" value={formData.sisben} onChange={e => setFormData({...formData, sisben: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="label">EPS</label>
                  <input className="input-field" type="text" value={formData.eps} onChange={e => setFormData({...formData, eps: e.target.value})} />
                </div>
                <div>
                  <label className="label">Dirección Residencia</label>
                  <input className="input-field" type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem' }}>Beneficios y Otros</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="label">Beneficiario PAE</label>
                  <input type="checkbox" checked={formData.paeBeneficiary === "true"} onChange={e => setFormData({...formData, paeBeneficiary: e.target.checked.toString()})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="label">Transporte Escolar</label>
                  <input type="checkbox" checked={formData.transportBeneficiary === "true"} onChange={e => setFormData({...formData, transportBeneficiary: e.target.checked.toString()})} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="label">Víctima Conflicto</label>
                  <input type="checkbox" checked={formData.isVictim === "true"} onChange={e => setFormData({...formData, isVictim: e.target.checked.toString()})} />
                </div>
                <div>
                  <label className="label">Discapacidad</label>
                  <select className="input-field" value={formData.disabilityType} onChange={e => setFormData({...formData, disabilityType: e.target.value})}>
                    <option value="NINGUNA">Ninguna</option>
                    <option value="FISICA">Física</option>
                    <option value="AUDITIVA">Auditiva</option>
                    <option value="VISUAL">Visual</option>
                    <option value="COGNITIVA">Cognitiva</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2.5: Documentos Adjuntos (NUEVO) */}
          <div style={{ padding: '1.5rem', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="var(--color-primary)" /> Soportes Físicos Obligatorios
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label className="label">Documento de Identidad (PDF/JPG)</label>
                <input 
                  type="file" 
                  className="input-field" 
                  onChange={e => setFiles({...files, idDocument: e.target.files?.[0] || null})}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <div>
                <label className="label">Certificado Médico / EPS (PDF)</label>
                <input 
                  type="file" 
                  className="input-field" 
                  onChange={e => setFiles({...files, medicalCert: e.target.files?.[0] || null})}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </div>


          {/* SECCIÓN 3: Acudiente y Curso */}
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>Acudiente y Asignación Inicial</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label">Nombre Acudiente *</label>
                <input className="input-field" type="text" value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} required />
              </div>
              <div>
                <label className="label">Teléfono *</label>
                <input className="input-field" type="tel" value={formData.guardianPhone} onChange={e => setFormData({...formData, guardianPhone: e.target.value})} required />
              </div>
              <div>
                <label className="label">Curso Inicial *</label>
                <select className="input-field" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} required>
                  <option value="">Seleccionar curso...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              <Save size={20} /> {isLoading ? "Registrando..." : "Finalizar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
