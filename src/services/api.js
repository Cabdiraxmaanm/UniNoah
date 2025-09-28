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
  {
    id: '3',
    email: 'fatima@example.com',
    studentId: 'STU12346',
    password: 'password123',
    name: 'Fatima Mohamed',
    phone: '+252 90 234 5678',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '4',
    email: 'mohamed@example.com',
    studentId: 'STU12347',
    password: 'password123',
    name: 'Mohamed Ali',
    phone: '+252 90 345 6789',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '5',
    email: 'aisha@example.com',
    studentId: 'STU12348',
    password: 'password123',
    name: 'Aisha Hassan',
    phone: '+252 90 456 7890',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '6',
    email: 'khalil@example.com',
    studentId: 'STU12349',
    password: 'password123',
    name: 'Khalil Ahmed',
    phone: '+252 90 567 8901',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '7',
    email: 'maryam@example.com',
    studentId: 'STU12350',
    password: 'password123',
    name: 'Maryam Omar',
    phone: '+252 90 678 9012',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '8',
    email: 'ibrahim@example.com',
    studentId: 'STU12351',
    password: 'password123',
    name: 'Ibrahim Yusuf',
    phone: '+252 90 789 0123',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '9',
    email: 'khadija@example.com',
    studentId: 'STU12352',
    password: 'password123',
    name: 'Khadija Ali',
    phone: '+252 90 890 1234',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '10',
    email: 'yusuf@example.com',
    studentId: 'STU12353',
    password: 'password123',
    name: 'Yusuf Mohamed',
    phone: '+252 90 901 2345',
    university: 'University of Hargeisa',
    userType: 'student',
  },
  {
    id: '11',
    email: 'amina@example.com',
    studentId: 'STU12354',
    password: 'password123',
    name: 'Amina Hassan',
    phone: '+252 90 012 3456',
    university: 'University of Hargeisa',
    userType: 'student',
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

let bookings = [
  {
    id: '1',
    rideId: '1',
    passengerId: '3',
    passengerName: 'Fatima Mohamed',
    passengerPhone: '+252 90 234 5678',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'University of Hargeisa',
      to: 'City Center',
      fromCoords: { latitude: 9.5632, longitude: 44.0672 },
      toCoords: { latitude: 9.5600, longitude: 44.0600 },
    },
    departureTime: '2024-01-15T08:30:00Z',
    price: 15.50,
    status: 'completed',
    createdAt: '2024-01-15T08:00:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '2',
    rideId: '1',
    passengerId: '4',
    passengerName: 'Mohamed Ali',
    passengerPhone: '+252 90 345 6789',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'University of Hargeisa',
      to: 'Airport',
      fromCoords: { latitude: 9.5632, longitude: 44.0672 },
      toCoords: { latitude: 9.5167, longitude: 44.0833 },
    },
    departureTime: '2024-01-15T14:00:00Z',
    price: 18.75,
    status: 'completed',
    createdAt: '2024-01-15T13:30:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '3',
    rideId: '1',
    passengerId: '5',
    passengerName: 'Aisha Hassan',
    passengerPhone: '+252 90 456 7890',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'City Center',
      to: 'University of Hargeisa',
      fromCoords: { latitude: 9.5600, longitude: 44.0600 },
      toCoords: { latitude: 9.5632, longitude: 44.0672 },
    },
    departureTime: '2024-01-15T16:30:00Z',
    price: 12.00,
    status: 'completed',
    createdAt: '2024-01-15T16:00:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '4',
    rideId: '1',
    passengerId: '6',
    passengerName: 'Khalil Ahmed',
    passengerPhone: '+252 90 567 8901',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'University of Hargeisa',
      to: 'Burao',
      fromCoords: { latitude: 9.5632, longitude: 44.0672 },
      toCoords: { latitude: 9.5221, longitude: 45.5336 },
    },
    departureTime: '2024-01-16T09:00:00Z',
    price: 25.00,
    status: 'completed',
    createdAt: '2024-01-16T08:30:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '5',
    rideId: '1',
    passengerId: '7',
    passengerName: 'Maryam Omar',
    passengerPhone: '+252 90 678 9012',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'Airport',
      to: 'University of Hargeisa',
      fromCoords: { latitude: 9.5167, longitude: 44.0833 },
      toCoords: { latitude: 9.5632, longitude: 44.0672 },
    },
    departureTime: '2024-01-16T11:30:00Z',
    price: 20.50,
    status: 'completed',
    createdAt: '2024-01-16T11:00:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '6',
    rideId: '1',
    passengerId: '8',
    passengerName: 'Ibrahim Yusuf',
    passengerPhone: '+252 90 789 0123',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'University of Hargeisa',
      to: 'City Center',
      fromCoords: { latitude: 9.5632, longitude: 44.0672 },
      toCoords: { latitude: 9.5600, longitude: 44.0600 },
    },
    departureTime: '2024-01-16T15:00:00Z',
    price: 14.25,
    status: 'completed',
    createdAt: '2024-01-16T14:30:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '7',
    rideId: '1',
    passengerId: '9',
    passengerName: 'Khadija Ali',
    passengerPhone: '+252 90 890 1234',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'City Center',
      to: 'University of Hargeisa',
      fromCoords: { latitude: 9.5600, longitude: 44.0600 },
      toCoords: { latitude: 9.5632, longitude: 44.0672 },
    },
    departureTime: '2024-01-17T08:00:00Z',
    price: 16.75,
    status: 'completed',
    createdAt: '2024-01-17T07:30:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '8',
    rideId: '1',
    passengerId: '10',
    passengerName: 'Yusuf Mohamed',
    passengerPhone: '+252 90 901 2345',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'University of Hargeisa',
      to: 'Airport',
      fromCoords: { latitude: 9.5632, longitude: 44.0672 },
      toCoords: { latitude: 9.5167, longitude: 44.0833 },
    },
    departureTime: '2024-01-17T12:00:00Z',
    price: 22.00,
    status: 'completed',
    createdAt: '2024-01-17T11:30:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
  {
    id: '9',
    rideId: '1',
    passengerId: '11',
    passengerName: 'Amina Hassan',
    passengerPhone: '+252 90 012 3456',
    driverId: '2',
    driverName: 'Omar Ali',
    route: {
      from: 'Burao',
      to: 'University of Hargeisa',
      fromCoords: { latitude: 9.5221, longitude: 45.5336 },
      toCoords: { latitude: 9.5632, longitude: 44.0672 },
    },
    departureTime: '2024-01-17T16:00:00Z',
    price: 28.50,
    status: 'completed',
    createdAt: '2024-01-17T15:30:00Z',
    vehicle: {
      model: 'Toyota Noah',
      plate: 'HGA-123',
      color: 'White',
    },
  },
];
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