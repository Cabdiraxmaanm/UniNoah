// Admin API Services for UniNoah
// This file contains all admin-specific API calls

const BASE_URL = 'https://api.uninoah.com/admin'; // Replace with your actual API URL

// Mock data for development
const mockData = {
  users: {
    students: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@university.edu',
        phone: '+1234567890',
        status: 'active',
        joinDate: '2024-01-15',
        totalRides: 45,
        rating: 4.8,
        lastActive: '2024-03-15 14:30',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@university.edu',
        phone: '+1234567891',
        status: 'active',
        joinDate: '2024-02-20',
        totalRides: 32,
        rating: 4.9,
        lastActive: '2024-03-15 13:45',
      },
    ],
    drivers: [
      {
        id: '1',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@uninoah.com',
        phone: '+1234567893',
        status: 'active',
        joinDate: '2024-01-05',
        totalRides: 156,
        rating: 4.9,
        vehicle: 'Toyota Noah',
        license: 'DL123456',
        lastActive: '2024-03-15 15:00',
      },
    ],
  },
  rides: [
    {
      id: '1',
      studentName: 'John Doe',
      driverName: 'Sarah Wilson',
      pickup: 'University Main Gate',
      destination: 'Downtown Mall',
      status: 'completed',
      startTime: '2024-03-15 14:30',
      endTime: '2024-03-15 14:45',
      distance: '5.2 km',
      fare: '$12.50',
      rating: 4.8,
      paymentMethod: 'card',
    },
  ],
  analytics: {
    revenue: {
      total: 45678,
      growth: 15.2,
      daily: [1200, 1350, 1100, 1600, 1800, 2000, 2200],
    },
    rides: {
      total: 3456,
      growth: 8.5,
      daily: [45, 52, 38, 67, 72, 85, 89],
    },
    users: {
      total: 1247,
      growth: 12.3,
      daily: [8, 12, 6, 15, 18, 22, 25],
    },
  },
};

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication
export const adminAuth = {
  login: async (email, password) => {
    await delay(1000); // Simulate network delay
    
    // Mock authentication
    if (email === 'admin@uninoah.com' && password === 'admin123') {
      return {
        success: true,
        data: {
          token: 'mock_admin_token_12345',
          user: {
            id: 'admin_001',
            email: email,
            name: 'Admin User',
            role: 'admin',
            permissions: ['all'],
          },
        },
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }
  },

  logout: async () => {
    await delay(500);
    return { success: true };
  },

  verifyToken: async (token) => {
    await delay(300);
    return { success: true, valid: true };
  },
};

// User Management
export const userManagement = {
  // Get all users (students and drivers)
  getAllUsers: async (type = 'all', page = 1, limit = 20) => {
    await delay(800);
    
    let users = [];
    if (type === 'all' || type === 'students') {
      users = [...users, ...mockData.users.students];
    }
    if (type === 'all' || type === 'drivers') {
      users = [...users, ...mockData.users.drivers];
    }

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit),
        },
      },
    };
  },

  // Get user by ID
  getUserById: async (userId) => {
    await delay(500);
    
    const allUsers = [...mockData.users.students, ...mockData.users.drivers];
    const user = allUsers.find(u => u.id === userId);
    
    if (user) {
      return { success: true, data: user };
    } else {
      return { success: false, error: 'User not found' };
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    await delay(600);
    
    // Mock update
    console.log(`Updating user ${userId} status to ${status}`);
    
    return {
      success: true,
      data: {
        id: userId,
        status,
        updatedAt: new Date().toISOString(),
      },
    };
  },

  // Delete user
  deleteUser: async (userId) => {
    await delay(700);
    
    console.log(`Deleting user ${userId}`);
    
    return {
      success: true,
      message: 'User deleted successfully',
    };
  },

  // Search users
  searchUsers: async (query, type = 'all') => {
    await delay(600);
    
    let users = [];
    if (type === 'all' || type === 'students') {
      users = [...users, ...mockData.users.students];
    }
    if (type === 'all' || type === 'drivers') {
      users = [...users, ...mockData.users.drivers];
    }

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: filteredUsers,
    };
  },
};

// Ride Management
export const rideManagement = {
  // Get all rides
  getAllRides: async (status = 'all', page = 1, limit = 20) => {
    await delay(800);
    
    let rides = mockData.rides;
    if (status !== 'all') {
      rides = rides.filter(ride => ride.status === status);
    }

    return {
      success: true,
      data: {
        rides,
        pagination: {
          page,
          limit,
          total: rides.length,
          totalPages: Math.ceil(rides.length / limit),
        },
      },
    };
  },

  // Get ride by ID
  getRideById: async (rideId) => {
    await delay(500);
    
    const ride = mockData.rides.find(r => r.id === rideId);
    
    if (ride) {
      return { success: true, data: ride };
    } else {
      return { success: false, error: 'Ride not found' };
    }
  },

  // Update ride status
  updateRideStatus: async (rideId, status) => {
    await delay(600);
    
    console.log(`Updating ride ${rideId} status to ${status}`);
    
    return {
      success: true,
      data: {
        id: rideId,
        status,
        updatedAt: new Date().toISOString(),
      },
    };
  },

  // Assign driver to ride
  assignDriver: async (rideId, driverId) => {
    await delay(700);
    
    console.log(`Assigning driver ${driverId} to ride ${rideId}`);
    
    return {
      success: true,
      data: {
        rideId,
        driverId,
        assignedAt: new Date().toISOString(),
      },
    };
  },

  // Cancel ride
  cancelRide: async (rideId, reason) => {
    await delay(600);
    
    console.log(`Cancelling ride ${rideId} with reason: ${reason}`);
    
    return {
      success: true,
      data: {
        id: rideId,
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
      },
    };
  },

  // Process refund
  processRefund: async (rideId, amount) => {
    await delay(800);
    
    console.log(`Processing refund for ride ${rideId}, amount: ${amount}`);
    
    return {
      success: true,
      data: {
        rideId,
        refundAmount: amount,
        refundedAt: new Date().toISOString(),
        transactionId: `refund_${Date.now()}`,
      },
    };
  },
};

// Analytics
export const analytics = {
  // Get dashboard statistics
  getDashboardStats: async (period = 'week') => {
    await delay(1000);
    
    return {
      success: true,
      data: {
        revenue: mockData.analytics.revenue,
        rides: mockData.analytics.rides,
        users: mockData.analytics.users,
        period,
        generatedAt: new Date().toISOString(),
      },
    };
  },

  // Get revenue analytics
  getRevenueAnalytics: async (period = 'week') => {
    await delay(800);
    
    return {
      success: true,
      data: {
        total: mockData.analytics.revenue.total,
        growth: mockData.analytics.revenue.growth,
        daily: mockData.analytics.revenue.daily,
        period,
      },
    };
  },

  // Get ride analytics
  getRideAnalytics: async (period = 'week') => {
    await delay(800);
    
    return {
      success: true,
      data: {
        total: mockData.analytics.rides.total,
        growth: mockData.analytics.rides.growth,
        daily: mockData.analytics.rides.daily,
        period,
      },
    };
  },

  // Get user analytics
  getUserAnalytics: async (period = 'week') => {
    await delay(800);
    
    return {
      success: true,
      data: {
        total: mockData.analytics.users.total,
        growth: mockData.analytics.users.growth,
        daily: mockData.analytics.users.daily,
        period,
      },
    };
  },

  // Get top performing drivers
  getTopDrivers: async (limit = 10) => {
    await delay(600);
    
    const topDrivers = [
      { name: 'Sarah Wilson', rides: 156, rating: 4.9, earnings: 2340 },
      { name: 'David Brown', rides: 142, rating: 4.8, earnings: 2130 },
      { name: 'Lisa Davis', rides: 128, rating: 4.7, earnings: 1920 },
    ];

    return {
      success: true,
      data: topDrivers.slice(0, limit),
    };
  },

  // Export analytics data
  exportAnalytics: async (type, period) => {
    await delay(1500);
    
    console.log(`Exporting ${type} analytics for ${period}`);
    
    return {
      success: true,
      data: {
        downloadUrl: `https://api.uninoah.com/exports/${type}_${period}_${Date.now()}.csv`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      },
    };
  },
};

// System Settings
export const systemSettings = {
  // Get system settings
  getSettings: async () => {
    await delay(500);
    
    return {
      success: true,
      data: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        app: {
          maintenance: false,
          autoAssign: true,
          requireApproval: false,
        },
        pricing: {
          baseFare: '5.00',
          perKm: '2.50',
          perMinute: '0.50',
        },
        system: {
          maxRidesPerDriver: '20',
          driverRadius: '10',
          studentRadius: '5',
        },
      },
    };
  },

  // Update system settings
  updateSettings: async (settings) => {
    await delay(800);
    
    console.log('Updating system settings:', settings);
    
    return {
      success: true,
      data: {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
    };
  },

  // Toggle maintenance mode
  toggleMaintenanceMode: async (enabled) => {
    await delay(600);
    
    console.log(`Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
    
    return {
      success: true,
      data: {
        maintenance: enabled,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// Notifications
export const notifications = {
  // Send notification to users
  sendNotification: async (title, message, targetUsers = 'all') => {
    await delay(1000);
    
    console.log(`Sending notification: ${title} - ${message} to ${targetUsers}`);
    
    return {
      success: true,
      data: {
        notificationId: `notif_${Date.now()}`,
        sentAt: new Date().toISOString(),
        recipients: targetUsers,
      },
    };
  },

  // Get notification history
  getNotificationHistory: async (page = 1, limit = 20) => {
    await delay(600);
    
    const notifications = [
      {
        id: '1',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight at 2 AM',
        sentAt: '2024-03-15 10:00',
        recipients: 'all',
        status: 'sent',
      },
    ];

    return {
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total: notifications.length,
          totalPages: Math.ceil(notifications.length / limit),
        },
      },
    };
  },
};

// Support
export const support = {
  // Get support tickets
  getSupportTickets: async (status = 'all', page = 1, limit = 20) => {
    await delay(800);
    
    const tickets = [
      {
        id: '1',
        user: 'John Doe',
        subject: 'Payment issue',
        status: 'open',
        priority: 'high',
        createdAt: '2024-03-15 14:30',
        lastUpdated: '2024-03-15 14:30',
      },
    ];

    return {
      success: true,
      data: {
        tickets,
        pagination: {
          page,
          limit,
          total: tickets.length,
          totalPages: Math.ceil(tickets.length / limit),
        },
      },
    };
  },

  // Update ticket status
  updateTicketStatus: async (ticketId, status) => {
    await delay(600);
    
    console.log(`Updating ticket ${ticketId} status to ${status}`);
    
    return {
      success: true,
      data: {
        id: ticketId,
        status,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      error: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  } else {
    // Other error
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
};

// Default export with all services
export default {
  adminAuth,
  userManagement,
  rideManagement,
  analytics,
  systemSettings,
  notifications,
  support,
  handleApiError,
};
