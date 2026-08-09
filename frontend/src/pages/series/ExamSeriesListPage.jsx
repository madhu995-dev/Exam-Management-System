import React, { useState, useEffect } from 'react';
import { seriesApi } from '../../api/seriesApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit2, Trash2, Calendar, Clock, X } from 'lucide-react';

const ExamSeriesListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    seriesName: '',
    description: '',
    status: 'UPCOMING',
    startDate: '',
    endDate: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSeries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await seriesApi.getAllSeries();
      setSeriesList(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load examination series');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      seriesName: '',
      description: '',
      status: 'UPCOMING',
      startDate: '',
      endDate: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (ser) => {
    setEditingId(ser.id);
    setFormData({
      seriesName: ser.seriesName || '',
      description: ser.description || '',
      status: ser.status || 'UPCOMING',
      startDate: ser.startDate ? ser.startDate.substring(0, 16) : '',
      endDate: ser.endDate ? ser.endDate.substring(0, 16) : '',
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

    if (!formData.seriesName || !formData.startDate || !formData.endDate) {
      setFormError('Please fill in Series Name, Start Date, and End Date');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await seriesApi.updateSeries(editingId, formData);
      } else {
        await seriesApi.createSeries(formData);
      }
      setShowModal(false);
      fetchSeries();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save exam series');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this examination series?')) {
      try {
        await seriesApi.deleteSeries(id);
        fetchSeries();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete series');
      }
    }
  };

  const filteredSeries = seriesList.filter((ser) =>
    ser.seriesName?.toLowerCase().includes(search.toLowerCase()) ||
    ser.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Examination Series</h1>
          <p className="page-subtitle">Schedule mid-term, semester, or annual exam series timelines</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Create Series
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search series by name..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredSeries.length}</strong> series
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading exam series..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchSeries} />
      ) : filteredSeries.length === 0 ? (
        <EmptyState
          title="No Exam Series Found"
          message={search ? 'No series match your search.' : 'No examination series created yet.'}
          actionText={isAdmin && !search ? 'Create First Series' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Series Name</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSeries.map((ser) => (
                <tr key={ser.id}>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} style={{ color: 'var(--primary-500)' }} />
                      {ser.seriesName}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{ser.description || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} /> {ser.startDate ? new Date(ser.startDate).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} /> {ser.endDate ? new Date(ser.endDate).toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${ser.status === 'ONGOING' || ser.status === 'UPCOMING' ? 'badge-success' : ser.status === 'COMPLETED' ? 'badge-info' : 'badge-danger'}`}>
                      {ser.status || 'UPCOMING'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(ser)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(ser.id)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Add / Edit Series Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Exam Series' : 'Create Exam Series'}
              </h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="seriesName">Series Name</label>
                  <input
                    id="seriesName"
                    type="text"
                    className="form-control"
                    placeholder="e.g. End Semester Examinations Fall 2026"
                    value={formData.seriesName}
                    onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="2"
                    placeholder="Series description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="startDate">Start Date & Time</label>
                    <input
                      id="startDate"
                      type="datetime-local"
                      className="form-control"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="endDate">End Date & Time</label>
                    <input
                      id="endDate"
                      type="datetime-local"
                      className="form-control"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select
                    id="status"
                    className="form-control form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Series' : 'Create Series'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSeriesListPage;
