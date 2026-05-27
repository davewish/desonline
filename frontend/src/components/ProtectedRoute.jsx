import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Protected Route component
 * Only allows authenticated users to access the route
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, loading } = useAuth();

  console.log("🔒 ProtectedRoute check:", {
    isAuthenticated,
    hasToken: !!token,
    loading,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;
