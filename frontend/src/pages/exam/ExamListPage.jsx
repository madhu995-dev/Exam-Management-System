import React, { useState, useEffect } from 'react';
import { examApi } from '../../api/examApi';
import { seriesApi } from '../../api/seriesApi';
import { subjectApi } from '../../api/subjectApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { Plus, Edit2, Trash2, Calendar, Clock, BookOpen, X, UploadCloud } from 'lucide-react';

const ExamListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [exams, setExams] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    examName: '',
    examCode: '',
    seriesId: '',
    subjectId: '',
    examDate: '',
    startTime: '10:00',
    endTime: '13:00',
    duration: 180,
    status: 'SCHEDULED',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exData, serData, subData] = await Promise.all([
        examApi.getAllExams().catch(() => []),
        seriesApi.getAllSeries().catch(() => []),
        subjectApi.getAllSubjects().catch(() => []),
      ]);
      setExams(exData || []);
      setSeriesList(serData || []);
      setSubjects(subData || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load exams list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      examName: '',
      examCode: '',
      seriesId: seriesList[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      examDate: '',
      startTime: '10:00',
      endTime: '13:00',
      duration: 180,
      status: 'SCHEDULED',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (ex) => {
    setEditingId(ex.id);
    setFormData({
      examName: ex.examName || '',
      examCode: ex.examCode || '',
      seriesId: ex.seriesId || '',
      subjectId: ex.subjectId || '',
      examDate: ex.examDate || '',
      startTime: ex.startTime ? ex.startTime.substring(0, 5) : '10:00',
      endTime: ex.endTime ? ex.endTime.substring(0, 5) : '13:00',
      duration: ex.duration || 180,
      status: ex.status || 'SCHEDULED',
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

    if (!formData.examName || !formData.examCode || !formData.seriesId || !formData.subjectId || !formData.examDate || !formData.startTime || !formData.endTime) {
      setFormError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        seriesId: Number(formData.seriesId),
        subjectId: Number(formData.subjectId),
        duration: Number(formData.duration),
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
      };

      if (editingId) {
        await examApi.updateExam(editingId, payload);
      } else {
        await examApi.createExam(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save exam');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    const defaultSeriesId = seriesList && seriesList.length > 0 ? seriesList[0].id : null;
    const defaultSubjectId = subjects && subjects.length > 0 ? subjects[0].id : null;

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        let validSubjectId = Number(rec.subjectId);
        if (isNaN(validSubjectId) || !validSubjectId) {
          const foundSub = subjects.find(
            (s) => s.subjectCode === rec.subjectId || s.subjectName?.toLowerCase() === rec.subjectId?.toLowerCase()
          );
          validSubjectId = foundSub ? foundSub.id : defaultSubjectId;
        }

        let validSeriesId = Number(rec.seriesId);
        if (isNaN(validSeriesId) || !validSeriesId) {
          const foundSeries = seriesList.find(
            (s) => s.seriesName?.toLowerCase() === rec.seriesId?.toLowerCase()
          );
          validSeriesId = foundSeries ? foundSeries.id : defaultSeriesId;
        }

        if (defaultSeriesId && (!validSeriesId || !seriesList.some((s) => s.id === validSeriesId))) {
          validSeriesId = defaultSeriesId;
        }
        if (defaultSubjectId && (!validSubjectId || !subjects.some((s) => s.id === validSubjectId))) {
          validSubjectId = defaultSubjectId;
        }

        const rawStart = rec.startTime || '10:00';
        const rawEnd = rec.endTime || '13:00';

        const payload = {
          examName: rec.examName,
          examCode: rec.examCode,
          seriesId: validSeriesId,
          subjectId: validSubjectId,
          examDate: rec.examDate || new Date().toISOString().split('T')[0],
          startTime: rawStart.length === 5 ? `${rawStart}:00` : rawStart,
          endTime: rawEnd.length === 5 ? `${rawEnd}:00` : rawEnd,
          duration: Number(rec.duration) || 180,
          status: rec.status || 'SCHEDULED',
        };

        await examApi.createExam(payload);
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
    if (window.confirm('Are you sure you want to delete this examination?')) {
      try {
        await examApi.deleteExam(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete exam');
      }
    }
  };

  const filteredExams = exams.filter((ex) =>
    ex.examName?.toLowerCase().includes(search.toLowerCase()) ||
    ex.examCode?.toLowerCase().includes(search.toLowerCase()) ||
    ex.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Examination Timetable</h1>
          <p className="page-subtitle">Schedule, update, and manage individual examination sessions</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
              <UploadCloud size={18} /> Bulk Import
            </button>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={18} /> Add Examination
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search exam by name, code, subject..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredExams.length}</strong> exams
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading exam timetable..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : filteredExams.length === 0 ? (
        <EmptyState
          title="No Examinations Scheduled"
          message={search ? 'No exam matches your search.' : 'No examinations scheduled yet.'}
          actionText={isAdmin && !search ? 'Schedule First Exam' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Exam Code</th>
                <th>Exam Name</th>
                <th>Subject</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((ex) => (
                <tr key={ex.id}>
                  <td>
                    <span className="badge badge-info">{ex.examCode}</span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{ex.examName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <BookOpen size={14} /> {ex.subjectName || `Subject #${ex.subjectId}`}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '600' }}>
                        <Calendar size={13} style={{ marginRight: '0.25rem' }} />
                        {ex.examDate}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        <Clock size={12} style={{ marginRight: '0.25rem' }} />
                        {ex.startTime} - {ex.endTime}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{ex.duration || 180} mins</span>
                  </td>
                  <td>
                    <span className={`badge ${ex.status === 'SCHEDULED' ? 'badge-success' : 'badge-warning'}`}>
                      {ex.status || 'SCHEDULED'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(ex)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(ex.id)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Add / Edit Exam Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Examination' : 'Schedule New Examination'}
              </h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="examName">Exam Name</label>
                    <input
                      id="examName"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Java Programming Mid-1"
                      value={formData.examName}
                      onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="examCode">Exam Code</label>
                    <input
                      id="examCode"
                      type="text"
                      className="form-control"
                      placeholder="e.g. EX-CS301"
                      value={formData.examCode}
                      onChange={(e) => setFormData({ ...formData, examCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="seriesId">Examination Series</label>
                    <select
                      id="seriesId"
                      className="form-control form-select"
                      value={formData.seriesId}
                      onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                      required
                    >
                      <option value="">Select Series</option>
                      {seriesList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.seriesName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subjectId">Subject</label>
                    <select
                      id="subjectId"
                      className="form-control form-select"
                      value={formData.subjectId}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.subjectName} ({sub.subjectCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="examDate">Exam Date</label>
                    <input
                      id="examDate"
                      type="date"
                      className="form-control"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="startTime">Start Time</label>
                    <input
                      id="startTime"
                      type="time"
                      className="form-control"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="endTime">End Time</label>
                    <input
                      id="endTime"
                      type="time"
                      className="form-control"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Exam' : 'Schedule Exam'}
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
        title="Bulk Examination Import"
        entityName="Exams"
        requiredColumns={['examName', 'examCode', 'seriesId', 'subjectId', 'examDate', 'startTime', 'endTime']}
        sampleCsv={`examName,examCode,seriesId,subjectId,examDate,startTime,endTime\nJava Programming Mid-1,EX-CS301,1,1,2026-09-15,10:00,13:00\nDatabase Management Systems Mid-1,EX-CS302,1,1,2026-09-16,10:00,13:00`}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default ExamListPage;
