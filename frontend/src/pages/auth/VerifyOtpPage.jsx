import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { ShieldCheck, User, Lock, ArrowLeft } from 'lucide-react';
import '../../styles/auth.css';

const VerifyOtpPage = () => {
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !otp) {
      setError('Please enter username and OTP');
      return;
    }

    setLoading(true);
    try {
      // Calls POST /api/users/verify-otp with VerifyOtpRequestDto { username, otp }
      const message = await authApi.verifyOtp({ username, otp });
      setSuccess(message || 'OTP verified successfully!');
      setTimeout(() => {
        navigate('/reset-password', { state: { username, otp } });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={30} />
          </div>
          <h2 className="auth-title">Verify OTP</h2>
          <p className="auth-subtitle">Enter the verification code sent to your email</p>
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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="form-label" htmlFor="otp">OTP Code</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="otp"
                type="text"
                className="form-control"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
              <span>Verifying...</span>
            ) : (
              <>
                <ShieldCheck size={18} /> Verify OTP
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
