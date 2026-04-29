"use client";

import { useState, useEffect } from "react";
import { 
  getAttendanceData, 
  saveAttendance, 
  checkAttendancePermission, 
  createAttendanceRequest 
} from "./actions";
import { 
  UserCheck, 
  Calendar, 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronLeft,
  Search
} from "lucide-react";

export function AttendanceManager({ courses, teacherId, role, studentData }: { courses: any[], teacherId: string, role: string, studentData?: any }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<{ allowed: boolean, needsRequest?: boolean, future?: boolean }>({ allowed: true });
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (role !== 'STUDENT') {
      fetchStudents();
    }
  }, [selectedCourse, date]);

  const fetchStudents = async () => {
    if (!selectedCourse || !date) return;
    setLoading(true);
    
    const perm = await checkAttendancePermission(date);
    setPermission(perm);

    if (perm.allowed || role === 'ADMIN') {
      const data = await getAttendanceData(selectedCourse, date);
      setStudents(data);
    }
    setLoading(false);
  };

  if (role === 'STUDENT' && studentData) {
    return (
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem' }}>Mi Historial de Asistencia</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{studentData.totalAttendances}</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Días Registrados</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>{studentData.absences}</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Fallas Totales</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{studentData.percentage}%</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Asistencia</p>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Últimos Registros</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Fecha</th>
                <th style={{ padding: '1rem' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {studentData.recentHistory.map((h: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(h.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: h.status === 'PRESENT' ? 'rgba(16, 185, 129, 0.1)' : h.status === 'ABSENT' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: h.status === 'PRESENT' ? 'var(--color-success)' : h.status === 'ABSENT' ? 'var(--color-danger)' : 'var(--color-warning)'
                    }}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await saveAttendance(selectedCourse, date, students.map(s => ({ studentId: s.id, status: s.status })), teacherId);
    if (res.success) {
      setMessage({ type: "success", text: "Asistencia guardada correctamente." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
    setLoading(false);
  };

  const handleSubmitRequest = async () => {
    if (!reason) return;
    setLoading(true);
    const res = await createAttendanceRequest(teacherId, selectedCourse, date, reason);
    if (res.success) {
      setMessage({ type: "success", text: "Solicitud enviada al administrador." });
      setReason("");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <div>
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Seleccionar Curso</label>
              <select 
                value={selectedCourse} 
                onChange={e => setSelectedCourse(e.target.value)}
                className="input-field"
                style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}
              >
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ width: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Fecha</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="input-field"
                style={{ width: '100%', backgroundColor: 'var(--bg-app)' }}
              />
            </div>
          </div>

          {!permission.allowed && role !== 'ADMIN' ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: '1rem', border: '1px dashed var(--color-warning)' }}>
              <Clock size={48} color="var(--color-warning)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Plazo Excedido</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                El periodo permitido para registrar asistencia de forma directa ha vencido. Debes solicitar autorización a la administración.
              </p>
              <textarea 
                placeholder="Motivo del registro extemporáneo..." 
                value={reason} 
                onChange={e => setReason(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', marginBottom: '1rem', height: '100px' }}
              />
              <button onClick={handleSubmitRequest} className="btn-primary" disabled={loading || !reason} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Enviar Solicitud
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Estudiante</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Presente</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Falla</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Retraso</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Justificado</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{s.name}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input type="radio" name={`att-${s.id}`} checked={s.status === 'PRESENT'} onChange={() => handleStatusChange(s.id, 'PRESENT')} />
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input type="radio" name={`att-${s.id}`} checked={s.status === 'ABSENT'} onChange={() => handleStatusChange(s.id, 'ABSENT')} />
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input type="radio" name={`att-${s.id}`} checked={s.status === 'LATE'} onChange={() => handleStatusChange(s.id, 'LATE')} />
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input type="radio" name={`att-${s.id}`} checked={s.status === 'JUSTIFIED'} onChange={() => handleStatusChange(s.id, 'JUSTIFIED')} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                {message.text && <span style={{ color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '0.875rem' }}>{message.text}</span>}
                <button className="btn-primary" onClick={handleSave} disabled={loading || students.length === 0}>
                  <UserCheck size={18} /> Guardar Asistencia
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} color="var(--color-primary)" />
            Resumen del Día
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--color-primary)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {students.filter(s => s.status === 'PRESENT').length}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estudiantes Presentes</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--color-danger)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>
                {students.filter(s => s.status === 'ABSENT').length}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fallas totales</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--color-warning)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>
                {students.filter(s => s.status === 'LATE' || s.status === 'JUSTIFIED').length}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Novedades (Tardanza/Excusa)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
