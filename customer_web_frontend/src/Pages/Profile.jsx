import React, { useEffect, useState } from "react";
import { FiEdit2, FiMail, FiPhone, FiUser, FiCamera, FiCheck, FiX, FiLock } from "react-icons/fi";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    contact: "",
    profileImage: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("token");
  const cleanToken = token && token.startsWith("Bearer ") ? token.split(" ")[1] : token;

  const loadProfile = async () => {
    if (!cleanToken) return;
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${cleanToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    console.log("Saving process started...");
    const formData = new FormData();
    formData.append("fullName", user.fullName || "");
    formData.append("contact", user.contact || "");
    
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${cleanToken}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data); 
        setEditMode(false);
        setPreview(null);
        setImage(null);
        alert("Profile updated successfully!");
      } else {
        alert("Server Error: " + (data.message || "Failed to save"));
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Network Error. Please try again.");
    }
  };

  
  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return alert("Please fill both password fields");
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile/update-password", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}` 
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "" });
        setShowPasswordFields(false);
      } else {
        alert(data.message || "Error updating password");
      }
    } catch (err) {
      console.error("Password Update Error:", err);
      alert("Network Error. Please try again.");
    }
  };

  const getImageUrl = () => {
    if (preview) return preview;
    if (user.profileImage) {
      const baseUrl = "http://localhost:5000";
      return user.profileImage.startsWith("/") 
        ? `${baseUrl}${user.profileImage}` 
        : `${baseUrl}/${user.profileImage}`;
    }
    return null;
  };

  return (
    <div className="profile-container">
      <div className="profile-glass-card">
        <div className="profile-header-ui">
          <h2>Account Settings</h2>
          <p>Update your profile and contact details.</p>
        </div>

        <div className="avatar-section">
          <div className="avatar-wrapper">
            {getImageUrl() ? (
              <img src={getImageUrl()} alt="profile" className="profile-img" />
            ) : (
              <div className="avatar-placeholder"><FiUser /></div>
            )}
            
            {editMode && (
              <label className="upload-badge">
                <FiCamera />
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </label>
            )}
          </div>
          <h3 className="user-display-name">{user.fullName || "User Name"}</h3>
        </div>

        <div className="profile-fields-grid">
          <div className="input-group">
            <label><FiUser /> Full Name</label>
            <input
              name="fullName"
              value={user.fullName || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={editMode ? "edit-active" : ""}
            />
          </div>

          <div className="input-group">
            <label><FiMail /> Email Address</label>
            <input value={user.email || ""} disabled className="disabled-input" />
          </div>

          <div className="input-group">
            <label><FiPhone /> Contact Number</label>
            <input
              name="contact"
              value={user.contact || ""}
              onChange={handleChange}
              disabled={!editMode}
              className={editMode ? "edit-active" : ""}
            />
          </div>

          
          <div className="password-reset-section">
            <button 
              className="toggle-pw-btn" 
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              <FiLock /> {showPasswordFields ? "Cancel Password Reset" : "Change Password"}
            </button>

            {showPasswordFields && (
              <div className="pw-input-container">
                <div className="input-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <button className="confirm-pw-btn" onClick={handlePasswordUpdate}>
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-footer-actions">
          {!editMode ? (
            <button className="edit-main-btn" onClick={() => setEditMode(true)}>
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <div className="action-btn-group">
              <button className="cancel-main-btn" onClick={() => {
                setEditMode(false);
                setPreview(null);
                setImage(null);
                loadProfile();
              }}>
                <FiX /> Cancel
              </button>
              <button className="save-main-btn" onClick={handleSave}>
                <FiCheck /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;