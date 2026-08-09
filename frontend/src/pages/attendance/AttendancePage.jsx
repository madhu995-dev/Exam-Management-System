import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { examApi } from '../../api/examApi';
import { studentApi } from '../../api/studentApi';
import { facultyApi } from '../../api/facultyApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AttendancePage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const isStudent = role === 'STUDENT';

  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    examId: '',
    studentId: '',
    facultyId: '',
    attendanceStatus: 'PRESENT',
    remarks: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDropdowns = async () => {
    try {
      const exData = await examApi.getAllExams().catch(() => []);
      setExams(exData || []);
      if (exData && exData.length > 0) {
        setSelectedExamId(exData[0].id);
      } else {
        setLoading(false);
      }

      if (!isStudent) {
        const [stuData, facData] = await Promise.all([
          studentApi.getAllStudents().catch(() => []),
          facultyApi.getAllFaculties().catch(() => []),
        ]);
        setStudents(stuData || []);
        setFaculties(facData || []);
      }
    } catch (err) {
      setError('No examination schedule found.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchAttendance = async (examId, statusFilter = 'ALL') => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (statusFilter === 'PRESENT') {
        data = await attendanceApi.getPresentStudents(examId);
      } else if (statusFilter === 'ABSENT') {
        data = await attendanceApi.getAbsentStudents(examId);
      } else {
        data = await attendanceApi.getAttendanceByExam(examId);
      }
      setAttendanceRecords(data || []);
    } catch (err) {
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchAttendance(selectedExamId, filterStatus);
    }
  }, [selectedExamId, filterStatus]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      examId: selectedExamId || (exams[0]?.id || ''),
      studentId: students[0]?.id || '',
      facultyId: faculties[0]?.id || '',
      attendanceStatus: 'PRESENT',
      remarks: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (att) => {
    setEditingId(att.id);
    setFormData({
      examId: att.examId || selectedExamId,
      studentId: att.studentId || '',
      facultyId: att.facultyId || '',
      attendanceStatus: att.attendanceStatus || 'PRESENT',
      remarks: att.remarks || '',
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

    if (!formData.examId || !formData.studentId || !formData.attendanceStatus) {
      setFormError('Please select Exam, Student, and Attendance Status');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        examId: Number(formData.examId),
        studentId: Number(formData.studentId),
        facultyId: formData.facultyId ? Number(formData.facultyId) : null,
        attendanceStatus: formData.attendanceStatus,
        remarks: formData.remarks,
      };

      if (editingId) {
        await attendanceApi.updateAttendance(editingId, payload);
      } else {
        await attendanceApi.markAttendance(payload);
      }
      setShowModal(false);
      fetchAttendance(selectedExamId, filterStatus);
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceApi.deleteAttendance(id);
        fetchAttendance(selectedExamId, filterStatus);
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete attendance record');
      }
    }
  };

  const filteredRecords = attendanceRecords.filter((rec) =>
    rec.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    rec.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    rec.remarks?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Exam Attendance Register</h1>
          <p className="page-subtitle">Mark, verify, and update candidate attendance for examination sessions</p>
        </div>

        {!isStudent && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Mark Attendance
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Exam:</div>
        <select
          className="form-control form-select"
          style={{ maxWidth: '320px' }}
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
        >
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.examName} ({ex.examCode})
            </option>
          ))}
        </select>

        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Status:</div>
        <select
          className="form-control form-select"
          style={{ maxWidth: '160px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">ALL</option>
          <option value="PRESENT">PRESENT</option>
          <option value="ABSENT">ABSENT</option>
        </select>

        <SearchInput value={search} onChange={setSearch} placeholder="Search by student or roll..." />
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching attendance records..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchAttendance(selectedExamId, filterStatus)} />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          title="No Attendance Records Found"
          message={search ? 'No records match your filter.' : 'Attendance has not been recorded for this exam yet.'}
          actionText={!isStudent ? "Mark Attendance" : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Status</th>
                <th>Marked By Faculty</th>
                <th>Remarks</th>
                <th>Time</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id}>
                  <td style={{ fontWeight: '600' }}>{rec.studentName}</td>
                  <td>
                    <span className="badge badge-primary">{rec.rollNumber}</span>
                  </td>
                  <td>{rec.departmentName}</td>
                  <td>
                    <span
                      className={`badge ${
                        rec.attendanceStatus === 'PRESENT'
                          ? 'badge-success'
                          : rec.attendanceStatus === 'ABSENT'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {rec.attendanceStatus}
                    </span>
                  </td>
                  <td>{rec.facultyName || 'N/A'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{rec.remarks || 'None'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {rec.markedAt ? new Date(rec.markedAt).toLocaleTimeString() : 'N/A'}
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(rec)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(rec.id)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mark / Edit Attendance Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Attendance Record' : 'Mark Exam Attendance'}
              </h3>
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
                  <label className="form-label" htmlFor="studentId">Student</label>
                  <select
                    id="studentId"
                    className="form-control form-select"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.hallTicketNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="attendanceStatus">Attendance Status</label>
                    <select
                      id="attendanceStatus"
                      className="form-control form-select"
                      value={formData.attendanceStatus}
                      onChange={(e) => setFormData({ ...formData, attendanceStatus: e.target.value })}
                    >
                      <option value="PRESENT">PRESENT</option>
                      <option value="ABSENT">ABSENT</option>
                      <option value="MALPRACTICE">MALPRACTICE</option>
                      <option value="LATE">LATE</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="facultyId">Invigilator Faculty (Optional)</label>
                    <select
                      id="facultyId"
                      className="form-control form-select"
                      value={formData.facultyId}
                      onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    >
                      <option value="">Select Invigilator</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.firstName} {f.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="remarks">Remarks / Notes</label>
                  <input
                    id="remarks"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Present in Hall-101, Seat 12"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Attendance' : 'Save Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
