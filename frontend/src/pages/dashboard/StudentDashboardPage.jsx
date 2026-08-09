import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Grid,
  Award,
  BookMarked,
  ArrowRight,
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Portal Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.username}! View your hall tickets, seat allocations, and examination results.</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Registered Subjects" value="Active" icon={BookMarked} color="#6366f1" />
        <StatCard title="Hall Ticket Status" value="Available" icon={Ticket} color="#10b981" />
        <StatCard title="Seat Allocation" value="Assigned" icon={Grid} color="#0284c7" />
        <StatCard title="Exam Results" value="Published" icon={Award} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-3">
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hall Ticket</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Download or view your official exam admit card and hall ticket.
          </p>
          <Link to="/hall-tickets" className="btn btn-primary btn-sm">
            View Hall Ticket <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Seat Allocation</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Check your designated block, room number, row, and seat.
          </p>
          <Link to="/seat-allocations" className="btn btn-secondary btn-sm">
            Check Seat <ArrowRight size={16} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Examination Results</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            View internal marks, external marks, grades, and pass/fail status.
          </p>
          <Link to="/results" className="btn btn-secondary btn-sm">
            View Results <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
