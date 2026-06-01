import React from 'react';

const ConfirmModal = ({ type, symbol, shares, price, onConfirm, onCancel }) => {
  const isBuy = type === 'buy';
  const estimatedTotal = price != null ? (shares * price).toFixed(2) : null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{isBuy ? 'Confirm Purchase' : 'Confirm Sale'}</h3>
        <div className="modal-detail-row">
          <span className="modal-label">Symbol</span>
          <span className="modal-value">{symbol}</span>
        </div>
        <div className="modal-detail-row">
          <span className="modal-label">Shares</span>
          <span className="modal-value">{shares}</span>
        </div>
        {price != null && (
          <>
            <div className="modal-detail-row">
              <span className="modal-label">Price</span>
              <span className="modal-value">${price.toFixed(2)}</span>
            </div>
            <div className="modal-detail-row modal-total">
              <span className="modal-label">{isBuy ? 'Est. Cost' : 'Est. Revenue'}</span>
              <span className={`modal-value ${isBuy ? 'cost' : 'revenue'}`}>${estimatedTotal}</span>
            </div>
          </>
        )}
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className={`modal-btn confirm ${isBuy ? 'buy' : 'sell'}`} onClick={onConfirm}>
            {isBuy ? 'Buy' : 'Sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
