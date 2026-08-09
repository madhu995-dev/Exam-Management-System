import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary-500)', subtitle }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          background: `rgba(${color}, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.2rem 0' }}>
          {value !== undefined && value !== null ? value : 0}
        </div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
