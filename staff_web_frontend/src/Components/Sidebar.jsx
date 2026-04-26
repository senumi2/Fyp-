import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role')?.toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h3>Saltern MS</h3>
      </div>
      <ul className="sidebar-menu">
        <li onClick={() => navigate('/')}>🏠 Home</li>
        <li onClick={() => navigate('/profile')}>👤 My Profile</li>
        
        {userRole === 'admin' && <li onClick={() => navigate('/adminDashboard')}>⚙️ Admin Dashboard</li>}
        {userRole === 'driver' && <li onClick={() => navigate('/driverDashboard')}>🚚 Driver Tasks</li>}
        
        <li onClick={() => navigate('/staff-login')}>🛠️ Staff Services</li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;