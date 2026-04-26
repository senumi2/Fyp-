import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Path එක නිවැරදිදැයි බලන්න
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
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
    const formData = new FormData();
    formData.append("fullName", user.fullName);
    formData.append("contact", user.contact);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditMode(false);
        setPreview(null);
        setImage(null);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <div className="profile-layout">
      <Sidebar /> {/* Sidebar එක මෙහිදී පමණක් පෙන්වයි */}
      
      <div className="profile-content">
        <h2>My Profile</h2>
        <div className="avatar-section">
          <div className="avatar">
            {preview ? (
              <img src={preview} alt="preview" />
            ) : user.profileImage ? (
              <img src={`http://localhost:5000${user.profileImage}`} alt="profile" />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
            {editMode && (
              <label className="change-photo-label">
                Change Photo
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="input-group">
            <label>Full Name</label>
            <input name="fullName" value={user.fullName || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input value={user.email || ""} disabled className="disabled-input" />
          </div>
          <div className="input-group">
            <label>Contact</label>
            <input name="contact" value={user.contact || ""} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="input-group">
            <label>Designation</label>
            <input value={user.jobRole || ""} disabled className="disabled-input" />
          </div>

          <div className="profile-actions">
            {!editMode ? (
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            ) : (
              <div className="btn-group">
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
                <button className="cancel-btn" onClick={() => { setEditMode(false); loadProfile(); }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;