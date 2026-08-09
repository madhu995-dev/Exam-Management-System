import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { KeyRound, User, ArrowLeft, Send } from 'lucide-react';
import '../../styles/auth.css';

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username) {
      setError('Please enter your username');
      return;
    }

    setLoading(true);
    try {
      // Calls POST /api/users/forgot-password with ForgotPasswordRequestDto { username }
      const message = await authApi.forgotPassword({ username });
      setSuccess(message || 'OTP sent successfully to your registered email!');
      setTimeout(() => {
        navigate('/verify-otp', { state: { username } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to request OTP. Check username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <KeyRound size={30} />
          </div>
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">Enter your username to receive password reset OTP</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Enter registered username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-button"
            disabled={loading}
          >
            {loading ? (
              <span>Sending OTP...</span>
            ) : (
              <>
                <Send size={18} /> Send OTP
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
