import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { UserPlus, User, Mail, Lock, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import '../../styles/auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    setLoading(true);
    try {
      // Calls POST /api/users/register with User entity JSON
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        enabled: true,
      };

      await authApi.register(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const serverMsg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || err.message || 'Failed to register account. Username or email may already exist.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <UserPlus size={30} />
          </div>
          <h2 className="auth-title">Create User Account</h2>
          <p className="auth-subtitle">Register a new system user with role access privileges</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <div style={{ color: 'var(--accent-emerald)', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle2 size={56} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>
              Registration Successful!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              User account <strong>{formData.username}</strong> ({formData.role}) has been created successfully.
            </p>
            <div className="alert alert-success" style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              Redirecting to Login page in 3 seconds...
            </div>
            <button onClick={() => navigate('/login')} className="btn btn-primary auth-button">
              Go to Login Now <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="form-label" htmlFor="username">Username</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Choose username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter valid email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="auth-field">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label className="form-label" htmlFor="role">User Role Privilege</label>
              <div className="auth-input-wrapper">
                <Shield size={18} className="auth-input-icon" />
                <select
                  id="role"
                  name="role"
                  className="form-control form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="FACULTY">FACULTY</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={loading}
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus size={18} /> Register User
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
