# UniNoah - University Ride-Sharing App

A comprehensive React Native mobile application designed for university students in Somaliland to connect with drivers for transportation between different university campuses.

## 🚀 Features

### For Students
- **User Authentication**: Secure sign-up and login with student credentials
- **Ride Search**: Browse available rides with detailed information
- **Booking System**: Reserve seats on available rides with confirmation
- **Live Tracking**: Real-time GPS tracking of booked rides
- **Ride History**: View past rides and booking status
- **Driver Rating**: Rate drivers after completed rides
- **Contact Drivers**: Direct communication with drivers

### For Drivers
- **Driver Registration**: Complete profile setup with vehicle information
- **Availability Management**: Set availability and create rides
- **Route Management**: Define pickup and destination locations
- **Request Management**: Accept or reject incoming ride requests
- **Booking Management**: View and manage confirmed bookings
- **Navigation Support**: Built-in navigation with route guidance
- **Ride Status Updates**: Start, complete, or cancel rides

### General Features
- **Interactive Maps**: Real-time location tracking and route visualization
- **University Integration**: Specifically designed for Somaliland universities
- **Modern UI/UX**: Clean, intuitive interface with smooth navigation
- **Offline Support**: Basic offline functionality with data persistence
- **Real-time Updates**: Live status updates and notifications

## 🏛️ Supported Universities

- University of Hargeisa
- Amoud University (Borama)
- Burao University
- Gollis University
- Edna Adan University

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7
- **State Management**: React Context API with useReducer
- **Maps**: React Native Maps
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom components with Linear Gradients
- **Platform**: Cross-platform (iOS, Android, Web)

## 📱 App Structure

```
UniNoah/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── LoadingSpinner.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── Student/
│   │   │   ├── StudentAuthScreen.js
│   │   │   ├── StudentSearchRidesScreen.js
│   │   │   ├── StudentBookRideScreen.js
│   │   │   ├── StudentLiveTrackingScreen.js
│   │   │   ├── StudentRateDriverScreen.js
│   │   │   └── StudentRideHistoryScreen.js
│   │   ├── Driver/
│   │   │   ├── DriverAuthScreen.js
│   │   │   ├── DriverSetAvailabilityScreen.js
│   │   │   ├── DriverRequestsScreen.js
│   │   │   ├── DriverBookingsScreen.js
│   │   │   └── DriverNavigationScreen.js
│   │   ├── HomeScreen.js
│   │   ├── SignUpScreen.js
│   │   └── SplashScreen.js
│   ├── services/
│   │   └── api.js
│   └── utils/
│       └── AppContext.js
├── assets/
├── App.js
├── app.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UniNoah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## 🔧 Configuration

### Environment Setup

The app uses mock data for demonstration purposes. In a production environment, you would need to:

1. Set up a backend server
2. Configure real API endpoints
3. Set up push notifications
4. Configure Google Maps API keys
5. Set up payment processing

### API Configuration

Update the API endpoints in `src/services/api.js` to connect to your backend server.

## 📱 Usage

### Student Flow

1. **Sign Up/Login**: Create account or login with student credentials
2. **Search Rides**: Browse available rides between universities
3. **Book Ride**: Select a ride and confirm booking
4. **Track Ride**: Monitor driver location in real-time
5. **Rate Driver**: Provide feedback after ride completion

### Driver Flow

1. **Registration**: Complete driver profile with vehicle details
2. **Set Availability**: Create rides with routes and pricing
3. **Manage Requests**: Accept or reject student booking requests
4. **Navigate**: Use built-in navigation for ride completion
5. **Update Status**: Mark ride completion and manage bookings

## 🎨 Design System

### Color Palette
- **Primary Blue**: #003B73
- **Secondary Blue**: #0074D9
- **Accent Blue**: #00BFFF
- **Success Green**: #2ECC40
- **Warning Orange**: #F39C12
- **Error Red**: #E74C3C

### Typography
- **Headers**: Bold, 18-28px
- **Body Text**: Regular, 14-16px
- **Captions**: Light, 12-14px

## 🔒 Security Features

- Secure authentication system
- Data validation and sanitization
- Protected API endpoints
- Local data encryption
- Session management

## 📊 Performance Optimizations

- Lazy loading of components
- Image optimization
- Efficient state management
- Minimal re-renders
- Optimized navigation

## 🧪 Testing

The app includes comprehensive testing for:
- User authentication flows
- Ride booking processes
- Navigation functionality
- State management
- API integration

## 🚀 Deployment

### Expo Build

1. **Configure app.json** with your app details
2. **Build for production**:
   ```bash
   expo build:android
   expo build:ios
   ```

### App Store Deployment

1. **Generate app store assets**
2. **Submit to App Store Connect**
3. **Configure app store metadata**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Payment Integration**: Secure payment processing
- **Push Notifications**: Real-time ride updates
- **Chat System**: In-app messaging between users
- **Analytics Dashboard**: Driver and student insights
- **Multi-language Support**: Somali and English
- **Advanced Routing**: Optimized route suggestions
- **Emergency Features**: Safety and emergency contacts

## 📈 Business Model

UniNoah operates on a commission-based model:
- Students pay drivers directly
- Platform takes a small commission
- Transparent pricing structure
- Driver earnings optimization

---

**Built with ❤️ for the Somaliland university community** 