import React from 'react';

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
const PremiumCard = ({ title, children, className = '', footer }) => {
  return (
    <div className={`glass-card flex flex-col ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white/90">{title}</h3>
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {footer}
        </div>
      )}
    </div>
  );
};

export default PremiumCard;
