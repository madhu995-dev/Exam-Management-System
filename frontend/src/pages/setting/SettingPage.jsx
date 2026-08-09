import React, { useState, useEffect } from 'react';
import { settingApi } from '../../api/settingApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit2, Trash2, Key, X } from 'lucide-react';

const SettingPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    settingKey: '',
    settingValue: '',
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingApi.getAllSettings();
      setSettings(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ settingKey: '', settingValue: '', description: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (stg) => {
    setEditingId(stg.id);
    setFormData({
      settingKey: stg.settingKey || '',
      settingValue: stg.settingValue || '',
      description: stg.description || '',
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

    if (!formData.settingKey || !formData.settingValue) {
      setFormError('Please enter Setting Key and Value');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await settingApi.updateSetting(editingId, formData);
      } else {
        await settingApi.createSetting(formData);
      }
      setShowModal(false);
      fetchSettings();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save setting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this setting?')) {
      try {
        await settingApi.deleteSetting(id);
        fetchSettings();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete setting');
      }
    }
  };

  const filteredSettings = settings.filter((stg) =>
    stg.settingKey?.toLowerCase().includes(search.toLowerCase()) ||
    stg.settingValue?.toLowerCase().includes(search.toLowerCase()) ||
    stg.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Configurations</h1>
          <p className="page-subtitle">Configure global ERP environment properties and system parameters</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Add Property
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search settings key or description..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredSettings.length}</strong> properties
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading configurations..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchSettings} />
      ) : filteredSettings.length === 0 ? (
        <EmptyState
          title="No Configurations Found"
          message={search ? 'No configuration property matches your search.' : 'No system settings created yet.'}
          actionText={isAdmin && !search ? 'Add First Property' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Setting Key</th>
                <th>Setting Value</th>
                <th>Description</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredSettings.map((stg) => (
                <tr key={stg.id}>
                  <td style={{ fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Key size={16} style={{ color: 'var(--primary-500)' }} />
                      <code>{stg.settingKey}</code>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {stg.settingValue}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{stg.description || 'N/A'}</td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(stg)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(stg.id)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Add / Edit Setting Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Configuration' : 'Add New Configuration'}
              </h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="settingKey">Setting Key</label>
                  <input
                    id="settingKey"
                    type="text"
                    className="form-control"
                    placeholder="e.g. ACADEMIC_YEAR"
                    value={formData.settingKey}
                    onChange={(e) => setFormData({ ...formData, settingKey: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="settingValue">Setting Value</label>
                  <input
                    id="settingValue"
                    type="text"
                    className="form-control"
                    placeholder="e.g. 2026-2027"
                    value={formData.settingValue}
                    onChange={(e) => setFormData({ ...formData, settingValue: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="2"
                    placeholder="Property description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Property' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
