import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ScrollView, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../utils/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';

const { width, height } = Dimensions.get('window');

export default function StudentRateExperienceScreen({ navigation, route }) {
  const { booking } = route.params;
  const [rating, setRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({
    punctuality: 0,
    cleanliness: 0,
    communication: 0,
    safety: 0
  });
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useApp();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const starAnimations = useRef([1, 2, 3, 4, 5].map(() => new Animated.Value(0))).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
    
    // Animate stars
    starAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index < selectedRating ? 1 : 0,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleCategoryRating = (category, selectedRating) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: selectedRating
    }));
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before submitting.');
      return;
    }

    setIsLoading(true);
    
    // Success animation
    Animated.spring(successAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Thank You! 🌟',
        'Your rating has been submitted successfully. Your feedback helps us improve the service.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('StudentRideHistory'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      0: 'Tap to rate',
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[rating];
  };

  const getRatingColor = (rating) => {
    const colors = {
      0: Colors.gray400,
      1: Colors.error,
      2: Colors.warning,
      3: Colors.accent,
      4: Colors.secondary,
      5: Colors.success
    };
    return colors[rating];
  };

  const StarRating = ({ rating, onRatingChange, size = 40, animated = false }) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => onRatingChange(star)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.starContainer,
                animated && {
                  transform: [{
                    scale: starAnimations[star - 1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2]
                    })
                  }]
                }
              ]}
            >
              <Ionicons
                name={rating >= star ? "star" : "star-outline"}
                size={size}
                color={rating >= star ? Colors.accent : Colors.gray300}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Submitting your rating..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header title="Rate Experience" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Ionicons name="star" size={48} color={Colors.white} />
              <Text style={styles.heroTitle}>How was your ride?</Text>
              <Text style={styles.heroSubtitle}>Your feedback helps us improve</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.rideCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="car" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Ride Details</Text>
          </View>
          
          <View style={styles.rideInfo}>
            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <View style={styles.routeDot} />
                <Text style={styles.routeText}>{booking.route.from}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, styles.routeDotDestination]} />
                <Text style={styles.routeText}>{booking.route.to}</Text>
              </View>
            </View>
            
            <View style={styles.rideMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar" size={16} color={Colors.gray500} />
                <Text style={styles.metaText}>{formatDate(booking.departureTime)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time" size={16} color={Colors.gray500} />
                <Text style={styles.metaText}>{formatTime(booking.departureTime)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="cash" size={16} color={Colors.success} />
                <Text style={[styles.metaText, styles.priceText]}>${booking.price}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.driverCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Driver Information</Text>
          </View>
          
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={32} color={Colors.white} />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{booking.driverName}</Text>
              <Text style={styles.vehicleInfo}>
                {booking.vehicle?.model || 'Vehicle'} • {booking.vehicle?.plate || 'Plate'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.ratingCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="star" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Overall Experience</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <StarRating 
              rating={rating} 
              onRatingChange={handleRating}
              size={50}
              animated={true}
            />
            
            <Animated.Text 
              style={[
                styles.ratingText,
                { color: getRatingColor(rating) }
              ]}
            >
              {getRatingText(rating)}
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.categoriesCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="list" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Rate Specific Aspects</Text>
          </View>
          
          {Object.entries(categoryRatings).map(([category, categoryRating]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryLabel}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <Text style={styles.categorySubtext}>
                  {getRatingText(categoryRating)}
                </Text>
              </View>
              <StarRating 
                rating={categoryRating} 
                onRatingChange={(rating) => handleCategoryRating(category, rating)}
                size={24}
              />
            </View>
          ))}
        </Animated.View>

        <Animated.View
          style={[
            styles.commentCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="chatbubble" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Share Your Experience</Text>
          </View>
          
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us about your ride experience... (Optional)"
            placeholderTextColor={Colors.gray400}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.submitContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              rating === 0 && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmitRating}
            disabled={rating === 0}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={rating === 0 ? [Colors.gray300, Colors.gray400] : [Colors.success, Colors.secondary]}
              style={styles.submitGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color={Colors.white} />
              <Text style={styles.submitButtonText}>Submit Rating</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing['3xl'],
  },
  heroSection: {
    marginBottom: Spacing.lg,
  },
  heroGradient: {
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.white,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.lg,
    color: Colors.white,
    opacity: 0.9,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  rideCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  driverCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  ratingCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  categoriesCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  commentCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  rideInfo: {
    alignItems: 'center',
  },
  routeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  routeDotDestination: {
    backgroundColor: Colors.success,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.gray300,
    marginVertical: Spacing.xs,
  },
  routeText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  rideMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginLeft: Spacing.xs,
  },
  priceText: {
    color: Colors.success,
    fontWeight: Typography.semibold,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  vehicleInfo: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  starButton: {
    padding: Spacing.sm,
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  categorySubtext: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  commentInput: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  submitContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  submitButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    marginLeft: Spacing.sm,
  },
});
