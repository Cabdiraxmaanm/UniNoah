// Mock API service for UniNoah app
// In a real app, this would connect to a backend server

// Mock data
let users = [
  {
    id: '1',
    email: 'student@example.com',
    studentId: 'STU12345',
    password: 'password123',
    name: 'Ahmed Hassan',
    phone: '+252 90 123 4567',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '2',
    email: 'driver@example.com',
    driverId: 'DRV67890',
    password: 'password123',
    name: 'Omar Ali',
    phone: '+252 90 987 6543',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
      capacity: 7,
    },
    userType: 'driver',
  },
];

let rides = [
  {
    id: '1',
    driverId: '2',
    driverName: 'Omar Ali',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
    route: {
      from: 'University of Hargeisa',
      to: 'Amoud University',
      fromCoords: { latitude: 9.5632, longitude: 44.0672 },
      toCoords: { latitude: 9.4167, longitude: 43.6500 },
    },
    departureTime: '2024-01-15T08:30:00Z',
    availableSeats: 3,
    price: 25,
    status: 'available',
    passengers: [],
  },
  {
    id: '2',
    driverId: '2',
    driverName: 'Omar Ali',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
    route: {
      from: 'Burao University',
      to: 'University of Hargeisa',
      fromCoords: { latitude: 9.5221, longitude: 45.5336 },
      toCoords: { latitude: 9.5632, longitude: 44.0672 },
    },
    departureTime: '2024-01-15T14:00:00Z',
    availableSeats: 2,
    price: 30,
    status: 'available',
    passengers: [],
  },
];

let bookings = [];
let requests = [];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication
export const authAPI = {
  async login(email, password, userType) {
    await delay(1000);
    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt:', { email, password, userType });
    console.log('Email type:', typeof email);
    console.log('Password type:', typeof password);
    console.log('UserType type:', typeof userType);
    
    console.log('Available users:', users.map(u => ({
      email: u.email,
      password: u.password,
      userType: u.userType,
      id: u.id
    })));
    
    const user = users.find(u => {
      const emailMatch = u.email === email;
      const passwordMatch = u.password === password;
      const userTypeMatch = u.userType === userType;
      
      console.log('Checking user:', u.email);
      console.log('Email match:', emailMatch);
      console.log('Password match:', passwordMatch);
      console.log('UserType match:', userTypeMatch);
      
      return emailMatch && passwordMatch && userTypeMatch;
    });
    
    console.log('Found user:', user);
    console.log('=== END LOGIN DEBUG ===');
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    throw new Error('Invalid credentials');
  },

  async register(userData) {
    await delay(1000);
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
    };
    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  },
};

// Rides
export const ridesAPI = {
  async getAvailableRides() {
    await delay(800);
    return rides.filter(ride => ride.status === 'available');
  },

  async createRide(rideData) {
    await delay(1000);
    const newRide = {
      id: Date.now().toString(),
      ...rideData,
      status: 'available',
      passengers: [],
    };
    rides.push(newRide);
    return newRide;
  },

  async updateRide(rideId, updates) {
    await delay(500);
    const rideIndex = rides.findIndex(r => r.id === rideId);
    if (rideIndex !== -1) {
      rides[rideIndex] = { ...rides[rideIndex], ...updates };
      return rides[rideIndex];
    }
    throw new Error('Ride not found');
  },

  async deleteRide(rideId) {
    await delay(500);
    const rideIndex = rides.findIndex(r => r.id === rideId);
    if (rideIndex !== -1) {
      rides.splice(rideIndex, 1);
      return { success: true };
    }
    throw new Error('Ride not found');
  },
};

// Bookings
export const bookingsAPI = {
  async createBooking(bookingData) {
    await delay(1000);
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    
    // Update ride
    const ride = rides.find(r => r.id === bookingData.rideId);
    if (ride) {
      ride.availableSeats -= 1;
      ride.passengers.push(bookingData.passengerId);
      if (ride.availableSeats <= 0) {
        ride.availableSeats = 0;
        ride.status = 'full';
      }
    }
    
    return newBooking;
  },

  async getBookings(userId, userType) {
    await delay(800);
    if (userType === 'student') {
      return bookings.filter(b => b.passengerId === userId);
    } else {
      return bookings.filter(b => b.driverId === userId);
    }
  },

  async updateBooking(bookingId, updates) {
    await delay(500);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      bookings[bookingIndex] = { ...bookings[bookingIndex], ...updates };
      return bookings[bookingIndex];
    }
    throw new Error('Booking not found');
  },
};

// Requests
export const requestsAPI = {
  async createRequest(requestData) {
    await delay(1000);
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    return newRequest;
  },

  async getRequests(driverId) {
    await delay(800);
    return requests.filter(r => r.driverId === driverId);
  },

  async getRequestsForPassenger(passengerId) {
    await delay(800);
    return requests.filter(r => r.passengerId === passengerId);
  },

  async updateRequest(requestId, updates) {
    await delay(500);
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      const updated = { ...requests[requestIndex], ...updates };
      requests[requestIndex] = updated;

      // If request was accepted, auto-create booking
      if (updates.status === 'accepted') {
        const req = updated;
        const bookingData = {
          rideId: req.rideId,
          passengerId: req.passengerId,
          passengerName: req.passengerName,
          passengerPhone: req.passengerPhone,
          driverId: req.driverId,
          driverName: req.driverName,
          route: req.route,
          departureTime: req.departureTime,
          price: req.price,
        };
        await bookingsAPI.createBooking(bookingData);
      }

      return updated;
    }
    throw new Error('Request not found');
  },
};

// Location
export const locationAPI = {
  async getCurrentLocation() {
    await delay(500);
    // Mock location - in real app this would use GPS
    return {
      latitude: 9.5632,
      longitude: 44.0672,
      accuracy: 10,
    };
  },

  async getRoute(from, to) {
    await delay(1000);
    // Mock route calculation
    return {
      distance: '45 km',
      duration: '1 hour 15 minutes',
      coordinates: [
        { latitude: from.latitude, longitude: from.longitude },
        { latitude: to.latitude, longitude: to.longitude },
      ],
    };
  },
};

// Notifications
export const notificationsAPI = {
  async sendNotification(userId, notification) {
    await delay(300);
    // In a real app, this would send push notifications
    console.log('Notification sent to user:', userId, notification);
    return { success: true };
  },
}; 