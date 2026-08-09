import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi';
import { departmentApi } from '../../api/departmentApi';
import { useAuth } from '../../context/AuthContext';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { Plus, Edit2, Trash2, UserCheck, Mail, Phone, Ticket, Building2, ArrowUpDown, X, UploadCloud } from 'lucide-react';

const extractErrorMessage = (err) => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (typeof err.response?.data === 'string') return err.response.data;
  if (err.response?.data?.errors && typeof err.response.data.errors === 'object') {
    return Object.entries(err.response.data.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join('; ');
  }
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data?.error) return err.response.data.error;
  if (err.message) return err.message;
  return 'Database validation or record constraint error';
};

const StudentListPage = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Pagination & Sorting State
  const [usePagination, setUsePagination] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    dateOfBirth: '2002-01-01',
    hallTicketNumber: '',
    departmentId: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptData] = await Promise.all([departmentApi.getAllDepartments()]);
      const depts = deptData || [];
      setDepartments(depts);

      if (usePagination) {
        const pageData = await studentApi.getStudentsByPage(currentPage, 10);
        setStudents(pageData?.content || []);
        setTotalPages(pageData?.totalPages || 1);
      } else {
        const allData = await studentApi.getAllStudents();
        setStudents(allData || []);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, usePagination]);

  const handleSort = async (field) => {
    const newDir = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDir);
    setLoading(true);
    try {
      const sortedData = await studentApi.getStudentsSorted(field, newDir);
      setStudents(sortedData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'MALE',
      dateOfBirth: '2002-01-01',
      hallTicketNumber: '',
      departmentId: departments[0]?.id ? String(departments[0].id) : '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (stu) => {
    setEditingId(stu.id);
    setFormData({
      firstName: stu.firstName || '',
      lastName: stu.lastName || '',
      email: stu.email || '',
      phone: stu.phone || stu.phoneNumber || '',
      gender: stu.gender || 'MALE',
      dateOfBirth: stu.dateOfBirth || '2002-01-01',
      hallTicketNumber: stu.hallTicketNumber || stu.rollNumber || '',
      departmentId: stu.departmentId ? String(stu.departmentId) : (departments[0]?.id ? String(departments[0].id) : ''),
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

    const targetDeptId = Number(formData.departmentId || (departments[0]?.id || 1));

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.hallTicketNumber || !targetDeptId) {
      setFormError('Please fill in all required fields (Hall Ticket, Name, Email)');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || '9876543210',
        phoneNumber: formData.phone || '9876543210',
        gender: formData.gender || 'MALE',
        dateOfBirth: formData.dateOfBirth || '2002-01-01',
        hallTicketNumber: formData.hallTicketNumber,
        rollNumber: formData.hallTicketNumber,
        semester: 1,
        section: 'A',
        admissionDate: new Date().toISOString().split('T')[0],
        departmentId: targetDeptId,
      };

      if (editingId) {
        await studentApi.updateStudent(editingId, payload);
      } else {
        await studentApi.addStudent(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setFormError(extractErrorMessage(err));
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
          throw new Error('No active department found in database. Please create a department first.');
        }

        const htNo = rec.hallTicketNumber || rec.rollNumber || `HT${Date.now()}_${i + 1}`;
        const emailAddr = rec.email || `student_${Date.now()}_${i + 1}@college.edu`;

        const payload = {
          firstName: rec.firstName || `Student${i + 1}`,
          lastName: rec.lastName || 'User',
          email: emailAddr,
          phone: rec.phone || rec.phoneNumber || '9876543210',
          phoneNumber: rec.phoneNumber || rec.phone || '9876543210',
          gender: rec.gender || 'MALE',
          dateOfBirth: rec.dateOfBirth || '2002-01-01',
          hallTicketNumber: htNo,
          rollNumber: htNo,
          semester: Number(rec.semester) || 1,
          section: rec.section || 'A',
          admissionDate: rec.admissionDate || new Date().toISOString().split('T')[0],
          departmentId: targetDeptId,
        };

        await studentApi.addStudent(payload);
        successCount++;
      } catch (err) {
        failedRecords.push({
          index: i,
          reason: extractErrorMessage(err),
        });
      }
      onProgress(i + 1);
    }

    fetchData();
    return { successCount, total: records.length, failedRecords };
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentApi.deleteStudent(id);
        fetchData();
      } catch (err) {
        alert(extractErrorMessage(err));
      }
    }
  };

  const getDeptName = (deptId) => {
    const d = departments.find((dept) => dept.id === deptId);
    return d ? `${d.departmentName} (${d.departmentCode})` : `Dept #${deptId}`;
  };

  const filteredStudents = students.filter((stu) =>
    `${stu.firstName} ${stu.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    stu.hallTicketNumber?.toLowerCase().includes(search.toLowerCase()) ||
    stu.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    stu.email?.toLowerCase().includes(search.toLowerCase()) ||
    stu.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage registered students, hall ticket numbers, and academic departments</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowBulkModal(true)} className="btn btn-secondary">
              <UploadCloud size={18} /> Bulk Import
            </button>
            <button onClick={handleOpenAddModal} className="btn btn-primary">
              <Plus size={18} /> Register Student
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, hall ticket, email..." />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setUsePagination(!usePagination)}
            className="btn btn-secondary btn-sm"
          >
            {usePagination ? 'Show All Students' : 'Enable Pagination'}
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Total: <strong>{filteredStudents.length}</strong> students
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading students..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          title="No Students Found"
          message={search ? 'No student records match your search.' : 'No students registered yet.'}
          actionText={isAdmin && !search ? 'Register First Student' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('hallTicketNumber')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Hall Ticket <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('firstName')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Student Name <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender / DOB</th>
                  <th>Department</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((stu) => (
                  <tr key={stu.id}>
                    <td>
                      <span className="badge badge-primary">
                        <Ticket size={12} style={{ marginRight: '0.25rem' }} />
                        {stu.hallTicketNumber || stu.rollNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
                        {stu.firstName} {stu.lastName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <Mail size={14} /> {stu.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <Phone size={14} /> {stu.phone || stu.phoneNumber}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {stu.gender} {stu.dateOfBirth && `(${stu.dateOfBirth})`}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={14} style={{ color: 'var(--accent-blue)' }} />
                        {getDeptName(stu.departmentId)}
                      </div>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => handleOpenEditModal(stu)} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(stu.id)} className="btn btn-danger btn-sm" title="Delete">
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

          {usePagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Single Add/Edit Student Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingId ? 'Edit Student Details' : 'Register New Student'}
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
                    <label className="form-label" htmlFor="hallTicketNumber">Hall Ticket Number / Roll No</label>
                    <input
                      id="hallTicketNumber"
                      type="text"
                      className="form-control"
                      placeholder="e.g. HT2026001"
                      value={formData.hallTicketNumber}
                      onChange={(e) => setFormData({ ...formData, hallTicketNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="departmentId">Department</label>
                    <select
                      id="departmentId"
                      className="form-control form-select"
                      value={formData.departmentId || (departments[0]?.id ? String(departments[0].id) : '')}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      required
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={String(d.id)}>
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
                      placeholder="student@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="text"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      className="form-control form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
                  {submitting ? 'Saving...' : editingId ? 'Update Student' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk Student Import"
        entityName="Students"
        requiredColumns={['firstName', 'lastName', 'email', 'phone', 'hallTicketNumber', 'departmentId']}
        sampleCsv={`firstName,lastName,email,phone,gender,dateOfBirth,hallTicketNumber,departmentId\nJohn,Doe,john.doe@college.edu,9876543210,MALE,2002-05-15,HT2026101,1\nJane,Smith,jane.smith@college.edu,9876543211,FEMALE,2003-08-20,HT2026102,1`}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};

export default StudentListPage;
