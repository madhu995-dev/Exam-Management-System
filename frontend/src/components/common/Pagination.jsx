import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, pageSize }) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Showing page <strong style={{ color: 'var(--text-primary)' }}>{currentPage + 1}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
        {totalItems && ` (${totalItems} total items)`}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
