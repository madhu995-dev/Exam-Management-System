import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckSquare,
  FileCheck,
  UserCheck,
  ArrowRight,
} from 'lucide-react';

const FacultyDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Portal Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.username}! Manage invigilations, attendance, and student evaluations.</p>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <StatCard title="My Invigilation Duties" value="Active" icon={ClipboardList} color="#6366f1" subtitle="Assigned Exam Halls" />
        <StatCard title="Exam Attendance" value="Ready" icon={CheckSquare} color="#10b981" subtitle="Mark Present / Absent" />
        <StatCard title="Student Evaluation" value="Open" icon={FileCheck} color="#f59e0b" subtitle="Submit Internal & External Marks" />
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Invigilation & Duty Roster</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Check your assigned exam rooms, timing, and invigilation duties.
          </p>
          <Link to="/invigilator-assignments" className="btn btn-primary btn-sm">
            View Invigilations <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Attendance Management</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Record and verify student attendance during examination sessions.
          </p>
          <Link to="/attendance" className="btn btn-secondary btn-sm">
            Manage Attendance <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;
