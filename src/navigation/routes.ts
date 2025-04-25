import { lazy } from "react";
import { UserPermission } from "../types/types";
// Lazy-loaded components for better code splitting
const Dashboard = lazy(() => import("../features/dashboard/DashboardPage"));
const MyKnowledgeBase = lazy(
  () => import("../features/fileManager/MyDocumentsPage")
);
const ChatPage = lazy(() => import("../features/chat/ChatLayout"));
// const UserManagement = lazy(() => import('../features/users/UserManagementPage'));
// Add other page components

export interface Route {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType> | React.FC;
  exact?: boolean;
  requiresAuth?: boolean;
  permissions?: UserPermission[];
  children?: Route[];
}

const routes: Route[] = [
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
    requiresAuth: true,
    permissions: [
      UserPermission.ADMIN_ACCESS,
      UserPermission.READ,
      UserPermission.WRITE,
      UserPermission.DELETE,
      UserPermission.UPDATE,
    ],
  },
  {
    path: "/myknowledgebase",
    component: MyKnowledgeBase,
    exact: true,
    requiresAuth: true,
    permissions: [
      UserPermission.ADMIN_ACCESS,
      UserPermission.READ,
      UserPermission.WRITE,
      UserPermission.DELETE,
      UserPermission.UPDATE,
    ],
  },
  {
    path: "/chats",
    component: ChatPage,
    exact: true,
    requiresAuth: true,
    permissions: [
      UserPermission.ADMIN_ACCESS,
      UserPermission.READ,
      UserPermission.WRITE,
      UserPermission.DELETE,
      UserPermission.UPDATE,
    ],
  },
  //   {
  //     path: '/users',
  //     component: UserManagement,
  //     requiresAuth: true,
  //     permissions: ['view_users'],
  //   },
  // Add more routes as needed
];

export default routes;
