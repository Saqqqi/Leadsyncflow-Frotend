import React from 'react';

export default function SharedLoader() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, var(--color-primary), var(--bg-secondary), var(--accent-secondary))' }}>
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4" style={{ borderColor: 'var(--border-primary)', borderTopColor: 'var(--accent-primary)' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
