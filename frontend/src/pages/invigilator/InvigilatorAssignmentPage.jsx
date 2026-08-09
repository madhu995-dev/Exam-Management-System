import React, { useState, useEffect } from 'react';
import { invigilatorApi } from '../../api/invigilatorApi';
import { examApi } from '../../api/examApi';
import { facultyApi } from '../../api/facultyApi';
import { roomApi } from '../../api/roomApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Trash2, User, DoorOpen, X } from 'lucide-react';

const InvigilatorAssignmentPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [exams, setExams] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    examId: '',
    facultyId: '',
    roomId: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDropdowns = async () => {
    try {
      const [exData, facData, rmData] = await Promise.all([
        examApi.getAllExams(),
        facultyApi.getAllFaculties(),
        roomApi.getAllRooms(),
      ]);
      setExams(exData || []);
      setFaculties(facData || []);
      setRooms(rmData || []);
      if (exData && exData.length > 0) {
        setSelectedExamId(exData[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch initial dropdown data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchAssignments = async (examId) => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await invigilatorApi.getAssignmentsByExam(examId);
      setAssignments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load invigilator assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchAssignments(selectedExamId);
    }
  }, [selectedExamId]);

  const handleOpenModal = () => {
    setFormData({
      examId: selectedExamId || (exams[0]?.id || ''),
      facultyId: faculties[0]?.id || '',
      roomId: rooms[0]?.id || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.examId || !formData.facultyId || !formData.roomId) {
      setFormError('Please select Exam, Faculty member, and Hall Room');
      return;
    }

    setSubmitting(true);
    try {
      await invigilatorApi.assignInvigilator({
        examId: Number(formData.examId),
        facultyId: Number(formData.facultyId),
        roomId: Number(formData.roomId),
      });
      setShowModal(false);
      fetchAssignments(selectedExamId);
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to assign invigilator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this invigilator duty assignment?')) {
      try {
        await invigilatorApi.deleteAssignment(id);
        fetchAssignments(selectedExamId);
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to remove duty');
      }
    }
  };

  const filteredAssignments = assignments.filter((asgn) =>
    asgn.facultyName?.toLowerCase().includes(search.toLowerCase()) ||
    asgn.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
    asgn.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
    asgn.blockName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invigilator Duty Roster</h1>
          <p className="page-subtitle">Assign faculty members as invigilators for specific exam halls</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenModal} className="btn btn-primary">
            <Plus size={18} /> Assign Invigilator
          </button>
        )}
      </div>

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

        <SearchInput value={search} onChange={setSearch} placeholder="Search by faculty, employee ID, room..." />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading duty assignments..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchAssignments(selectedExamId)} />
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          title="No Invigilators Assigned"
          message={search ? 'No assignment matches your search.' : 'No faculty member has been assigned duty for this exam yet.'}
          actionText={isAdmin ? 'Assign First Invigilator' : null}
          onAction={handleOpenModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Duty ID</th>
                <th>Faculty Name</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Assigned Hall Room</th>
                <th>Block Name</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((asgn) => (
                <tr key={asgn.id}>
                  <td>#{asgn.id}</td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} style={{ color: 'var(--primary-500)' }} />
                      {asgn.facultyName}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{asgn.employeeId}</span>
                  </td>
                  <td>{asgn.departmentName}</td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <DoorOpen size={14} style={{ color: 'var(--accent-purple)' }} />
                      {asgn.roomNumber}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{asgn.blockName}</span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(asgn.id)} className="btn btn-danger btn-sm" title="Remove Duty">
                        <Trash2 size={14} /> Remove Duty
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Assign Invigilator to Hall</h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="examId">Examination</label>
                  <select
                    id="examId"
                    className="form-control form-select"
                    value={formData.examId}
                    onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                    required
                  >
                    <option value="">Select Exam</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.examName} ({ex.examCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="facultyId">Faculty Member</label>
                  <select
                    id="facultyId"
                    className="form-control form-select"
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    required
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.firstName} {f.lastName} ({f.employeeId}) - {f.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="roomId">Exam Hall Room</label>
                  <select
                    id="roomId"
                    className="form-control form-select"
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.blockName}) - Capacity: {r.capacity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Assigning...' : 'Confirm Duty Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvigilatorAssignmentPage;
