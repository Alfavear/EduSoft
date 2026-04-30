"use client";

import { useState, useRef } from "react";
import { saveGrades, createAccessRequest } from "../actions";
import { Save, CheckCircle, AlertCircle, Download, FileUp, Printer } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

export function GradeTable({ assignment, periods }: { assignment: any, periods: any[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]?.id || "");
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const students = [...assignment.course.students].sort((a, b) => {
    const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
    const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const config = assignment.subject.gradingConfig;
  
  const currentPeriod = periods.find(p => p.id === selectedPeriod);
  const isPeriodClosed = currentPeriod?.status === "CLOSED";
  const hasApprovedRequest = assignment.accessRequests?.some((r: any) => 
    r.periodId === selectedPeriod && (r.expiresAt === null || new Date(r.expiresAt) > new Date())
  );
  
  const canEdit = !isPeriodClosed || hasApprovedRequest;

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reason, setReason] = useState("");

  const handleRequest = async () => {
    if (!reason) return;
    const res = await createAccessRequest({
      assignmentId: assignment.id,
      periodId: selectedPeriod,
      reason
    });
    if (res.success) {
      setMessage({ type: "success", text: "Solicitud enviada al administrador." });
      setShowRequestModal(false);
      setReason("");
    }
  };

  const handleGradeChange = (studentId: string, value: string) => {
    if (!canEdit) return;
    setGrades({ ...grades, [studentId]: value });
  };


  const handleSave = async () => {
    if (!selectedPeriod) return;
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    const gradesToSave = Object.entries(grades).map(([studentId, value]) => ({
      studentId,
      assignmentId: assignment.id,
      periodId: selectedPeriod,
      value
    }));

    const res = await saveGrades(gradesToSave);
    if (res.success) {
      setMessage({ type: "success", text: "Calificaciones guardadas correctamente." });
    } else {
      setMessage({ type: "error", text: res.error || "Error al guardar." });
    }
    setIsSaving(false);
  };

  // EXPORTAR A EXCEL
  const downloadTemplate = () => {
    const periodName = periods.find(p => p.id === selectedPeriod)?.name || "Periodo";
    const data = students.map((s: any) => ({
      "ID_ESTUDIANTE": s.documentId,
      "NOMBRE": s.firstName,
      "APELLIDO": s.lastName,
      "NOTA": ""
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas");
    
    // Descargar archivo
    XLSX.writeFile(wb, `Planilla_${assignment.subject.name}_${periodName}.xlsx`);
  };

  // IMPORTAR DESDE EXCEL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data: any[] = XLSX.utils.sheet_to_json(ws);

      const newGrades: Record<string, string> = { ...grades };
      let importedCount = 0;

      data.forEach(row => {
        const studentIdVal = row.ID_ESTUDIANTE?.toString();
        if (studentIdVal && row.NOTA !== undefined) {
          const student = students.find((s: any) => s.documentId === studentIdVal);
          if (student) {
            newGrades[student.id] = row.NOTA.toString();
            importedCount++;
          }
        }
      });

      setGrades(newGrades);
      setMessage({ type: "success", text: `Se cargaron ${importedCount} notas desde el Excel. Recuerda darle a Guardar.` });
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="card" style={{ padding: '2rem' }}>
      {!canEdit && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            <span>Este periodo está <strong>CERRADO</strong> por el administrador. No se permiten cambios.</span>
          </div>
          <button onClick={() => setShowRequestModal(true)} className="btn-secondary" style={{ backgroundColor: 'white', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>
            Solicitar Habilitación
          </button>
        </div>
      )}

      {hasApprovedRequest && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <CheckCircle size={20} />
           <span>Tienes una <strong>AUTORIZACIÓN ACTIVA</strong> para editar notas en este periodo cerrado.</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Seleccionar Periodo</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', minWidth: '200px' }}
            >
              {periods.map(p => <option key={p.id} value={p.id}>{p.name} ({p.weight}%)</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={downloadTemplate} className="btn-secondary" style={{ padding: '0.625rem 1rem', fontSize: '0.875rem' }} disabled={!canEdit}>
              <Download size={18} /> Plantilla
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary" style={{ padding: '0.625rem 1rem', fontSize: '0.875rem' }} disabled={!canEdit}>
              <FileUp size={18} /> Cargar Excel
            </button>
            <Link href={`/dashboard/reportes/planilla/${assignment.id}`} target="_blank" className="btn-secondary" style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={18} /> Imprimir Planilla
            </Link>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".xlsx, .xls" 
              style={{ display: 'none' }} 
            />
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          className="btn-primary" 
          disabled={isSaving || !selectedPeriod || !canEdit}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <Save size={20} /> {isSaving ? "Guardando..." : "Guardar Calificaciones"}
        </button>
      </div>

      {showRequestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', padding: '2rem' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Solicitar Habilitación</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Explica el motivo por el cual necesitas subir notas a este periodo cerrado.</p>
            <textarea 
              value={reason} 
              onChange={e => setReason(e.target.value)}
              placeholder="Ej: El estudiante entregó trabajos extemporáneos..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', height: '100px', marginBottom: '1.5rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowRequestModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              <button onClick={handleRequest} className="btn-primary" style={{ flex: 1 }}>Enviar Solicitud</button>
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <div style={{ 
          padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
          border: `1px solid ${message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`
        }}>
          {message.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
          {message.text}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-light)' }}>
              <th style={{ padding: '1rem' }}>Estudiante</th>
              <th style={{ padding: '1rem', width: '150px' }}>Calificación</th>
              <th style={{ padding: '1rem' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{student.firstName} {student.lastName}</td>
                <td style={{ padding: '1rem' }}>
                  {config.type === "NUMERIC" ? (
                    <input 
                      type="number" 
                      min={config.minValue} 
                      max={config.maxValue} 
                      step="0.1"
                      value={grades[student.id] || ""}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}
                      placeholder={`${config.minValue}-${config.maxValue}`}
                    />
                  ) : (
                    <select 
                      value={grades[student.id] || ""}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}
                    >
                      <option value="">Seleccionar...</option>
                      {config.allowedValues.split(",").map((val: string) => <option key={val} value={val}>{val}</option>)}
                    </select>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {grades[student.id] ? (
                    <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 'bold' }}>LISTO PARA GUARDAR</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>PENDIENTE</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

