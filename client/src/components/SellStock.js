import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL, { getAuthHeader } from '../config';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import ConfirmModal from './ConfirmModal';
import '../App.css';

const SellStock = ({ userId, onSellComplete }) => {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewPrice, setPreviewPrice] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const showToast = useToast();

  const debouncedSymbol = useDebounce(symbol.trim().toUpperCase(), 600);

  useEffect(() => {
    if (!debouncedSymbol) { setPreviewPrice(null); return; }
    setIsPreviewing(true);
    axios.get(`${API_URL}/api/stocks/price/${debouncedSymbol}`, { headers: getAuthHeader() })
      .then(res => setPreviewPrice(res.data.price))
      .catch(() => setPreviewPrice(null))
      .finally(() => setIsPreviewing(false));
  }, [debouncedSymbol]);

  const validate = () => {
    if (!symbol.trim()) { setError('Please enter a stock symbol'); return false; }
    const n = Number(shares);
    if (!shares || !Number.isInteger(n) || n <= 0) { setError('Please enter a valid whole number of shares'); return false; }
    return true;
  };

  const handleSubmit = () => {
    setError('');
    if (!validate()) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    setError('');
    const shareCount = Number(shares);
    try {
      await axios.post(
        `${API_URL}/api/transactions/sell`,
        { userId, symbol: symbol.toUpperCase(), shares: shareCount },
        { headers: getAuthHeader() }
      );
      showToast(`Sold ${shareCount} share${shareCount > 1 ? 's' : ''} of ${symbol.toUpperCase()}`, 'success');
      setSymbol('');
      setShares('');
      setPreviewPrice(null);
      if (onSellComplete) onSellComplete();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sell stock. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const shareCount = Number(shares);
  const estimatedRevenue = previewPrice && shares && Number.isInteger(shareCount) && shareCount > 0
    ? shareCount * previewPrice
    : null;

  return (
    <div className="trade-form">
      <div className="section-header red">Sell Stock</div>
      <div className="section-body">
        {error && <div className="form-error">{error}</div>}
        <div className="input-group">
          <input
            type="text"
            placeholder="Stock Symbol (e.g. AAPL)"
            value={symbol}
            onChange={e => { setSymbol(e.target.value); setError(''); }}
            disabled={isLoading}
          />
          <input
            type="number"
            placeholder="Number of Shares"
            value={shares}
            onChange={e => setShares(e.target.value)}
            min="1"
            step="1"
            disabled={isLoading}
          />
          <button onClick={handleSubmit} disabled={isLoading} className="sell-btn">
            {isLoading ? 'Selling...' : 'Sell Stock'}
          </button>
        </div>
        {debouncedSymbol && (
          <div className="price-preview">
            {isPreviewing ? (
              <span className="preview-loading">Fetching price…</span>
            ) : previewPrice != null ? (
              <>
                <span className="preview-price">{debouncedSymbol}: <strong>${previewPrice.toFixed(2)}</strong></span>
                {estimatedRevenue != null && (
                  <span className="preview-cost">Est. revenue: <strong>${estimatedRevenue.toFixed(2)}</strong></span>
                )}
              </>
            ) : (
              <span className="preview-unknown">Price unavailable for {debouncedSymbol}</span>
            )}
          </div>
        )}
      </div>
      {showConfirm && (
        <ConfirmModal
          type="sell"
          symbol={symbol.toUpperCase()}
          shares={Number(shares)}
          price={previewPrice}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default SellStock;
