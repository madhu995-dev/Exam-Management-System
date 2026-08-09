import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import {
  Building2,
  Users,
  UserCheck,
  Box,
  DoorOpen,
  BookOpen,
  Calendar,
  FileCheck,
  Grid,
  Ticket,
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getAdminDashboard();
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Admin ERP Dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin ERP Dashboard</h1>
          <p className="page-subtitle">Overview of campus infrastructure, examinations, and student metrics</p>
        </div>
      </div>

      {/* Primary Infrastructure Stats */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Campus Infrastructure & Directory
      </h2>
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Total Departments" value={data?.totalDepartments} icon={Building2} color="#6366f1" />
        <StatCard title="Total Students" value={data?.totalStudents} icon={UserCheck} color="#10b981" />
        <StatCard title="Total Faculty" value={data?.totalFaculty} icon={Users} color="#0284c7" />
        <StatCard title="Total Subjects" value={data?.totalSubjects} icon={BookOpen} color="#8b5cf6" />
      </div>

      {/* Building & Room Infrastructure */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Blocks & Seating Capacity
      </h2>
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Total Blocks" value={data?.totalBlocks} icon={Box} color="#06b6d4" />
        <StatCard title="Total Rooms" value={data?.totalRooms} icon={DoorOpen} color="#f59e0b" />
        <StatCard title="Total Exam Series" value={data?.totalExamSeries} icon={Calendar} color="#ec4899" />
        <StatCard title="Total Exams Scheduled" value={data?.totalExams} icon={FileCheck} color="#3b82f6" />
      </div>

      {/* Examination Operations & Results */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Exam Operations & Results Analytics
      </h2>
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Seat Allocations" value={data?.totalSeatAllocations} icon={Grid} color="#8b5cf6" />
        <StatCard title="Hall Tickets Issued" value={data?.totalHallTickets} icon={Ticket} color="#10b981" />
        <StatCard title="Results Published" value={data?.totalResults} icon={Award} color="#f59e0b" />
        <StatCard title="Pass Rate" value={`${data?.passPercentage || 0}%`} icon={TrendingUp} color="#10b981" subtitle={`Fail Rate: ${data?.failPercentage || 0}%`} />
      </div>

      {/* Attendance & Performance Summary Cards */}
      <div className="grid grid-cols-2">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" /> Attendance Summary
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{data?.presentStudents || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Present Students</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f43f5e' }}>{data?.absentStudents || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Absent Students</div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#f59e0b" /> Result Distribution
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{data?.passStudents || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Passed</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f43f5e' }}>{data?.failStudents || 0}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Failed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
