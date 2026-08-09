import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Mail, Calendar, CheckCircle2, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, role } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Your personal account details and authorization role</p>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: '640px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '2rem',
              fontWeight: '800',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{user?.username || 'User'}</h2>
            <span className="badge badge-primary" style={{ marginTop: '0.35rem' }}>{role}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <User size={20} style={{ color: 'var(--primary-500)' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Username</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.username}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Shield size={20} style={{ color: 'var(--accent-purple)' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>System Role</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{role}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Account Status</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#34d399' }}>Active</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/change-password" className="btn btn-primary">
            <KeyRound size={16} /> Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
