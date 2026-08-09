import React, { useState, useEffect } from 'react';
import { studentSubjectApi } from '../../api/studentSubjectApi';
import { studentApi } from '../../api/studentApi';
import { subjectApi } from '../../api/subjectApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { Plus, Trash2, UserCheck, BookOpen, X, UploadCloud } from 'lucide-react';

const StudentSubjectPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', subjectId: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [regData, stuData, subData] = await Promise.all([
        studentSubjectApi.getAllStudentSubjects().catch(() => []),
        studentApi.getAllStudents().catch(() => []),
        subjectApi.getAllSubjects().catch(() => []),
      ]);
      setRegistrations(regData || []);
      setStudents(stuData || []);
      setSubjects(subData || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load subject registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      studentId: students[0]?.id || '',
      subjectId: subjects[0]?.id || '',
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

    if (!formData.studentId || !formData.subjectId) {
      setFormError('Please select both Student and Subject');
      return;
    }

    setSubmitting(true);
    try {
      await studentSubjectApi.registerStudentSubject({
        studentId: Number(formData.studentId),
        subjectId: Number(formData.subjectId),
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to register student for subject');
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
        const rawStu = String(rec.studentId || rec.hallTicketNumber || rec.rollNumber || '').trim();
        const rawSub = String(rec.subjectId || rec.subjectCode || '').trim();

        if (!rawStu) {
          throw new Error('Student ID or Hall Ticket Number is required');
        }
        if (!rawSub) {
          throw new Error('Subject ID or Subject Code is required');
        }

        // 1. Find Student by ID, Hall Ticket, Roll Number, or Name
        let foundStu = students.find(
          (s) =>
            String(s.id) === rawStu ||
            s.hallTicketNumber?.toLowerCase() === rawStu.toLowerCase() ||
            s.rollNumber?.toLowerCase() === rawStu.toLowerCase() ||
            `${s.firstName} ${s.lastName}`.toLowerCase() === rawStu.toLowerCase()
        );

        if (!foundStu) {
          const stuDigits = rawStu.replace(/\D/g, '');
          if (stuDigits) {
            foundStu = students.find((s) => {
              const d = (s.hallTicketNumber || s.rollNumber || '').replace(/\D/g, '');
              return d && (d === stuDigits || Number(d) === Number(stuDigits));
            });
          }
        }

        if (!foundStu) {
          throw new Error(`Student '${rawStu}' not found in registered students`);
        }

        // 2. Find Subject by ID, Code, or Name
        let foundSub = subjects.find(
          (sub) =>
            String(sub.id) === rawSub ||
            sub.subjectCode?.toLowerCase() === rawSub.toLowerCase() ||
            sub.subjectName?.toLowerCase() === rawSub.toLowerCase()
        );

        if (!foundSub) {
          const subDigits = rawSub.replace(/\D/g, '');
          if (subDigits) {
            foundSub = subjects.find((sub) => {
              const d = (sub.subjectCode || '').replace(/\D/g, '');
              return d && (d === subDigits || Number(d) === Number(subDigits));
            });
          }
        }

        if (!foundSub) {
          throw new Error(`Subject '${rawSub}' not found in subject catalog`);
        }

        await studentSubjectApi.registerStudentSubject({
          studentId: Number(foundStu.id),
          subjectId: Number(foundSub.id),
        });
        successCount++;
      } catch (err) {
        failedRecords.push({
          index: i,
          reason: typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message || err.message,
        });
      }
      onProgress(i + 1);
    }

    fetchData();
    return { successCount, total: records.length, failedRecords };
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this registration?')) {
      try {
        await studentSubjectApi.unregisterStudentSubject(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to unregister subject');
      }
    }
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    reg.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    reg.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
    reg.subjectCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Subject Registration</h1>
          <p className="page-subtitle">Assign subjects to students for examination eligibility</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
              <UploadCloud size={18} /> Bulk Import
            </button>
            <button onClick={handleOpenModal} className="btn btn-primary">
              <Plus size={18} /> Register Subject
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by student name, roll number, subject..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredRegistrations.length}</strong> registrations
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading subject registrations..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : filteredRegistrations.length === 0 ? (
        <EmptyState
          title="No Registrations Found"
          message={search ? 'No registrations match your search.' : 'No students have registered subjects yet.'}
          actionText={isAdmin && !search ? 'Register First Subject' : null}
          onAction={handleOpenModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Roll / HT Number</th>
                <th>Subject Name</th>
                <th>Subject Code</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg, index) => (
                <tr key={reg.id}>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>#{index + 1}</td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
                      {reg.studentName || `Student #${reg.studentId}`}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{reg.rollNumber || 'N/A'}</span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={15} style={{ color: 'var(--primary-500)' }} />
                      {reg.subjectName || `Subject #${reg.subjectId}`}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{reg.subjectCode || 'N/A'}</span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(reg.id)} className="btn btn-danger btn-sm" title="Remove Registration">
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Register Student for Subject</h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="studentId">Select Student</label>
                  <select
                    id="studentId"
                    className="form-control form-select"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  >
                    <option value="">Choose Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.hallTicketNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subjectId">Select Subject</label>
                  <select
                    id="subjectId"
                    className="form-control form-select"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    required
                  >
                    <option value="">Choose Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.subjectName} ({sub.subjectCode})
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
                  {submitting ? 'Registering...' : 'Confirm Registration'}
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
        title="Bulk Student Subject Registration"
        entityName="Subject Registrations"
        requiredColumns={['studentId', 'subjectId']}
        sampleCsv={`studentId,subjectId\nHT2026101,CS301\nHT2026102,CS301\nHT2026103,CS301\nHT2026104,CS301`}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default StudentSubjectPage;
