import React, { useState, useEffect } from 'react';
import { resultApi } from '../../api/resultApi';
import { examApi } from '../../api/examApi';
import { studentApi } from '../../api/studentApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { Plus, Edit2, Trash2, X, UploadCloud } from 'lucide-react';

const ResultPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const isStudent = role === 'STUDENT';

  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    examId: '',
    studentId: '',
    internalMarks: 20,
    externalMarks: 60,
    practicalMarks: 20,
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
        const stuData = await studentApi.getAllStudents().catch(() => []);
        setStudents(stuData || []);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchResults = async (examId) => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await resultApi.getResultsByExam(examId);
      setResults(data || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId) {
      fetchResults(selectedExamId);
    }
  }, [selectedExamId]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      examId: selectedExamId || (exams[0]?.id || ''),
      studentId: students[0]?.id || '',
      internalMarks: 20,
      externalMarks: 60,
      practicalMarks: 20,
      remarks: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (res) => {
    setEditingId(res.id);
    setFormData({
      examId: res.examId || selectedExamId,
      studentId: res.studentId || '',
      internalMarks: res.internalMarks || 0,
      externalMarks: res.externalMarks || 0,
      practicalMarks: res.practicalMarks || 0,
      remarks: res.remarks || '',
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

    if (!formData.examId || !formData.studentId) {
      setFormError('Please select both Exam and Student');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        examId: Number(formData.examId),
        studentId: Number(formData.studentId),
        internalMarks: Number(formData.internalMarks),
        externalMarks: Number(formData.externalMarks),
        practicalMarks: Number(formData.practicalMarks),
        remarks: formData.remarks,
      };

      if (editingId) {
        await resultApi.updateResult(editingId, payload);
      } else {
        await resultApi.publishResult(payload);
      }
      setShowModal(false);
      fetchResults(selectedExamId);
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to publish result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const payload = {
          examId: Number(rec.examId) || Number(selectedExamId),
          studentId: Number(rec.studentId),
          internalMarks: Number(rec.internalMarks) || 0,
          externalMarks: Number(rec.externalMarks) || 0,
          practicalMarks: Number(rec.practicalMarks) || 0,
          remarks: rec.remarks || '',
        };

        await resultApi.publishResult(payload);
        successCount++;
      } catch (err) {
        failedRecords.push({
          index: i,
          reason: typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message || err.message,
        });
      }
      onProgress(i + 1);
    }

    fetchResults(selectedExamId);
    return { successCount, total: records.length, failedRecords };
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultApi.deleteResult(id);
        fetchResults(selectedExamId);
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete result');
      }
    }
  };

  const filteredResults = results.filter((r) =>
    r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    r.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.grade?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Exam Results & Marks Portal</h1>
          <p className="page-subtitle">Publish, calculate, and review student internal, external, and practical marks</p>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
              <UploadCloud size={18} /> Bulk Import
            </button>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={18} /> Publish Result
            </button>
          </div>
        )}
      </div>

      {/* Selectors */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Examination:</div>
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

        <SearchInput value={search} onChange={setSearch} placeholder="Search student, roll number, grade..." />
      </div>

      {loading ? (
        <LoadingSpinner text="Loading examination results..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchResults(selectedExamId)} />
      ) : filteredResults.length === 0 ? (
        <EmptyState
          title="No Published Results"
          message={search ? 'No student result matches your search.' : 'No results published for this exam yet.'}
          actionText={isAdmin ? 'Publish First Result' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Internal</th>
                <th>External</th>
                <th>Practical</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: '600' }}>{r.studentName}</td>
                  <td>
                    <span className="badge badge-primary">{r.rollNumber}</span>
                  </td>
                  <td>{r.internalMarks}</td>
                  <td>{r.externalMarks}</td>
                  <td>{r.practicalMarks}</td>
                  <td style={{ fontWeight: '700' }}>{r.totalMarks}</td>
                  <td>{r.percentage ? `${r.percentage.toFixed(1)}%` : 'N/A'}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>{r.grade || 'N/A'}</span>
                  </td>
                  <td>
                    <span className={`badge ${r.pass ? 'badge-success' : 'badge-danger'}`}>
                      {r.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(r)} className="btn btn-secondary btn-sm" title="Edit Marks">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="btn btn-danger btn-sm" title="Delete Result">
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

      {/* Publish / Edit Result Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Student Marks' : 'Publish Student Result'}
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

                <div className="grid grid-cols-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="internalMarks">Internal Marks</label>
                    <input
                      id="internalMarks"
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.internalMarks}
                      onChange={(e) => setFormData({ ...formData, internalMarks: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="externalMarks">External Marks</label>
                    <input
                      id="externalMarks"
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.externalMarks}
                      onChange={(e) => setFormData({ ...formData, externalMarks: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="practicalMarks">Practical Marks</label>
                    <input
                      id="practicalMarks"
                      type="number"
                      min="0"
                      className="form-control"
                      value={formData.practicalMarks}
                      onChange={(e) => setFormData({ ...formData, practicalMarks: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="remarks">Evaluator Remarks</label>
                  <input
                    id="remarks"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Excellent performance in theory"
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
                  {submitting ? 'Publishing...' : editingId ? 'Update Result' : 'Publish Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Result Publishing Import"
        entityName="Results"
        requiredColumns={['examId', 'studentId', 'internalMarks', 'externalMarks', 'practicalMarks']}
        sampleCsv={`examId,studentId,internalMarks,externalMarks,practicalMarks,remarks\n1,1,22,65,23,Excellent\n1,2,19,58,21,Good`}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default ResultPage;
