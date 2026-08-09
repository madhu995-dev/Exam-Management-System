import React, { useState, useEffect } from 'react';
import { subjectApi } from '../../api/subjectApi';
import { departmentApi } from '../../api/departmentApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit2, Trash2, BookOpen, Building2, X } from 'lucide-react';

const SubjectListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectCode: '',
    credits: 3,
    subjectType: 'THEORY',
    departmentId: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subData, deptData] = await Promise.all([
        subjectApi.getAllSubjects(),
        departmentApi.getAllDepartments(),
      ]);
      setSubjects(subData || []);
      setDepartments(deptData || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load subjects');
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
      subjectName: '',
      subjectCode: '',
      credits: 3,
      subjectType: 'THEORY',
      departmentId: departments[0]?.id || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingId(sub.id);
    setFormData({
      subjectName: sub.subjectName || '',
      subjectCode: sub.subjectCode || '',
      credits: sub.credits || 3,
      subjectType: sub.subjectType || 'THEORY',
      departmentId: sub.departmentId || '',
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

    if (!formData.subjectName || !formData.subjectCode || !formData.credits || !formData.departmentId) {
      setFormError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        credits: Number(formData.credits),
        departmentId: Number(formData.departmentId),
      };

      if (editingId) {
        await subjectApi.updateSubject(editingId, payload);
      } else {
        await subjectApi.createSubject(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectApi.deleteSubject(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete subject');
      }
    }
  };

  const filteredSubjects = subjects.filter((sub) =>
    sub.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
    sub.subjectCode?.toLowerCase().includes(search.toLowerCase()) ||
    sub.departmentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subject Catalog</h1>
          <p className="page-subtitle">Manage curriculum subjects, course codes, credits, and subject types</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Add Subject
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by subject name, code..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredSubjects.length}</strong> subjects
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading subjects catalog..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          title="No Subjects Found"
          message={search ? 'No subjects match your search.' : 'No subjects added yet.'}
          actionText={isAdmin && !search ? 'Add First Subject' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>Type</th>
                <th>Department</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <span className="badge badge-info">{sub.subjectCode}</span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={16} style={{ color: 'var(--primary-500)' }} />
                      {sub.subjectName}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{sub.credits} Credits</span>
                  </td>
                  <td>
                    <span className="badge badge-warning">{sub.subjectType}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={14} style={{ color: 'var(--accent-blue)' }} />
                      {sub.departmentName || `Dept #${sub.departmentId}`}
                    </div>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(sub)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(sub.id)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Add / Edit Subject Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="subjectName">Subject Name</label>
                  <input
                    id="subjectName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Data Structures and Algorithms"
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="subjectCode">Subject Code</label>
                    <input
                      id="subjectCode"
                      type="text"
                      className="form-control"
                      placeholder="e.g. CS201"
                      value={formData.subjectCode}
                      onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="credits">Credits</label>
                    <input
                      id="credits"
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="subjectType">Subject Type</label>
                    <select
                      id="subjectType"
                      className="form-control form-select"
                      value={formData.subjectType}
                      onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                    >
                      <option value="THEORY">THEORY</option>
                      <option value="PRACTICAL">PRACTICAL</option>
                      <option value="LAB">LAB</option>
                      <option value="ELECTIVE">ELECTIVE</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="departmentId">Department</label>
                    <select
                      id="departmentId"
                      className="form-control form-select"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.departmentName} ({d.departmentCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectListPage;
