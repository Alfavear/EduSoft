"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Edit, CheckCircle2, XCircle, AlertCircle, UserCheck, FileCheck, UserPlus } from "lucide-react";
import { getEnrollments, updateStudentOfficialData, uploadPrematricula, changeStudentDocument } from "./actions";
import { SIMATForm } from "./SIMATForm";
import { StudentRegistrationForm } from "./StudentRegistrationForm";


export function EnrollmentList({ 
  initialEnrollments, 
  courses, 
  academicYears,
  filters,
  setFilters
}: any) {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    handleFilter();
  }, [filters.academicYearId, filters.courseId, filters.status]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const data = await getEnrollments(filters);
      setEnrollments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((en: any) => {
    const fullName = `${en.student.firstName} ${en.student.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || en.student.documentId?.includes(search);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED': return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', fontWeight: 'bold' }}>APROBADO</span>;
      case 'FAILED': return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', fontWeight: 'bold' }}>REPROBADO</span>;
      case 'REMEDIAL': return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', fontWeight: 'bold' }}>NIVELATORIO</span>;
      case 'WITHDRAWN': return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)', fontWeight: 'bold' }}>RETIRADO</span>;
      default: return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', fontWeight: 'bold' }}>MATRICULADO</span>;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 450px' : '1fr', gap: '2rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar estudiante por nombre o documento..." 
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="input-field" 
            style={{ width: '180px' }}
            value={filters.academicYearId}
            onChange={e => setFilters({...filters, academicYearId: e.target.value})}
          >
            {academicYears.map((ay: any) => <option key={ay.id} value={ay.id}>{ay.name}</option>)}
          </select>
          <select 
            className="input-field" 
            style={{ width: '180px' }}
            value={filters.courseId}
            onChange={e => setFilters({...filters, courseId: e.target.value})}
          >
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => setShowRegistration(true)}
          >
            <UserPlus size={18} /> Registrar Nuevo Estudiante
          </button>
        </div>

        {showRegistration && (
          <StudentRegistrationForm 
            courses={courses} 
            onClose={() => { setShowRegistration(false); handleFilter(); }} 
          />
        )}


        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estudiante</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Documento</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Curso</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Promedio Final</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>Prematrícula</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>SIMAT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>Cargando registros...</td></tr>
              ) : filteredEnrollments.map((en: any) => (
                <tr key={en.id} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: selectedStudent?.id === en.student.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600' }}>{en.student.lastName}, {en.student.firstName}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{en.student.documentId || '—'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{en.course.name}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    {en.finalAverage ? en.finalAverage.toFixed(2) : '—'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {en.prematriculaUrl ? (
                      <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <FileCheck size={16} /> <span style={{ fontSize: '0.7rem' }}>Cargada</span>
                      </div>
                    ) : (
                      <button 
                        className="btn-secondary" 
                        style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => {
                          const url = prompt("Ingrese la URL del documento de prematrícula:");
                          if (url) uploadPrematricula(en.id, url);
                        }}
                      >
                        Cargar
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {getStatusBadge(en.status)}
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      onClick={() => setSelectedStudent(en.student)}
                    >
                      <UserCheck size={14} /> Ficha Oficial
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredEnrollments.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No se encontraron matrículas para los filtros seleccionados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel: SIMAT Data */}
      {selectedStudent && (
        <div className="card" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem', animation: 'slideInRight 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Ficha Oficial (SIMAT)</h3>
            <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <XCircle size={20} />
            </button>
          </div>
          <SIMATForm student={selectedStudent} onClose={() => { setSelectedStudent(null); handleFilter(); }} />
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
