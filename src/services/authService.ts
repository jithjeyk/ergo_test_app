import { User, UserRole, UserPermission } from "../types/types";

// Define response interfaces
interface AuthResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://example.com/avatar1.jpg",
    role: UserRole.ADMIN,
    permissions: [
      UserPermission.READ,
      UserPermission.WRITE,
      UserPermission.DELETE,
      UserPermission.UPDATE,
      UserPermission.ADMIN_ACCESS,
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456",
    avatar: "https://example.com/avatar2.jpg",
    role: UserRole.USER,
    permissions: [UserPermission.READ],
  },
];

class AuthService {
  // Simulate network delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Login method
  async login(
    email: string,
    password: string
  ): Promise<AuthResponse<{ user: User; permissions: UserPermission[] }>> {
    try {
      await this.delay();

      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return {
          success: false,
          message: "Login Failed",
          error: "Invalid email or password",
        };
      }

      // Explicitly pick the User properties
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      };

      // Store last logged-in user
      localStorage.setItem("lastLoggedInUser", email);

      return {
        success: true,
        message: "Login Successful",
        data: {
          user: userWithoutPassword,
          permissions: user.permissions,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Login Error",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  // Logout method
  async logout(): Promise<AuthResponse> {
    try {
      await this.delay();

      // Remove last logged-in user
      localStorage.removeItem("lastLoggedInUser");

      return {
        success: true,
        message: "Logout Successful",
      };
    } catch (error) {
      return {
        success: false,
        message: "Logout Failed",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<
    AuthResponse<{ user: User; permissions: UserPermission[] }>
  > {
    try {
      await this.delay();

      // Simulate storing last logged-in user in localStorage
      const storedUserEmail = localStorage.getItem("lastLoggedInUser");

      if (!storedUserEmail) {
        return {
          success: false,
          message: "Authentication Error",
          error: "No authenticated user found",
        };
      }

      const user = MOCK_USERS.find((u) => u.email === storedUserEmail);

      if (!user) {
        return {
          success: false,
          message: "User Not Found",
          error: "Stored user no longer exists",
        };
      }

      // Explicitly pick the User properties
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      };

      return {
        success: true,
        message: "User Retrieved Successfully",
        data: {
          user: userWithoutPassword,
          permissions: user.permissions,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Retrieve User Error",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  // Register method
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse<{ user: User; permissions: UserPermission[] }>> {
    try {
      await this.delay();

      // Validate input
      if (!name || !email || !password) {
        return {
          success: false,
          message: "Registration Failed",
          error: "All fields are required",
        };
      }

      // Check if email already exists
      if (MOCK_USERS.some((u) => u.email === email)) {
        return {
          success: false,
          message: "Registration Failed",
          error: "Email already registered",
        };
      }

      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        password,
        role: UserRole.USER,
        avatar: `https://example.com/avatar${MOCK_USERS.length + 1}.jpg`,
        permissions: [UserPermission.READ],
      };

      MOCK_USERS.push(newUser);

      // Store last logged-in user
      localStorage.setItem("lastLoggedInUser", email);

      // Explicitly pick the User properties
      const userWithoutPassword: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
      };

      return {
        success: true,
        message: "Registration Successful",
        data: {
          user: userWithoutPassword,
          permissions: newUser.permissions,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Registration Error",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  // Reset password method
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await this.delay();

      const user = MOCK_USERS.find((u) => u.email === email);

      if (!user) {
        return {
          success: false,
          message: "Reset Password Failed",
          error: "Email not found",
        };
      }

      // In a real app, you'd send a password reset email
      console.log(`Password reset link sent to ${email}`);

      return {
        success: true,
        message: "Password Reset Link Sent",
        data: undefined,
      };
    } catch (error) {
      return {
        success: false,
        message: "Password Reset Error",
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
}

export default new AuthService();
