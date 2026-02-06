import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div className="profile-layout">
      <Sidebar />

      <div className="profile-content">
        <div className="avatar">👤</div>

        <input value={user.fullName || ""} disabled />
        <input value={user.contact || ""} disabled />
        <input value={user.email || ""} disabled />

        <button>Edit details</button>
      </div>
    </div>
  );
}

export default Profile;
