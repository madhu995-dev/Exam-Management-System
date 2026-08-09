import React, { useState, useEffect } from 'react';
import { hallTicketApi } from '../../api/hallTicketApi';
import { examApi } from '../../api/examApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Ticket, Printer, RefreshCw, Eye, GraduationCap, X } from 'lucide-react';

const HallTicketPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Selected Admit Card Modal
  const [viewTicket, setViewTicket] = useState(null);

  const fetchExams = async () => {
    try {
      const exData = await examApi.getAllExams();
      setExams(exData || []);
      if (exData && exData.length > 0) {
        setSelectedExamId(exData[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load exams list');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchTickets = async (examId) => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await hallTicketApi.getHallTicketsByExam(examId);
      setTickets(data || []);
    } catch (err) {
      setTickets([]);
      const status = err.response?.status;
      if (status !== 404 && status !== 400) {
        const msg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message;
        if (msg && !msg.toLowerCase().includes('no hall ticket')) {
          setError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchTickets(selectedExamId);
    }
  }, [selectedExamId]);

  const handleGenerateAll = async () => {
    if (!selectedExamId) return;
    setGenerating(true);
    setError(null);
    try {
      // Calls POST /api/hall-tickets/generate/{examId}
      const data = await hallTicketApi.generateHallTickets(selectedExamId);
      setTickets(data || []);
      alert('Hall tickets generated successfully for all eligible students!');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to generate hall tickets.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTickets = tickets.filter((t) =>
    t.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    t.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.hallTicketNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hall Ticket Generation</h1>
          <p className="page-subtitle">Generate, inspect, and issue official examination admit cards</p>
        </div>

        {isAdmin && (
          <button
            onClick={handleGenerateAll}
            className="btn btn-primary"
            disabled={generating || !selectedExamId}
          >
            <RefreshCw size={18} /> {generating ? 'Generating Admit Cards...' : 'Generate All Hall Tickets'}
          </button>
        )}
      </div>

      {/* Selector */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Select Examination:</div>
        <select
          className="form-control form-select"
          style={{ maxWidth: '380px' }}
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.examName} ({ex.examCode})
            </option>
          ))}
        </select>

        <SearchInput value={search} onChange={setSearch} placeholder="Search by student, hall ticket number..." />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching admit cards..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchTickets(selectedExamId)} />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          title="No Hall Tickets Found"
          message="Click 'Generate All Hall Tickets' to generate admit cards for registered students."
          actionText={isAdmin ? 'Generate Hall Tickets' : null}
          onAction={handleGenerateAll}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Hall Ticket No</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Subject</th>
                <th>Date & Time</th>
                <th>Hall / Seat</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className="badge badge-primary">
                      <Ticket size={12} style={{ marginRight: '0.25rem' }} />
                      {t.hallTicketNumber}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{t.studentName}</td>
                  <td>{t.rollNumber}</td>
                  <td>{t.subjectName} ({t.subjectCode})</td>
                  <td>{t.examDate} ({t.startTime} - {t.endTime})</td>
                  <td>{t.roomNumber} - Seat #{t.seatNumber}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => setViewTicket(t)} className="btn btn-secondary btn-sm">
                      <Eye size={14} /> View Admit Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Official Admit Card Modal View */}
      {viewTicket && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '680px', background: '#0f172a' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={22} style={{ color: 'var(--primary-500)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>OFFICIAL HALL TICKET</h3>
              </div>
              <button onClick={() => setViewTicket(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ background: '#1e293b', border: '2px solid var(--primary-500)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>UNIVERSITY EXAMINATION AUTHORITY</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-500)', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                  ADMIT CARD - {viewTicket.examName} ({viewTicket.examCode})
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>HALL TICKET NUMBER</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>{viewTicket.hallTicketNumber}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>STUDENT NAME</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{viewTicket.studentName}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ROLL NUMBER</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{viewTicket.rollNumber}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DEPARTMENT</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{viewTicket.departmentName}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>EXAMINATION & SEATING DETAILS</h4>
                <div className="grid grid-cols-2" style={{ gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div><strong>Subject:</strong> {viewTicket.subjectName} ({viewTicket.subjectCode})</div>
                  <div><strong>Date:</strong> {viewTicket.examDate}</div>
                  <div><strong>Time:</strong> {viewTicket.startTime} - {viewTicket.endTime}</div>
                  <div><strong>Building Block:</strong> {viewTicket.blockName}</div>
                  <div><strong>Hall Room:</strong> {viewTicket.roomNumber}</div>
                  <div><strong>Assigned Seat:</strong> Seat #{viewTicket.seatNumber} (Row {viewTicket.rowNumber}, Col {viewTicket.columnNumber})</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                * Candidate must bring this official admit card along with valid college identity card to the examination hall.
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setViewTicket(null)} className="btn btn-secondary">
                Close
              </button>
              <button onClick={handlePrint} className="btn btn-primary">
                <Printer size={16} /> Print Admit Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallTicketPage;
