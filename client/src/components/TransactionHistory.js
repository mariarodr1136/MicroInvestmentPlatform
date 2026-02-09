import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import '../App.css';

const TransactionHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5001/api/transactions/${userId}/history`, {
        params: { limit: 100 },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setError('Failed to fetch transaction history.');
    } finally {
      setLoading(false);
    }
  }, [userId]); // Dependency on userId

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Add fetchTransactions to the dependency array

  return (
    <div className="transaction-history-container">
      <div className="section-header purple">Recent Transactions</div>
      <div className="section-body">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="form-error">{error}</div>}
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Symbol</th>
              <th>Shares</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, visibleCount).map((transaction) => (
              <tr key={transaction._id}>
                <td className={transaction.type === 'buy' ? 'type-buy' : 'type-sell'}>
                  {transaction.type.toUpperCase()}
                </td>
                <td>{transaction.symbol}</td>
                <td>{transaction.shares}</td>
                <td>${transaction.pricePerShare.toFixed(2)}</td>
                <td>${(transaction.shares * transaction.pricePerShare).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="news-buttons">
          {visibleCount < transactions.length && (
            <button
              className="news-toggle-btn"
              onClick={() => setVisibleCount(visibleCount + 5)}
            >
              Show More
            </button>
          )}
          {visibleCount > 5 && (
            <button
              className="news-toggle-btn"
              onClick={() => setVisibleCount(Math.max(visibleCount - 5, 5))}
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
