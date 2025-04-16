import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Divider,
  Button,
  // IconButton,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import CachedIcon from '@mui/icons-material/Cached';
import ChatIcon from '@mui/icons-material/Chat';
import { ThemeToggle } from '../../components/themeToggle/ThemeToggle';

// Interfaces for data structures
interface MetricCard {
  id: string;
  title: string;
  value: number;
  change?: string;
  subLabel?: string;
  period: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
}

interface RecentActivity {
  id: number;
  user: string;
  avatar: string;
  action: string;
  document: string;
  time: string;
  color: string;
}

interface AuditLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
}

// Mock data with explicit types
const metricCards: MetricCard[] = [
  {
    id: 'documents',
    title: 'Documents',
    value: 1284,
    change: '+8.2%',
    period: 'This month',
    icon: <DescriptionIcon />,
    color: '#4285F4',
    progress: 75,
  },
  {
    id: 'processing',
    title: 'Processing',
    value: 42,
    subLabel: 'Active',
    period: 'Queue status',
    icon: <CachedIcon />,
    color: '#9C27B0',
    progress: 40,
  },
  {
    id: 'users',
    title: 'Active Users',
    value: 87,
    change: '+12.3%',
    period: 'Last 30 days',
    icon: <PeopleIcon />,
    color: '#34A853',
    progress: 85,
  },
  {
    id: 'interactions',
    title: 'AI Interactions',
    value: 3427,
    change: '+23.8%',
    period: 'This week',
    icon: <ChatIcon />,
    color: '#4285F4',
    progress: 65,
  },
];

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    user: 'John Doe',
    avatar: 'JD',
    action: 'Uploaded a new document',
    document: 'Q4 Financial Report.pdf',
    time: '35 minutes ago',
    color: '#4285F4',
  },
  {
    id: 2,
    user: 'Emma Wilson',
    avatar: 'EW',
    action: 'Shared',
    document: 'Project Proposal with the team',
    time: '2 hours ago',
    color: '#9C27B0',
  },
  {
    id: 3,
    user: 'AI System',
    avatar: 'AI',
    action: 'Automatically categorized 28 new documents',
    document: '',
    time: '3 hours ago',
    color: '#34A853',
  },
  {
    id: 4,
    user: 'Sarah Miller',
    avatar: 'SM',
    action: 'Commented on',
    document: 'Marketing Plan.docx',
    time: 'Yesterday',
    color: '#FBBC05',
  },
  {
    id: 5,
    user: 'Tom Brown',
    avatar: 'TB',
    action: 'Created a new workspace',
    document: 'Product Launch',
    time: 'Yesterday',
    color: '#EA4335',
  },
];

const auditLogs: AuditLog[] = [
  { id: 1, user: 'John Doe', action: 'Created', resource: 'Document', ip: '192.168.1.1', timestamp: '2023-08-15 14:32:45' },
  { id: 2, user: 'Emma Wilson', action: 'Modified', resource: 'User Permissions', ip: '192.168.1.42', timestamp: '2023-08-15 13:18:22' },
  { id: 3, user: 'System', action: 'Backup', resource: 'Database', ip: 'Internal', timestamp: '2023-08-15 12:00:00' },
  { id: 4, user: 'Sarah Miller', action: 'Accessed', resource: 'Restricted File', ip: '192.168.1.87', timestamp: '2023-08-15 10:45:13' },
];

const quickActions: QuickAction[] = [
  { id: 'new', icon: <DescriptionIcon />, title: 'New Document' },
  { id: 'invite', icon: <PeopleIcon />, title: 'Invite User' },
  { id: 'duplicate', icon: <DescriptionIcon />, title: 'Duplicate' },
  { id: 'export', icon: <DescriptionIcon />, title: 'Export' },
];

// Type for ThemeToggle component (assuming it's a custom component)
// interface ThemeToggleProps {
//   // Add props if known, otherwise leave empty
// }

export default function Dashboard() {
  const [tabValue, setTabValue] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={500}>
            Dashboard Overview
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} color="primary">
              Add Widget
            </Button>
            <Button variant="outlined" startIcon={<FilterAltOutlined />}>
              Filter
            </Button>
            <ThemeToggle />
          </Box>
        </Box>

        {/* Rest of the component remains the same */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metricCards.map((card: MetricCard) => (
            <Grid item xs={12} sm={6} md={3} key={card.id}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Avatar sx={{ bgcolor: card.color, width: 32, height: 32 }}>{card.icon}</Avatar>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h4" component="div" fontWeight={500}>
                      {card.value.toLocaleString()}
                    </Typography>
                    {card.change && (
                      <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                        {card.change}
                      </Typography>
                    )}
                    {card.subLabel && (
                      <Typography variant="body2" color="warning.main" sx={{ ml: 1 }}>
                        {card.subLabel}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {card.period}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: card.color,
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Activity Overview"
                action={
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Daily" />
                    <Tab label="Weekly" />
                    <Tab label="Monthly" />
                  </Tabs>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    height: 250,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    px: 2,
                  }}
                >
                  {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day, i) => (
                    <Box
                      key={day}
                      sx={{
                        width: '10%',
                        height: `${[40, 60, 30, 50, 70, 55, 35][i]}%`,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {day}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Recent Activity"
                action={
                  <Button variant="text" color="primary" size="small">
                    View all
                  </Button>
                }
              />
              <CardContent sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity: RecentActivity, index: number) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 3, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: activity.color }}>{activity.avatar}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle2">{activity.user}</Typography>}
                          secondary={
                            <>
                              <Typography variant="body2" component="span">
                                {activity.action}{' '}
                                <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                                  {activity.document}
                                </Typography>
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                {activity.time}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Grid container spacing={2}>
                  {quickActions.map((action: QuickAction) => (
                    <Grid item xs={6} key={action.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: 'background.default', color: 'primary.main', mb: 1 }}>
                          {action.icon}
                        </Avatar>
                        <Typography variant="body2">{action.title}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title="Recent Audit Logs"
                action={
                  <Button variant="text" color="primary" size="small">
                    View all
                  </Button>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>USER</TableCell>
                        <TableCell>ACTION</TableCell>
                        <TableCell>RESOURCE</TableCell>
                        <TableCell>IP ADDRESS</TableCell>
                        <TableCell>TIMESTAMP</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {auditLogs.map((log: AuditLog) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell>{log.ip}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}