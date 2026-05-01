import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHistory, FaLock, FaUserEdit, 
  FaCalendarAlt, FaPhone, FaCamera, FaGlobe, FaIdBadge,
  FaEye, FaEyeSlash // Eye Icons මෙහිදී එක් කරන ලදී
} from "react-icons/fa";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("general");
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Password Visibility States (අලුතින් එක් කරන ලදී)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") || "Staff Member";

  const loadProfile = async () => {
    if (!token) {
        console.error("No token found!");
        return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Profile Fetch Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => { loadProfile(); }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", user.fullName);
    formData.append("contact", user.contact);
    if (image) formData.append("image", image);

    try {
      await axios.put("http://localhost:5000/api/profile", formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        },
      });
      setEditMode(false);
      setPreview(null);
      setImage(null);
      alert("Profile Updated Successfully!");
      loadProfile(); 
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <header className="profile-header-nav">
        <button className="back-circle-btn" onClick={() => navigate(-1)}>←</button>
        <div className="header-info">
            <span className="portal-tag">{userRole.toUpperCase()} PORTAL</span>
            <h1 className="header-user-name">{user.fullName || "User Profile"}</h1>
        </div>
        <div className="account-status">
            <span className="status-indicator-active"></span> System Verified
        </div>
      </header>

      <div className="profile-layout-grid">
        <aside className="profile-sidebar-card">
          <div className="profile-img-container">
            <img 
              src={preview || (user.profileImage ? `http://localhost:5000${user.profileImage}` : "https://via.placeholder.com/150")} 
              alt="Profile" 
            />
            {editMode && (
              <label className="upload-overlay">
                <FaCamera />
                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className="user-meta">
            <h3>{user.fullName}</h3>
            <span className="role-badge-main">{user.jobRole || userRole}</span>
          </div>

          <nav className="profile-tabs">
            <button className={activeTab === "general" ? "active" : ""} onClick={() => setActiveTab("general")}>
              <FaUserEdit /> Account Information
            </button>
            <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
              <FaLock /> Security Settings
            </button>
            <button className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>
              <FaHistory /> Login Activity
            </button>
          </nav>
        </aside>

        <main className="profile-main-content">
          <section className="summary-cards">
            <div className="s-card info-gradient">
              <div className="card-icon"><FaIdBadge /></div>
              <div className="card-data">
                <small>Full Name</small>
                <h4>{user.fullName || "Not Set"}</h4>
              </div>
            </div>
            <div className="s-card date-gradient">
              <div className="card-icon"><FaCalendarAlt /></div>
              <div className="card-data">
                <small>Join Date</small>
                <h4>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2025-09-12'}</h4>
              </div>
            </div>
            <div className="s-card location-gradient">
              <div className="card-icon"><FaGlobe /></div>
              <div className="card-data">
                <small>Current Region</small>
                <h4>Hambantota, Sri Lanka</h4>
              </div>
            </div>
          </section>

          {activeTab === "general" && (
            <div className="content-card animate-fade">
              <div className="card-header-actions">
                <h3>Personal Account Details</h3>
                <button className="edit-action-btn" onClick={() => setEditMode(!editMode)}>
                  {editMode ? "Cancel" : "Modify Profile"}
                </button>
              </div>

              <div className="form-grid">
                <div className="form-input full-width">
                  <label>Display Name</label>
                  <input 
                    value={user.fullName || ""} 
                    onChange={(e) => setUser({...user, fullName: e.target.value})}
                    disabled={!editMode} 
                  />
                </div>
                <div className="form-input full-width">
                  <label>Mobile Number</label>
                  <input 
                    value={user.contact || ""} 
                    onChange={(e) => setUser({...user, contact: e.target.value})}
                    disabled={!editMode} 
                  />
                </div>
              </div>
              
              {editMode && (
                <button className="primary-save-btn" onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Update Work Profile"}
                </button>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="content-card animate-fade">
                <h3>Account Password</h3>
                <p className="sub-desc">Update your password to keep your account safe.</p>
                <div className="security-form">
                    <div className="form-input">
                        <label>Old Password</label>
                        <div className="password-input-container">
                          <input type={showOldPassword ? "text" : "password"} />
                          <span className="password-toggle-icon" onClick={() => setShowOldPassword(!showOldPassword)}>
                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                    </div>
                    <div className="form-input">
                        <label>New Password</label>
                        <div className="password-input-container">
                          <input type={showNewPassword ? "text" : "password"} />
                          <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                    </div>
                    <button className="primary-save-btn">Change Password</button>
                </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="content-card animate-fade">
                <h3>Recent Login Sessions</h3>
                <div className="log-item">
                    <div className="log-icon-box">💻</div>
                    <div className="log-info">
                        <strong>Chrome on Windows</strong>
                        <p>Active Session • Deniyaya, SL</p>
                    </div>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;