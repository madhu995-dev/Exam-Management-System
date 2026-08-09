import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No Data Available', message = 'There are no records to display at this time.', actionText, onAction }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-color-strong)',
        margin: '1rem 0',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-500)',
          marginBottom: '1rem',
        }}
      >
        <Inbox size={30} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '1.25rem' }}>
        {message}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
