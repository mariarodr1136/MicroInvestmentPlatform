const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default API_URL;
