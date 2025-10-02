import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./components/Auth/Login";
import { WorkbookList } from "./components/Workbook/WorkbookList";
import { UniverSheet } from "./components/Workbook/UniverSheet";
import { Workbook } from "./types";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/workbooks"
          element={
            <ProtectedRoute>
              <WorkbookListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workbooks/new"
          element={
            <ProtectedRoute>
              <WorkbookEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workbooks/:workbookId"
          element={
            <ProtectedRoute>
              <WorkbookEditorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/workbooks" replace />} />
        <Route path="*" element={<Navigate to="/workbooks" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Login Page
const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to workbooks if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/workbooks", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return <Login />;
};

// Workbook List Page
const WorkbookListPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelectWorkbook = (workbook: Workbook) => {
    navigate(`/workbooks/${workbook.id}`);
  };

  const handleCreateNew = () => {
    navigate("/workbooks/new");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div
        style={{
          padding: "15px 30px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>Univer Workbooks</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ color: "#666" }}>{user?.name || user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Workbook List */}
      <WorkbookList
        onSelect={handleSelectWorkbook}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
};

// Workbook Editor Page
const WorkbookEditorPage: React.FC = () => {
  const { workbookId } = useParams<{ workbookId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/workbooks");
  };

  // workbookId will be undefined for "/workbooks/new" route
  return <UniverSheet workbookId={workbookId} onBack={handleBack} />;
};

export default App;