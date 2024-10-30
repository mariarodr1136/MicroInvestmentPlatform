import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import '../App.css';

const TransactionHistory = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5001/api/transactions/${userId}/history`, {
        params: { limit: 5 }, 
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
    <div className="transaction-history p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 underline">Recent Transaction History</h3>
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message text-red-600">{error}</div>}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Symbol</th>
            <th className="p-2 border">Shares</th>
            <th className="p-2 border">Price Per Share</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="hover:bg-gray-100">
              <td className="p-2 border">{new Date(transaction.date).toLocaleString()}</td>
              <td className="p-2 border">{transaction.type}</td>
              <td className="p-2 border">{transaction.symbol}</td>
              <td className="p-2 border">{transaction.shares}</td>
              <td className="p-2 border">${transaction.pricePerShare.toFixed(2)}</td>
              <td className="p-2 border">${(transaction.shares * transaction.pricePerShare).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
