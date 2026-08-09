import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notificationApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, Trash2, Plus, X } from 'lucide-react';

const NotificationPage = () => {
  const { user, role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Send Notification Modal (Admin)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ANNOUNCEMENT',
    userId: 1,
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user notifications for current logged in user ID or ID 1
      const userId = user?.id || 1;
      const data = await notificationApi.getUserNotifications(userId);
      setNotifications(data || []);
    } catch (err) {
      // Fallback
      setNotifications([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const userId = user?.id || 1;
      await notificationApi.markAllAsRead(userId);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete notification?')) {
      try {
        await notificationApi.deleteNotification(id);
        fetchNotifications();
      } catch (err) {
        alert('Failed to delete notification');
      }
    }
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      message: '',
      type: 'ANNOUNCEMENT',
      userId: user?.id || 1,
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

    if (!formData.title || !formData.message) {
      setFormError('Please enter title and message');
      return;
    }

    setSubmitting(true);
    try {
      await notificationApi.createNotification({
        ...formData,
        userId: Number(formData.userId),
      });
      setShowModal(false);
      fetchNotifications();
    } catch (err) {
      setFormError(err.response?.data?.message || err.response?.data || 'Failed to send notification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications Center</h1>
          <p className="page-subtitle">Announcements, exam alerts, admit card updates, and system notifications</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleMarkAllRead} className="btn btn-secondary">
            <CheckCheck size={18} /> Mark All as Read
          </button>
          {isAdmin && (
            <button onClick={handleOpenModal} className="btn btn-primary">
              <Plus size={18} /> Send Notification
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading notifications..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchNotifications} />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          message="You are all caught up! There are no unread announcements or alerts."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '840px' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: n.isRead ? '4px solid var(--border-color)' : '4px solid var(--primary-500)',
                background: n.isRead ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.8)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-500)',
                    flexShrink: 0,
                  }}
                >
                  <Bell size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{n.title}</h3>
                    <span className="badge badge-info">{n.type || 'ANNOUNCEMENT'}</span>
                    {!n.isRead && <span className="badge badge-danger">NEW</span>}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {n.message}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {!n.isRead && (
                  <button onClick={() => handleMarkAsRead(n.id)} className="btn btn-secondary btn-sm" title="Mark Read">
                    <CheckCheck size={14} /> Read
                  </button>
                )}
                {isAdmin && (
                  <button onClick={() => handleDelete(n.id)} className="btn btn-danger btn-sm" title="Delete">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Notification Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Broadcast Notification</h3>
              <button onClick={handleCloseModal} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-danger">{formError}</div>}

                <div className="form-group">
                  <label className="form-label" htmlFor="title">Notification Title</label>
                  <input
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="e.g. End Semester Exam Seating Plan Released"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="type">Notification Type</label>
                  <select
                    id="type"
                    className="form-control form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="EXAM_SCHEDULE">EXAM SCHEDULE</option>
                    <option value="HALL_TICKET">HALL TICKET</option>
                    <option value="RESULT_PUBLISHED">RESULT PUBLISHED</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message Content</label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="3"
                    placeholder="Enter announcement message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="userId">Target User ID</label>
                  <input
                    id="userId"
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
