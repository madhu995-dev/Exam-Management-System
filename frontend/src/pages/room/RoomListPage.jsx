import React, { useState, useEffect } from 'react';
import { roomApi } from '../../api/roomApi';
import { blockApi } from '../../api/blockApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { Plus, Edit2, Trash2, DoorOpen, Box, Grid, X, UploadCloud } from 'lucide-react';

const RoomListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [rooms, setRooms] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    capacity: 30,
    rows: 5,
    columns: 6,
    status: 'AVAILABLE',
    blockId: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomData, blkData] = await Promise.all([
        roomApi.getAllRooms(),
        blockApi.getAllBlocks(),
      ]);
      setRooms(roomData || []);
      setBlocks(blkData || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load rooms list');
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
      roomNumber: '',
      capacity: 30,
      rows: 5,
      columns: 6,
      status: 'AVAILABLE',
      blockId: blocks[0]?.id || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (rm) => {
    setEditingId(rm.id);
    setFormData({
      roomNumber: rm.roomNumber || '',
      capacity: rm.capacity || 30,
      rows: rm.rows || 5,
      columns: rm.columns || 6,
      status: rm.status || 'AVAILABLE',
      blockId: rm.blockId || '',
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

    if (!formData.roomNumber || !formData.capacity || !formData.rows || !formData.columns || !formData.blockId) {
      setFormError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        rows: Number(formData.rows),
        columns: Number(formData.columns),
        blockId: Number(formData.blockId),
      };

      if (editingId) {
        await roomApi.updateRoom(editingId, payload);
      } else {
        await roomApi.createRoom(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];
    const defaultBlockId = blocks.length > 0 ? Number(blocks[0].id) : null;

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const rawBlk = String(rec.blockId || rec.blockCode || rec.blockName || '').trim();
        let targetBlockId = null;

        if (rawBlk) {
          const match = blocks.find(
            (b) =>
              String(b.id) === rawBlk ||
              b.blockCode?.toLowerCase() === rawBlk.toLowerCase() ||
              b.blockName?.toLowerCase() === rawBlk.toLowerCase()
          );
          if (match) targetBlockId = Number(match.id);
        }

        if (!targetBlockId) {
          targetBlockId = defaultBlockId;
        }

        if (!targetBlockId) {
          throw new Error('No active campus block found. Please create a building block first.');
        }

        const cap = Number(rec.capacity) || 30;
        const r = Number(rec.rows) || 5;
        const c = Number(rec.columns) || Math.ceil(cap / r) || 6;

        const payload = {
          roomNumber: rec.roomNumber || `Hall-${101 + i}`,
          capacity: cap,
          rows: r,
          columns: c,
          status: rec.status || 'AVAILABLE',
          blockId: targetBlockId,
        };

        await roomApi.createRoom(payload);
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
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomApi.deleteRoom(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete room');
      }
    }
  };

  const filteredRooms = rooms.filter((rm) =>
    rm.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
    rm.blockName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Exam Room Directory</h1>
          <p className="page-subtitle">Configure examination halls, capacities, and grid rows/columns</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
              <UploadCloud size={18} /> Bulk Import
            </button>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={18} /> Add Room
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by room number or block..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredRooms.length}</strong> rooms
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading exam halls..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : filteredRooms.length === 0 ? (
        <EmptyState
          title="No Exam Rooms Found"
          message={search ? 'No room matches your search.' : 'No examination rooms added yet.'}
          actionText={isAdmin && !search ? 'Add First Room' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Block Name</th>
                <th>Seating Capacity</th>
                <th>Grid Layout (R x C)</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((rm) => (
                <tr key={rm.id}>
                  <td style={{ fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DoorOpen size={16} style={{ color: 'var(--primary-500)' }} />
                      {rm.roomNumber}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Box size={14} style={{ color: 'var(--accent-blue)' }} />
                      {rm.blockName || `Block #${rm.blockId}`}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{rm.capacity} Seats</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Grid size={14} /> {rm.rows} Rows × {rm.columns} Cols
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${rm.status === 'AVAILABLE' ? 'badge-success' : 'badge-danger'}`}>
                      {rm.status || 'AVAILABLE'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleOpenEditModal(rm)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(rm.id)} className="btn btn-danger btn-sm" title="Delete">
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

      {/* Add / Edit Room Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Exam Room' : 'Add New Exam Room'}
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
                    <label className="form-label" htmlFor="roomNumber">Room Number / Name</label>
                    <input
                      id="roomNumber"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hall-101"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="blockId">Building Block</label>
                    <select
                      id="blockId"
                      className="form-control form-select"
                      value={formData.blockId}
                      onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                      required
                    >
                      <option value="">Select Block</option>
                      {blocks.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.blockName} ({b.blockCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="capacity">Capacity</label>
                    <input
                      id="capacity"
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rows">Rows</label>
                    <input
                      id="rows"
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.rows}
                      onChange={(e) => setFormData({ ...formData, rows: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="columns">Columns</label>
                    <input
                      id="columns"
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.columns}
                      onChange={(e) => setFormData({ ...formData, columns: e.target.value })}
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
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Room' : 'Add Room'}
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
        title="Bulk Exam Room Import"
        entityName="Rooms"
        requiredColumns={['roomNumber', 'capacity', 'rows', 'columns']}
        sampleCsv={`roomNumber,blockId,capacity,rows,columns,status\nHall-101,MN,30,5,6,AVAILABLE\nHall-102,DG,30,5,6,AVAILABLE`}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default RoomListPage;
