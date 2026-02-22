import React, { useEffect, useState } from "react";

import "./Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 Load profile
  const loadProfile = async () => {
    const res = await fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setUser(data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // 🔹 Input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔹 Image select + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Save profile (FIXED)
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("fullName", user.fullName);
    formData.append("contact", user.contact);
    if (image) formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const updatedUser = await res.json();

    // 🔥 IMPORTANT FIXES
    setUser(updatedUser);   // update frontend with backend data
    setEditMode(false);
    setPreview(null);
    setImage(null);
  };

  return (
    <div className="profile-layout">
      

      <div className="profile-content">
        {/* Avatar */}
        <div className="avatar">
          {preview ? (
            <img src={preview} alt="preview" />
          ) : user.profileImage ? (
            <img
              src={`http://localhost:5000${user.profileImage}`}
              alt="profile"
            />
          ) : (
            <span className="avatar-icon">👤</span>
          )}

          {editMode && (
            <label className="change-photo">
              Change
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Inputs */}
        <input
          name="fullName"
          value={user.fullName || ""}
          onChange={handleChange}
          disabled={!editMode}
        />

        <input value={user.email || ""} disabled />

        <input
          name="contact"
          value={user.contact || ""}
          onChange={handleChange}
          disabled={!editMode}
        />

        {!editMode ? (
          <button className="Edit-btn"onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="btn-group">
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setEditMode(false);
                setPreview(null);
                setImage(null);
                loadProfile(); // reset changes
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
