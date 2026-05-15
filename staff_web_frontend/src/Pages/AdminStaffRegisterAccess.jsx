import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminStaffRegisterAccess.css'; 

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/pending-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/approve-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("User Approved Successfully!");
      fetchPendingUsers(); 
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="approval-container">
      <h2>Staff Registration Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map(user => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.jobRole}</td>
              <td>
                <button onClick={() => handleApprove(user._id)} className="approve-btn">Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pendingUsers.length === 0 && <p>No pending requests.</p>}
    </div>
  );
};

export default AdminApproval;