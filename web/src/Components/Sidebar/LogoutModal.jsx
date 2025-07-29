import React from "react";
import "./LogoutModal.css"; // o agregalo al mismo archivo si preferís

const LogoutModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="confirm-btn">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
