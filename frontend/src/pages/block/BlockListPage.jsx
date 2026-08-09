import React, { useState, useEffect } from 'react';
import { blockApi } from '../../api/blockApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Edit2, Trash2, Box, X } from 'lucide-react';

const BlockListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    blockName: '',
    blockCode: '',
    description: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blockApi.getAllBlocks();
      setBlocks(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load building blocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ blockName: '', blockCode: '', description: '', status: 'ACTIVE' });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (blk) => {
    setEditingId(blk.id);
    setFormData({
      blockName: blk.blockName || '',
      blockCode: blk.blockCode || '',
      description: blk.description || '',
      status: blk.status || 'ACTIVE',
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

    if (!formData.blockName || !formData.blockCode) {
      setFormError('Please fill in Block Name and Block Code');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await blockApi.updateBlock(editingId, formData);
      } else {
        await blockApi.createBlock(formData);
      }
      setShowModal(false);
      fetchBlocks();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save block');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        await blockApi.deleteBlock(id);
        fetchBlocks();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete block');
      }
    }
  };

  const filteredBlocks = blocks.filter((blk) =>
    blk.blockName?.toLowerCase().includes(search.toLowerCase()) ||
    blk.blockCode?.toLowerCase().includes(search.toLowerCase()) ||
    blk.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campus Block Management</h1>
          <p className="page-subtitle">Manage campus building blocks for exam hall allocation</p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Add Block
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search block by name or code..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredBlocks.length}</strong> blocks
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading campus blocks..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchBlocks} />
      ) : filteredBlocks.length === 0 ? (
        <EmptyState
          title="No Campus Blocks Found"
          message={search ? 'No blocks match your search.' : 'No building blocks created yet.'}
          actionText={isAdmin && !search ? 'Add First Block' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Block Code</th>
                <th>Block Name</th>
                <th>Description</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((blk) => (
                <tr key={blk.id}>
                  <td>
                    <span className="badge badge-info">{blk.blockCode}</span>
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Box size={16} style={{ color: 'var(--primary-500)' }} />
                      {blk.blockName}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{blk.description || 'N/A'}</td>
                  <td>
                    <span className={`badge ${blk.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {blk.status || 'ACTIVE'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(blk)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(blk.id)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Add / Edit Block Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Block' : 'Add New Block'}
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
                    <label className="form-label" htmlFor="blockName">Block Name</label>
                    <input
                      id="blockName"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Science & Tech Block"
                      value={formData.blockName}
                      onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="blockCode">Block Code</label>
                    <input
                      id="blockCode"
                      type="text"
                      className="form-control"
                      placeholder="e.g. BLK-A"
                      value={formData.blockCode}
                      onChange={(e) => setFormData({ ...formData, blockCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="3"
                    placeholder="Block description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">Status</label>
                  <select
                    id="status"
                    className="form-control form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Block' : 'Add Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockListPage;
