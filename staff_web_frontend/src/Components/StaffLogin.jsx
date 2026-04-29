import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';

const StaffLogin = () => {
  const navigate = useNavigate();
  
  // localStorage එකෙන් Role එක ලබාගෙන trim සහ lowercase කරයි
  const userRole = (localStorage.getItem('role') || "").toLowerCase().trim();

  const menuItems = [
    { id: 1, title: 'Admin Panel', path: '/adminDashboard', role: 'admin' },
    { id: 2, title: 'Ponds Management', path: '/pondsManagement', role: 'ponds management' },
    { id: 3, title: 'Harvesting', path: '/harvestManagement', role: 'harvest management' },
    { id: 4, title: 'Equipment', path: '/equpmentUsage', role: 'equipment usage' },
    { id: 5, title: 'Inventory', path: '/inventoryManagement', role: 'inventory management' },
    { id: 6, title: 'Finance', path: '/expensesFinance', role: 'expenses & finance' },
    { id: 7, title: 'Deliveries', path: '/driverDashboard', role: 'Driver' },
  ];

  return (
    <div className="staff-container">
      <div className="card-grid">
        {menuItems.map((item) => {
          // ✅ මෙහිදී Role එක අකුරක් නෑර සමාන නම් පමණක් Card එක Unlock වේ.
          // Admin ට පවා Unlock වන්නේ 'admin' role එක සහිත Card එක පමණි.
          const isDisabled = userRole !== item.role;

          return (
            <div 
              key={item.id} 
              className={`menu-card ${isDisabled ? 'disabled-card' : ''}`} 
              onClick={() => !isDisabled && navigate(item.path)}
              style={{
                filter: isDisabled ? 'blur(4px)' : 'none',
                opacity: isDisabled ? 0.6 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                pointerEvents: isDisabled ? 'none' : 'auto',
                position: 'relative' // Locked tag එක නිවැරදිව පෙන්වීමට
              }}
            >
              <div className="inner-card">
                <span className="card-text">{item.title}</span>
                {isDisabled && (
                  <span className="locked-tag" style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#e53e3e',
                    color: 'white',
                    padding: '2px 8px',
                    fontSize: '10px',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffLogin;