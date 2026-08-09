import React, { useState, useEffect } from 'react';
import { facultyApi } from '../../api/facultyApi';
import { departmentApi } from '../../api/departmentApi';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { Plus, Edit2, Trash2, User, Mail, Phone, Building2, X, UploadCloud } from 'lucide-react';

const FacultyListPage = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    status: 'ACTIVE',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [facData, deptData] = await Promise.all([
        facultyApi.getAllFaculties(),
        departmentApi.getAllDepartments(),
      ]);
      setFaculties(facData || []);
      setDepartments(deptData || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load faculty list.');
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
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      departmentId: departments[0]?.id || '',
      status: 'ACTIVE',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (fac) => {
    setEditingId(fac.id);
    setFormData({
      employeeId: fac.employeeId || '',
      firstName: fac.firstName || '',
      lastName: fac.lastName || '',
      email: fac.email || '',
      phoneNumber: fac.phoneNumber || '',
      departmentId: fac.departmentId || '',
      status: fac.status || 'ACTIVE',
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

    if (!formData.employeeId || !formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.departmentId) {
      setFormError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        departmentId: Number(formData.departmentId),
      };

      if (editingId) {
        await facultyApi.updateFaculty(editingId, payload);
      } else {
        await facultyApi.createFaculty(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to save faculty record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    const defaultDeptId = departments.length > 0 ? Number(departments[0].id) : null;

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const rawDept = String(rec.departmentId || rec.departmentCode || '').trim();
        let targetDeptId = null;

        if (rawDept) {
          const match = departments.find(
            (d) =>
              String(d.id) === rawDept ||
              d.departmentCode?.toLowerCase() === rawDept.toLowerCase() ||
              d.departmentName?.toLowerCase() === rawDept.toLowerCase()
          );
          if (match) targetDeptId = Number(match.id);
        }

        if (!targetDeptId) {
          targetDeptId = defaultDeptId;
        }

        if (!targetDeptId) {
          throw new Error('No department found. Please create a department first.');
        }

        const payload = {
          firstName: rec.firstName,
          lastName: rec.lastName,
          email: rec.email,
          phone: rec.phone || rec.phoneNumber || '9876543210',
          phoneNumber: rec.phoneNumber || rec.phone || '9876543210',
          employeeId: rec.employeeId,
          designation: rec.designation || 'Assistant Professor',
          qualification: rec.qualification || 'M.Tech',
          joiningDate: rec.joiningDate || new Date().toISOString().split('T')[0],
          departmentId: targetDeptId,
        };

        await facultyApi.createFaculty(payload);
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
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await facultyApi.deleteFaculty(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data || 'Failed to delete faculty');
      }
    }
  };

  const filteredFaculties = faculties.filter((fac) =>
    `${fac.firstName} ${fac.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    fac.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
    fac.email?.toLowerCase().includes(search.toLowerCase()) ||
    fac.departmentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Directory</h1>
          <p className="page-subtitle">Manage faculty profiles, employee IDs, and assigned departments</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
            <UploadCloud size={18} /> Bulk Import
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={18} /> Add Faculty
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, ID, email..." />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Total: <strong>{filteredFaculties.length}</strong> faculties
        </span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading faculty members..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : filteredFaculties.length === 0 ? (
        <EmptyState
          title="No Faculty Members Found"
          message={search ? 'No faculty matches your search.' : 'No faculty records exist.'}
          actionText={!search ? 'Add First Faculty' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculties.map((fac) => (
                <tr key={fac.id}>
                  <td style={{ fontWeight: '600' }}>#{fac.employeeId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                      <User size={16} style={{ color: 'var(--primary-500)' }} />
                      {fac.firstName} {fac.lastName}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {fac.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Phone size={14} /> {fac.phoneNumber}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={14} style={{ color: 'var(--accent-blue)' }} />
                      {fac.departmentName || `Dept #${fac.departmentId}`}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${fac.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {fac.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEditModal(fac)} className="btn btn-secondary btn-sm" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(fac.id)} className="btn btn-danger btn-sm" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Faculty Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Faculty Member' : 'Add New Faculty Member'}
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
                    <label className="form-label" htmlFor="employeeId">Employee ID</label>
                    <input
                      id="employeeId"
                      type="text"
                      className="form-control"
                      placeholder="e.g. EMP1001"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      required
                    />
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

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="faculty@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="text"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="status">Faculty Status</label>
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
                  {submitting ? 'Saving...' : editingId ? 'Update Faculty' : 'Add Faculty'}
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
        title="Bulk Faculty Import"
        entityName="Faculty"
        requiredColumns={['firstName', 'lastName', 'email', 'employeeId', 'departmentId']}
        sampleCsv={`firstName,lastName,email,phone,employeeId,designation,qualification,departmentId\nAlan,Turing,alan.turing@college.edu,9876543220,EMP202601,Professor,Ph.D in CS,1\nGrace,Hopper,grace.hopper@college.edu,9876543221,EMP202602,Associate Professor,M.Tech in CS,1`}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default FacultyListPage;
