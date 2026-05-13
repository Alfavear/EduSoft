"use client";

import React from "react";

export function StudentBoletin({ data, schoolInfo, periodName }: { data: any, schoolInfo: any, periodName: string }) {
  if (!data) return <div>No hay datos disponibles</div>;

  return (
    <div className="boletin-container" style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      margin: '0 auto',
      backgroundColor: 'white',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      lineHeight: '1.2'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
        {schoolInfo?.logo && (
          <img 
            src={schoolInfo.logo} 
            alt="Logo" 
            style={{ position: 'absolute', left: 0, top: 0, width: '80px', height: '80px', objectFit: 'contain' }} 
          />
        )}
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{schoolInfo?.name || "INSTITUTO SENDERO DEL SABER"}</h1>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>MARIA REPARADA</h2>
        <div style={{ fontSize: '0.75rem', color: '#333' }}>
          <p>{schoolInfo?.license || "Licencia de Funcionamiento N° 00455 de diciembre 12/2007"}</p>
          <p>{schoolInfo?.legalStatus || "Personería Jurídica N° 235 de abril 28/2.008"}</p>
          <p>Nit: {schoolInfo?.nit || "900274879-0"} - Dane: {schoolInfo?.dane || "413433000610"}</p>
          <p>Dirección: {schoolInfo?.address || "Malagana, calle las palmas N° 13 - 114"}</p>
          <p>Teléfono: {schoolInfo?.phone || "3114278004"}</p>
          <p>Malagana – Mahates – Bolívar</p>
        </div>
      </div>

      {/* Student Info Bar */}
      <div style={{ 
        border: '1px solid black', 
        padding: '0.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '0.85rem', 
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: '1rem'
      }}>
        <span>{data.student.firstName} {data.student.lastName}</span>
        <span>GRADO: {data.student.course.name}</span>
        <span>PERIODO: {periodName}</span>
        <span style={{ color: '#d32f2f' }}>PUESTO: {data.rank}</span>
      </div>

      {/* Grades Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', border: '1px solid black' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid black', padding: '0.4rem', width: '20%' }}>AREA</th>
            <th style={{ border: '1px solid black', padding: '0.4rem', width: '8%' }}>ESC. D V. INS.</th>
            <th style={{ border: '1px solid black', padding: '0.4rem', width: '5%' }}>I.H.</th>
            <th style={{ border: '1px solid black', padding: '0.4rem' }}>JUICIOS VALORATIVOS</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((sub: any, i: number) => (
            <tr key={i}>
              <td style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold', verticalAlign: 'top' }}>
                {sub.name}
              </td>
              <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', verticalAlign: 'top' }}>
                {sub.grade.toFixed(1)}
              </td>
              <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center', verticalAlign: 'top' }}>
                {sub.intensity || '—'}
              </td>
              <td style={{ border: '1px solid black', padding: '0.5rem', verticalAlign: 'top' }}>
                <div style={{ whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>
                  {sub.description || 'No se han registrado juicios valorativos para este nivel.'}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.65rem', borderTop: '0.5px solid #ccc', paddingTop: '0.2rem' }}>
                  DESEMPEÑO {sub.performanceLevel.toUpperCase()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Observations */}
      <div style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>OBSERVACIONES:</p>
        <div style={{ borderBottom: '1px solid #ccc', minHeight: '2rem' }}>
          {data.observations || "Se destaca por su responsabilidad, interés y dedicación en las actividades escolares."}
        </div>
      </div>

      {/* Scale Info */}
      <div style={{ marginTop: '1.5rem', fontSize: '0.7rem' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>ESCALA DE VALORACION</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p>D. SUPERIOR __________ RANGO NUMERICO DEL 4.6 AL 5.0</p>
            <p>D. ALTO _______________ RANGO NUMERICO DEL 4.0 AL 4.5</p>
          </div>
          <div>
            <p>D. BASICO _____________ RANGO NUMERICO DEL 3.0 AL 3.9</p>
            <p>D. BAJO _______________ RANGO NUMERICO DEL 1.0 AL 2.9</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem' }}>
        <div style={{ textAlign: 'center', width: '200px' }}>
          <div style={{ borderTop: '1px solid black', paddingTop: '0.5rem' }}>DIRECTORA</div>
        </div>
        <div style={{ textAlign: 'center', width: '200px' }}>
          <div style={{ borderTop: '1px solid black', paddingTop: '0.5rem' }}>PROFESOR(A)</div>
        </div>
      </div>

      {/* Global CSS for Print */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .boletin-container, .boletin-container * { visibility: visible; }
          .boletin-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 0;
            box-shadow: none;
          }
          @page { margin: 10mm; }
        }
      `}</style>
    </div>
  );
}
