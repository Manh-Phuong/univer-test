import React from "react";
import { User } from "../../types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header
      style={{
        backgroundColor: "#2c3e50",
        color: "#fff",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            📊 Univer Workbooks
          </h1>
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ fontSize: "14px" }}>
              <div style={{ fontWeight: "500" }}>{user.name || user.email}</div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{user.email}</div>
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c0392b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#e74c3c";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
