import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';



const StaffLogin = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, title: 'Admin', path: '/adminDashboard' },
    { id: 2, title: 'Ponds', path: '/pondsManagement' },
    { id: 3, title: 'Harvest Mnagment', path: '/harvestManagement' },
    { id: 4, title: 'Equipment Usage', path: '/equpmentUsage' },
    { id: 5, title: 'Inventory Storage', path: '/inventoryManagement' },
    { id: 6, title: 'Expences & Finance', path: '/expensesFinance' },
  ];

  return (
    <div className="staff-container">
      <div className="card-grid">
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className="menu-card" 
            onClick={() => navigate(item.path)}
          >
            <div className="inner-card">
              <span className="card-text">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffLogin;