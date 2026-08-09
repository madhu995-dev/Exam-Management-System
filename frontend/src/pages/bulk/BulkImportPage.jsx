import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi';
import { facultyApi } from '../../api/facultyApi';
import { examApi } from '../../api/examApi';
import { resultApi } from '../../api/resultApi';
import { departmentApi } from '../../api/departmentApi';
import { seriesApi } from '../../api/seriesApi';
import { subjectApi } from '../../api/subjectApi';
import BulkUploadModal from '../../components/common/BulkUploadModal';
import { UploadCloud, Users, UserCheck, FileCheck, Award } from 'lucide-react';

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
  return 'Database validation error';
};

const BulkImportPage = () => {
  const [activeModal, setActiveModal] = useState(null); // 'STUDENTS' | 'FACULTY' | 'EXAMS' | 'RESULTS'
  const [departments, setDepartments] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [dData, sData, subData, stuData, exData] = await Promise.all([
          departmentApi.getAllDepartments().catch(() => []),
          seriesApi.getAllSeries().catch(() => []),
          subjectApi.getAllSubjects().catch(() => []),
          studentApi.getAllStudents().catch(() => []),
          examApi.getAllExams().catch(() => []),
        ]);
        setDepartments(dData || []);
        setSeriesList(sData || []);
        setSubjects(subData || []);
        setStudents(stuData || []);
        setExams(exData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdowns();
  }, []);

  // Helper to find valid Department ID dynamically
  const resolveDepartmentId = (rawDept) => {
    if (departments.length === 0) return null;
    if (!rawDept) return Number(departments[0].id);

    const match = departments.find(
      (d) =>
        String(d.id) === String(rawDept) ||
        d.departmentCode?.toLowerCase() === String(rawDept).toLowerCase() ||
        d.departmentName?.toLowerCase() === String(rawDept).toLowerCase()
    );
    return match ? Number(match.id) : Number(departments[0].id);
  };

  // Helper to find valid Series ID dynamically
  const resolveSeriesId = (rawSeries) => {
    if (seriesList.length === 0) return null;
    if (!rawSeries) return Number(seriesList[0].id);

    const match = seriesList.find(
      (s) =>
        String(s.id) === String(rawSeries) ||
        s.seriesName?.toLowerCase() === String(rawSeries).toLowerCase() ||
        s.seriesCode?.toLowerCase() === String(rawSeries).toLowerCase()
    );
    return match ? Number(match.id) : Number(seriesList[0].id);
  };

  // Helper to find valid Subject ID dynamically
  const resolveSubjectId = (rawSub) => {
    if (subjects.length === 0) return null;
    if (!rawSub) return Number(subjects[0].id);

    const match = subjects.find(
      (sub) =>
        String(sub.id) === String(rawSub) ||
        sub.subjectCode?.toLowerCase() === String(rawSub).toLowerCase() ||
        sub.subjectName?.toLowerCase() === String(rawSub).toLowerCase()
    );
    return match ? Number(match.id) : Number(subjects[0].id);
  };

  // Helper to find valid Exam ID dynamically
  const resolveExamId = (rawExam) => {
    if (exams.length === 0) return null;
    if (!rawExam) return Number(exams[0].id);

    const match = exams.find(
      (ex) =>
        String(ex.id) === String(rawExam) ||
        ex.examCode?.toLowerCase() === String(rawExam).toLowerCase() ||
        ex.examName?.toLowerCase() === String(rawExam).toLowerCase()
    );
    return match ? Number(match.id) : Number(exams[0].id);
  };

  // Helper to find valid Student ID dynamically
  const resolveStudentId = (rawStu) => {
    if (students.length === 0) return null;
    if (!rawStu) return Number(students[0].id);

    const match = students.find(
      (s) =>
        String(s.id) === String(rawStu) ||
        s.hallTicketNumber?.toLowerCase() === String(rawStu).toLowerCase() ||
        s.rollNumber?.toLowerCase() === String(rawStu).toLowerCase() ||
        `${s.firstName} ${s.lastName}`.toLowerCase() === String(rawStu).toLowerCase()
    );
    return match ? Number(match.id) : Number(students[0].id);
  };

  // 1. Bulk Student Upload Handler
  const handleStudentUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const targetDeptId = resolveDepartmentId(rec.departmentId || rec.departmentCode);
        if (!targetDeptId) {
          throw new Error('No active department found in database. Please create a department first.');
        }

        const htNo = rec.hallTicketNumber || rec.rollNumber || `HT${Date.now()}_${i + 1}`;

        const payload = {
          firstName: rec.firstName || `Student${i + 1}`,
          lastName: rec.lastName || 'User',
          email: rec.email || `student_${Date.now()}_${i + 1}@college.edu`,
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

    return { successCount, total: records.length, failedRecords };
  };

  // 2. Bulk Faculty Upload Handler
  const handleFacultyUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const targetDeptId = resolveDepartmentId(rec.departmentId || rec.departmentCode);
        if (!targetDeptId) {
          throw new Error('No active department found in database. Please create a department first.');
        }

        const empId = rec.employeeId || `EMP${Date.now()}_${i + 1}`;

        const payload = {
          firstName: rec.firstName || `Faculty${i + 1}`,
          lastName: rec.lastName || 'User',
          email: rec.email || `faculty_${Date.now()}_${i + 1}@college.edu`,
          phone: rec.phone || rec.phoneNumber || '9876543210',
          phoneNumber: rec.phoneNumber || rec.phone || '9876543210',
          employeeId: empId,
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
          reason: extractErrorMessage(err),
        });
      }
      onProgress(i + 1);
    }

    return { successCount, total: records.length, failedRecords };
  };

  // 3. Bulk Exam Upload Handler
  const handleExamUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const targetSeriesId = resolveSeriesId(rec.seriesId || rec.seriesCode);
        const targetSubjectId = resolveSubjectId(rec.subjectId || rec.subjectCode);

        if (!targetSeriesId || !targetSubjectId) {
          throw new Error('Valid Exam Series and Subject required. Please ensure series and subjects exist.');
        }

        const payload = {
          examName: rec.examName || `Exam ${i + 1}`,
          examCode: rec.examCode || `EX${Date.now()}_${i + 1}`,
          seriesId: targetSeriesId,
          subjectId: targetSubjectId,
          examDate: rec.examDate || new Date().toISOString().split('T')[0],
          startTime: rec.startTime || '10:00',
          endTime: rec.endTime || '13:00',
          duration: Number(rec.duration) || 180,
          status: rec.status || 'SCHEDULED',
        };

        await examApi.createExam(payload);
        successCount++;
      } catch (err) {
        failedRecords.push({
          index: i,
          reason: extractErrorMessage(err),
        });
      }
      onProgress(i + 1);
    }

    return { successCount, total: records.length, failedRecords };
  };

  // 4. Bulk Result Upload Handler
  const handleResultUpload = async (records, onProgress) => {
    let successCount = 0;
    const failedRecords = [];

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      try {
        const targetExamId = resolveExamId(rec.examId || rec.examCode);
        const targetStudentId = resolveStudentId(rec.studentId || rec.hallTicketNumber || rec.rollNumber);

        if (!targetExamId || !targetStudentId) {
          throw new Error('Valid Exam and Student required. Please ensure exams and students exist in database.');
        }

        const payload = {
          examId: targetExamId,
          studentId: targetStudentId,
          internalMarks: Number(rec.internalMarks) || 0,
          externalMarks: Number(rec.externalMarks) || 0,
          practicalMarks: Number(rec.practicalMarks) || 0,
          remarks: rec.remarks || '',
        };

        await resultApi.publishResult(payload);
        successCount++;
      } catch (err) {
        failedRecords.push({
          index: i,
          reason: extractErrorMessage(err),
        });
      }
      onProgress(i + 1);
    }

    return { successCount, total: records.length, failedRecords };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bulk Data Import Center</h1>
          <p className="page-subtitle">Batch create multiple students, faculty, exams, and results instantly via CSV imports</p>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Bulk Students Import */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Users size={24} style={{ color: 'var(--primary-500)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Bulk Student Enrollment</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Import batch student records with hall ticket numbers, departments, emails, and phone numbers.
          </p>
          <button onClick={() => setActiveModal('STUDENTS')} className="btn btn-primary">
            <UploadCloud size={16} /> Bulk Upload Students
          </button>
        </div>

        {/* Bulk Faculty Import */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <UserCheck size={24} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Bulk Faculty Registration</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Import faculty members with employee IDs, designations, qualifications, and department links.
          </p>
          <button onClick={() => setActiveModal('FACULTY')} className="btn btn-primary">
            <UploadCloud size={16} /> Bulk Upload Faculty
          </button>
        </div>

        {/* Bulk Exams Import */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <FileCheck size={24} style={{ color: 'var(--accent-purple)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Bulk Exam Scheduling</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Schedule multiple subject examinations with exam codes, dates, timings, and series links.
          </p>
          <button onClick={() => setActiveModal('EXAMS')} className="btn btn-primary">
            <UploadCloud size={16} /> Bulk Upload Exams
          </button>
        </div>

        {/* Bulk Results Import */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Award size={24} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Bulk Result Publishing</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Publish internal, external, and practical marks for multiple candidate students at once.
          </p>
          <button onClick={() => setActiveModal('RESULTS')} className="btn btn-primary">
            <UploadCloud size={16} /> Bulk Upload Results
          </button>
        </div>
      </div>

      {/* Bulk Upload Modals */}
      <BulkUploadModal
        isOpen={activeModal === 'STUDENTS'}
        onClose={() => setActiveModal(null)}
        title="Bulk Student Import"
        entityName="Students"
        requiredColumns={['firstName', 'lastName', 'email', 'phone', 'hallTicketNumber', 'departmentId']}
        sampleCsv={`firstName,lastName,email,phone,gender,dateOfBirth,hallTicketNumber,departmentId\nJohn,Doe,john.doe@college.edu,9876543210,MALE,2002-05-15,HT2026101,1\nJane,Smith,jane.smith@college.edu,9876543211,FEMALE,2003-08-20,HT2026102,1`}
        onUpload={handleStudentUpload}
      />

      <BulkUploadModal
        isOpen={activeModal === 'FACULTY'}
        onClose={() => setActiveModal(null)}
        title="Bulk Faculty Import"
        entityName="Faculty"
        requiredColumns={['firstName', 'lastName', 'email', 'employeeId', 'designation', 'departmentId']}
        sampleCsv={`firstName,lastName,email,phone,employeeId,designation,qualification,departmentId\nAlan,Turing,alan.turing@college.edu,9876543220,EMP202601,Professor,Ph.D in CS,1\nGrace,Hopper,grace.hopper@college.edu,9876543221,EMP202602,Associate Professor,M.Tech in CS,1`}
        onUpload={handleFacultyUpload}
      />

      <BulkUploadModal
        isOpen={activeModal === 'EXAMS'}
        onClose={() => setActiveModal(null)}
        title="Bulk Examination Import"
        entityName="Exams"
        requiredColumns={['examName', 'examCode', 'seriesId', 'subjectId', 'examDate', 'startTime', 'endTime']}
        sampleCsv={`examName,examCode,seriesId,subjectId,examDate,startTime,endTime,duration,status\nDBMS Mid-1,EX-CS201,1,1,2026-08-15,10:00,13:00,180,SCHEDULED\nData Structures Mid-1,EX-CS202,1,2,2026-08-16,10:00,13:00,180,SCHEDULED`}
        onUpload={handleExamUpload}
      />

      <BulkUploadModal
        isOpen={activeModal === 'RESULTS'}
        onClose={() => setActiveModal(null)}
        title="Bulk Result Publishing Import"
        entityName="Results"
        requiredColumns={['examId', 'studentId', 'internalMarks', 'externalMarks', 'practicalMarks']}
        sampleCsv={`examId,studentId,internalMarks,externalMarks,practicalMarks,remarks\n1,1,22,65,23,Excellent\n1,2,19,58,21,Good`}
        onUpload={handleResultUpload}
      />
    </div>
  );
};

export default BulkImportPage;
