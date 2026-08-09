import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit2, Trash2, Building2, X } from 'lucide-react';

const DepartmentListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentApi.getAllDepartments();
      setDepartments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ departmentName: '', departmentCode: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (dept) => {
    setEditingId(dept.id);
    setFormData({
      departmentName: dept.departmentName || '',
      departmentCode: dept.departmentCode || '',
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

    if (!formData.departmentName || !formData.departmentCode) {
      setFormError('Please enter both Department Name and Code');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await departmentApi.updateDepartmentById(editingId, formData);
      } else {
        await departmentApi.addDepartment(formData);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentApi.deleteDepartmentById(id);
        fetchDepartments();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete department');
      }
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName?.toLowerCase().includes(search.toLowerCase()) ||
    dept.departmentCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">Manage academic departments and codes</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Add Department
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or code..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredDepartments.length}</strong> departments
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading departments..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchDepartments} />
      ) : filteredDepartments.length === 0 ? (
        <EmptyState
          title="No Departments Found"
          message={search ? 'No departments match your search criteria.' : 'No departments have been added yet.'}
          actionText={isAdmin && !search ? 'Add First Department' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Department Name</th>
                <th>Department Code</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept, index) => (
                <tr key={dept.id}>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>#{index + 1}</td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} style={{ color: 'var(--primary-500)' }} />
                      {dept.departmentName}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{dept.departmentCode}</span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(dept)}
                          className="btn btn-secondary btn-sm"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                        >
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="departmentName">Department Name</label>
                  <input
                    id="departmentName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Computer Science and Engineering"
                    value={formData.departmentName}
                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="departmentCode">Department Code</label>
                  <input
                    id="departmentCode"
                    type="text"
                    className="form-control"
                    placeholder="e.g. CSE"
                    value={formData.departmentCode}
                    onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Department' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentListPage;
