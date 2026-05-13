"use client";

import { useState, useEffect } from "react";
import { uploadOfficialDocument, getStudentDocuments } from "./actions";
import { FileUp, File, Download, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function DocumentRepository({ studentId, enrollmentId }: { studentId?: string, enrollmentId?: string }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const requiredDocs = [
    "Documento de Identidad",
    "Registro Civil",
    "Certificado Médico / EPS",
    "Certificados Años Anteriores",
    "Seguro Estudiantil"
  ];

  useEffect(() => {
    if (studentId) fetchDocs();
  }, [studentId]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await getStudentDocuments(studentId!);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", docName);
    if (studentId) formData.append("studentId", studentId);
    if (enrollmentId) formData.append("enrollmentId", enrollmentId);

    const res = await uploadOfficialDocument(formData);
    if (res.success) {
      fetchDocs();
    } else {
      setError(res.error || "Error al subir archivo");
    }
    setUploading(false);
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileUp size={18} color="var(--color-primary)" /> Repositorio de Documentos Físicos
      </h3>

      {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requiredDocs.map(docName => {
          const isUploaded = documents.find(d => d.name === docName);
          return (
            <div key={docName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: 'var(--radius)', backgroundColor: isUploaded ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-app)', border: isUploaded ? '1px solid var(--color-success)' : '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isUploaded ? <CheckCircle size={16} color="var(--color-success)" /> : <AlertCircle size={16} color="var(--text-muted)" />}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{docName}</div>
                  {isUploaded && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cargado el {new Date(isUploaded.createdAt).toLocaleDateString()}</div>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {isUploaded ? (
                  <a href={isUploaded.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                    <Download size={14} />
                  </a>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="file" 
                      id={`file-${docName}`}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      onChange={e => handleFileUpload(e, docName)}
                      disabled={uploading}
                    />
                    <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} disabled={uploading}>
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : "Subir PDF"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {documents.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Otros Adjuntos</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {documents.filter(d => !requiredDocs.includes(d.name)).map(d => (
              <div key={d.id} style={{ padding: '0.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', fontSize: '0.75rem', textAlign: 'center' }}>
                <File size={24} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                <a href={d.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Ver</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
