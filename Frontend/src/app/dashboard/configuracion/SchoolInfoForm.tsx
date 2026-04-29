"use client";

import { useState } from "react";
import { updateSchoolInfo } from "./schoolActions";
import { Building, Save, Image as ImageIcon, Phone, MapPin, Hash, UserCheck, Mail } from "lucide-react";

export function SchoolInfoForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateSchoolInfo(formData);
    if (res.success) {
      setMessage({ type: "success", text: "Información institucional actualizada correctamente." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: "Error al guardar la información." });
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ padding: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>
            <Building size={20} color="var(--color-primary)" />
          </div>
          Identidad Institucional
        </h2>
        {message.text && (
          <div style={{ 
            fontSize: '0.875rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius)',
            backgroundColor: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
          }}>
            {message.text}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ 
              width: '180px', height: '180px', borderRadius: '20px', backgroundColor: 'var(--bg-app)', 
              border: '2px dashed var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative', transition: 'all 0.3s ease', cursor: 'pointer'
            }} onClick={() => document.getElementById('logo-upload')?.click()}>
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.75rem' }}>Subir Logo</p>
                </div>
              )}
            </div>
            <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
              PNG o JPG recomendado.<br/>Fondo blanco/transparente.
            </p>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <Building size={14} /> Nombre de la Institución
              </label>
              <input name="name" value={formData.name || ""} onChange={handleChange} className="input-field" placeholder="Ej: Colegio San José" style={{ width: '100%' }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <Hash size={14} /> NIT / Identificación
              </label>
              <input name="nit" value={formData.nit || ""} onChange={handleChange} className="input-field" placeholder="800.xxx.xxx-x" style={{ width: '100%' }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <MapPin size={14} /> Dirección Física
              </label>
              <input name="address" value={formData.address || ""} onChange={handleChange} className="input-field" placeholder="Calle 123 #45-67" style={{ width: '100%' }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <Phone size={14} /> Teléfono de Contacto
              </label>
              <input name="phone" value={formData.phone || ""} onChange={handleChange} className="input-field" placeholder="+57 300 xxxxxxx" style={{ width: '100%' }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <Mail size={14} /> Correo Institucional
              </label>
              <input name="email" value={formData.email || ""} onChange={handleChange} className="input-field" placeholder="contacto@colegio.edu.co" style={{ width: '100%' }} />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <UserCheck size={14} /> Nombre del Rector(a)
              </label>
              <input name="rectorName" value={formData.rectorName || ""} onChange={handleChange} className="input-field" placeholder="Nombre completo" style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2', marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-app)', borderRadius: '15px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>Parámetros del Sistema</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Límite de Días para Asistencia</label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Días permitidos hacia atrás para registrar asistencia sin solicitud.</p>
                  <input type="number" name="attendanceLimitDays" value={formData.attendanceLimitDays || 1} onChange={handleChange} className="input-field" style={{ width: '100%' }} min="0" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Umbral de Alerta Académica</label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Calificación mínima antes de disparar una alerta temprana (Promedio).</p>
                  <input type="number" step="0.1" name="alertThreshold" value={formData.alertThreshold || 3.0} onChange={handleChange} className="input-field" style={{ width: '100%' }} min="0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.75rem 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
            <Save size={18} /> {loading ? "Guardando..." : "Actualizar Información"}
          </button>
        </div>
      </form>
    </div>
  );
}
