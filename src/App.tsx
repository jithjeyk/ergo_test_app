import { Suspense, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from "./navigation/routes";
import NavigationGuard from "./navigation/NavigationGuard";
import AuthContainer from "./features/auth/AuthContainer";
import MainLayout from "./components/layout/MainLayout";
import Loading from "./components/common/Loading";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import NotFoundPage from "./features/error/NotFound";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Component to handle root redirection based on auth status
const RootRedirect = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Root Route - Intelligently redirect based on auth status */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Auth Routes */}
              <Route
                path="/login"
                element={
                  <AuthContainer>
                    <LoginPage />
                  </AuthContainer>
                }
              />
              <Route
                path="/signup"
                element={
                  <AuthContainer>
                    <SignupPage />
                  </AuthContainer>
                }
              />
              
              {/* Protected Routes with MainLayout */}
              <Route element={<MainLayout />}>
                {routes.map((route) => {
                  // For routes with children, use NavigationGuard with Outlet
                  if (route.children && route.children.length > 0) {
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          <NavigationGuard
                            requiresAuth={route.requiresAuth}
                            permissions={route.permissions}
                          />
                        }
                      >
                        {/* Index route for parent path */}
                        {route.component && (
                          <Route
                            index
                            element={<route.component />}
                          />
                        )}
                        
                        {/* Child routes */}
                        {route.children.map((childRoute) => (
                          <Route
                            key={childRoute.path}
                            path={childRoute.path}
                            element={
                              <NavigationGuard
                                requiresAuth={childRoute.requiresAuth || route.requiresAuth}
                                permissions={[...(route.permissions || []), ...(childRoute.permissions || [])]}
                              >
                                <childRoute.component />
                              </NavigationGuard>
                            }
                          />
                        ))}
                      </Route>
                    );
                  }
                  
                  // For routes without children
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <NavigationGuard
                          requiresAuth={route.requiresAuth}
                          permissions={route.permissions}
                        >
                          {route.component && <route.component />}
                        </NavigationGuard>
                      }
                    />
                  );
                })}
              </Route>

              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;