import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/reportApi';
import { examApi } from '../../api/examApi';
import { FileText, FileSpreadsheet, Users, CheckSquare, Award, Grid, Ticket, ClipboardList } from 'lucide-react';

const ReportPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await examApi.getAllExams();
        setExams(data || []);
        if (data && data.length > 0) {
          setSelectedExamId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, []);

  const handleExport = async (exportFn, examIdRequired = true) => {
    if (examIdRequired && !selectedExamId) {
      alert('Please select an examination first.');
      return;
    }
    setDownloading(true);
    try {
      if (examIdRequired) {
        await exportFn(selectedExamId);
      } else {
        await exportFn();
      }
    } catch (err) {
      alert('Failed to download report document.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports Export Center</h1>
          <p className="page-subtitle">Download official PDF & Excel export documents for university audit and records</p>
        </div>
      </div>

      {/* Exam Selector for Exam-specific Reports */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Target Examination:</div>
        <select
          className="form-control form-select"
          style={{ maxWidth: '420px' }}
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.examName} ({ex.examCode})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Student Master Directory Reports */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Users size={22} style={{ color: 'var(--primary-500)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Student Master Directory Report</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Export full student roster including hall ticket numbers, departments, emails, and phone numbers.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => handleExport(reportApi.exportStudentsPdf, false)} className="btn btn-primary btn-sm" disabled={downloading}>
              <FileText size={16} /> Export PDF
            </button>
            <button onClick={() => handleExport(reportApi.exportStudentsExcel, false)} className="btn btn-secondary btn-sm" disabled={downloading}>
              <FileSpreadsheet size={16} /> Export Excel
            </button>
          </div>
        </div>

        {/* Attendance Reports */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <CheckSquare size={22} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Exam Attendance Register</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Export attendance report for selected examination with Present, Absent, and Malpractice status.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => handleExport(reportApi.exportAttendancePdf, true)} className="btn btn-primary btn-sm" disabled={downloading}>
              <FileText size={16} /> Export PDF
            </button>
            <button onClick={() => handleExport(reportApi.exportAttendanceExcel, true)} className="btn btn-secondary btn-sm" disabled={downloading}>
              <FileSpreadsheet size={16} /> Export Excel
            </button>
          </div>
        </div>

        {/* Examination Results Reports */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Award size={22} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Examination Results Ledger</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Export published marks sheet containing internal, external, total marks, grades, and pass percentage.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => handleExport(reportApi.exportResultsPdf, true)} className="btn btn-primary btn-sm" disabled={downloading}>
              <FileText size={16} /> Export PDF
            </button>
            <button onClick={() => handleExport(reportApi.exportResultsExcel, true)} className="btn btn-secondary btn-sm" disabled={downloading}>
              <FileSpreadsheet size={16} /> Export Excel
            </button>
          </div>
        </div>

        {/* Seat Allocation Seating Plan Reports */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Grid size={22} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Seating Arrangement Plan</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Export room-wise and block-wise seat allocation grid maps for hall paste notice boards.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => handleExport(reportApi.exportSeatAllocationPdf, true)} className="btn btn-primary btn-sm" disabled={downloading}>
              <FileText size={16} /> Export PDF
            </button>
            <button onClick={() => handleExport(reportApi.exportSeatAllocationExcel, true)} className="btn btn-secondary btn-sm" disabled={downloading}>
              <FileSpreadsheet size={16} /> Export Excel
            </button>
          </div>
        </div>

        {/* Bulk Hall Tickets Report */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Ticket size={22} style={{ color: 'var(--accent-blue)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Bulk Hall Tickets Booklet</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Export combined printable PDF booklet of all generated admit cards for candidate distribution.
          </p>
          <button onClick={() => handleExport(reportApi.exportHallTicketsPdf, true)} className="btn btn-primary btn-sm" disabled={downloading}>
            <FileText size={16} /> Export Hall Tickets PDF
          </button>
        </div>

        {/* Invigilator Duty Roster Report */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ClipboardList size={22} style={{ color: '#ec4899' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Invigilator Duty Roster PDF</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Export official faculty invigilation duty assignment roster for exam supervision.
          </p>
          <button onClick={() => handleExport(reportApi.exportInvigilatorPdf, true)} className="btn btn-primary btn-sm" disabled={downloading}>
            <FileText size={16} /> Export Duty Roster PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
