import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const VisitorCount = () => {
  const [count, setCount] = useState(0);

 useEffect(() => {
  const incrementVisitor = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/visitors/visit`);
      setCount(res.data.totalVisitors);
    } catch (err) {
      console.error('Error updating visitor count:', err);
    }
  };
  incrementVisitor();
}, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>Total Visitors: {count}</h3>
    </div>
  );
};

export default VisitorCount;