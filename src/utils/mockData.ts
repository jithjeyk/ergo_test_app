import { TeamMember } from '../types/teamMembers';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    position: 'Senior Project Manager',
    phone: '+1 (555) 123-4567',
    userType: 'admin',
    role: 'manager',
    status: 'registered',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    department: 'Project Management',
    hireDate: 'March 15, 2019',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    position: 'HR Specialist',
    phone: '+1 (555) 987-6543',
    userType: 'user',
    role: 'hr',
    status: 'registered',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    department: 'Human Resources',
    hireDate: 'June 22, 2020',
    lastActive: '30 minutes ago'
  },
  // Add 3 more mock members following the same pattern
];