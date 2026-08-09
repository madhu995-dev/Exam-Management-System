import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, KeyRound, Bell } from 'lucide-react';
import '../../styles/layout.css';

const Navbar = () => {
  const { user, role, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitial = () => {
    if (!user?.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          College ERP - Exam Portal
        </h3>
      </div>

      <div className="navbar-user">
        <Link to="/notifications" title="Notifications" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '0.5rem' }}>
          <Bell size={20} />
        </Link>

        <div className="user-avatar">{getInitial()}</div>

        <div className="user-info">
          <span className="user-name">{user?.username || 'User'}</span>
          <span className="user-role-badge">{role}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
          <Link to="/change-password" className="btn btn-secondary btn-sm" title="Change Password">
            <KeyRound size={16} />
          </Link>

          <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Logout">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
