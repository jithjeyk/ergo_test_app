import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./navigation/routes";
import NavigationGuard from "./navigation/NavigationGuard";
import AuthContainer from "./features/auth/AuthContainer";
import MainLayout from "./components/layout/MainLayout";
import Loading from "./components/common/Loading";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import NotFoundPage from "./features/error/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Login Route */}
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
                {routes.map((route) => (
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
                  >
                    {route.children?.map((childRoute) => (
                      <Route
                        key={childRoute.path}
                        path={childRoute.path}
                        element={
                          <NavigationGuard
                            requiresAuth={childRoute.requiresAuth}
                            permissions={childRoute.permissions}
                          >
                            <childRoute.component />
                          </NavigationGuard>
                        }
                      />
                    ))}
                  </Route>
                ))}
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
