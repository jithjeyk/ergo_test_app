import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserPermission } from "../types/types";

interface NavigationGuardProps {
  requiresAuth?: boolean;
  permissions?: UserPermission[];
  children?: React.ReactNode;
}

const NavigationGuard: React.FC<NavigationGuardProps> = ({
  requiresAuth = false,
  permissions = [],
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated, userPermissions } = useContext(AuthContext);

  // Authentication check
  const isAuthorized = () => {
    // If route requires authentication and user isn't authenticated
    if (requiresAuth && !isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If route requires specific permissions
    if (permissions.length > 0) {
      const hasRequiredPermissions = permissions.every((permission) =>
        userPermissions.includes(permission)
      );
      console.log("hasRequiredPermissions", hasRequiredPermissions);

      if (!hasRequiredPermissions) {
        // Redirect to unauthorized page or dashboard
        console.log("unauthorized::");

        return <Navigate to="/unauthorized" replace />;
      }
    }

    // Return null if all checks pass
    return null;
  };

  // Check authorization
  const authorizationResult = isAuthorized();
  if (authorizationResult) return authorizationResult;

  // If children are provided, render children
  if (children) {
    return <>{children}</>;
  }

  // If no children, use Outlet (for nested routes)
  return <Outlet />;
};

export default NavigationGuard;
