import React, { useState, useEffect } from 'react';
import { seatAllocationApi } from '../../api/seatAllocationApi';
import { examApi } from '../../api/examApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Grid, Play, Trash2, DoorOpen, Box, User } from 'lucide-react';

const SeatAllocationPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchExams = async () => {
    try {
      const exData = await examApi.getAllExams();
      setExams(exData || []);
      if (exData && exData.length > 0) {
        setSelectedExamId(exData[0].id);
      } else {
        setLoading(false);
      }
    } catch {
      setError('Failed to fetch exams list');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchAllocations = async (examId) => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await seatAllocationApi.getAllocationByExam(examId);
      setAllocations(data || []);
    } catch (err) {
      // Gracefully handle ungenerated state or initial empty allocation without scary error banners
      setAllocations([]);
      const status = err.response?.status;
      if (status !== 404 && status !== 400) {
        const msg = typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message;
        if (msg && !msg.toLowerCase().includes('insufficient') && !msg.toLowerCase().includes('no seat')) {
          setError(msg);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchAllocations(selectedExamId);
    }
  }, [selectedExamId]);

  const handleRunAllocation = async () => {
    if (!selectedExamId) return;
    setAllocating(true);
    setError(null);
    try {
      // Calls POST /api/seat-allocations/{examId}/allocate
      const result = await seatAllocationApi.allocateSeats(selectedExamId);
      setAllocations(result || []);
      alert('Automatic seat allocation executed successfully!');
    } catch (err) {
      const serverMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Seat allocation failed. Ensure students are registered and room seats are available.';
      setError(serverMsg);
    } finally {
      setAllocating(false);
    }
  };

  const handleDeleteAllocation = async () => {
    if (!selectedExamId) return;
    if (window.confirm('Are you sure you want to clear seat allocations for this exam?')) {
      try {
        await seatAllocationApi.deleteAllocation(selectedExamId);
        setAllocations([]);
        alert('Seat allocations deleted successfully!');
      } catch (err) {
        const serverMsg = typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || err.message || 'Cannot clear seat allocations because Hall Tickets have already been generated linking to these seats.';
        alert(serverMsg);
      }
    }
  };

  const filteredAllocations = allocations.filter((alloc) =>
    alloc.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    alloc.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    alloc.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
    alloc.blockName?.toLowerCase().includes(search.toLowerCase()) ||
    alloc.seatNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Automated Seat Allocation</h1>
          <p className="page-subtitle">Algorithmic seating arrangement generation for students across blocks and halls</p>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleRunAllocation}
              className="btn btn-primary"
              disabled={allocating || !selectedExamId}
            >
              <Play size={18} /> {allocating ? 'Allocating Seats...' : 'Run Auto Allocation'}
            </button>
            {allocations.length > 0 && (
              <button onClick={handleDeleteAllocation} className="btn btn-danger">
                <Trash2 size={18} /> Clear Seating
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exam Selector */}
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
              {ex.examName} ({ex.examCode}) - {ex.examDate}
            </option>
          ))}
        </select>

        <SearchInput value={search} onChange={setSearch} placeholder="Search allocated student, room, seat..." />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching seat allocations..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchAllocations(selectedExamId)} />
      ) : filteredAllocations.length === 0 ? (
        <EmptyState
          title="No Seating Plan Generated"
          message="Click 'Run Auto Allocation' to generate a seating plan for this examination."
          actionText={isAdmin ? 'Run Auto Allocation Engine' : null}
          onAction={handleRunAllocation}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Seat No</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Block Name</th>
                <th>Room Number</th>
                <th>Row / Col</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((alloc) => (
                <tr key={alloc.id}>
                  <td>
                    <span className="badge badge-success">
                      <Grid size={12} style={{ marginRight: '0.25rem' }} />
                      Seat #{alloc.seatNumber}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} style={{ color: 'var(--primary-500)' }} />
                      {alloc.studentName}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{alloc.rollNumber}</span>
                  </td>
                  <td>{alloc.departmentName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Box size={14} style={{ color: 'var(--accent-blue)' }} />
                      {alloc.blockName}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                      <DoorOpen size={14} style={{ color: 'var(--accent-purple)' }} />
                      {alloc.roomNumber}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    Row {alloc.rowNumber}, Col {alloc.columnNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeatAllocationPage;
