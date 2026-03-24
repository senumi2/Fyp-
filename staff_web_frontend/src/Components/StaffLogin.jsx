import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';

const StaffLogin = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, title: 'Admin', path: '/adminDashboard' },
    { id: 2, title: 'Ponds', path: '/pondsManagement' },
    { id: 3, title: 'Harvest Management', path: '/harvestManagement' },
    { id: 4, title: 'Equipment Usage', path: '/equpmentUsage' },
    { id: 5, title: 'Inventory Storage', path: '/inventoryManagement' },
    { id: 6, title: 'Expenses & Finance', path: '/expensesFinance' },
    // --- 🚀 රියදුරු සඳහා අලුතින් එක් කළ Card එක ---
    { id: 7, title: 'Delivery Tasks', path: '/driverDashboard' },
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
              {/* මෙතනදී Driver Card එකට විතරක් වෙනස් පාටක් හෝ icon එකක් වුණත් පස්සේ දාන්න පුළුවන් */}
              <span className="card-text">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffLogin;