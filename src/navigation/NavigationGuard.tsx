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
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Permission check
  if (permissions.length > 0 && isAuthenticated) {
    const hasRequiredPermissions = permissions.every((permission) =>
      userPermissions.includes(permission)
    );
    
    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default NavigationGuard;