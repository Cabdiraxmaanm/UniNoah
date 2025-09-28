import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Animated, Alert, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../utils/AppContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../styles/DesignSystem';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StudentSupportScreen({ navigation }) {
  const { user } = useApp();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContactSupport = () => {
    Alert.alert(
      '📞 Contact Support',
      'Choose how you\'d like to reach us:',
      [
        { 
          text: '📧 Email', 
          onPress: () => Linking.openURL('mailto:uninoaha@gmail.com?subject=Support Request&body=Hello UniNoah Support Team,\n\nI need help with:\n\n') 
        },
        { 
          text: '📱 Phone', 
          onPress: () => Linking.openURL('tel:+252634065954') 
        },
        { 
          text: '💬 WhatsApp', 
          onPress: () => Linking.openURL('https://wa.me/252634065954?text=Hello, I need help with UniNoah app') 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      '🐛 Report an Issue',
      'What type of issue are you experiencing?',
      [
        { text: 'App Crashes', onPress: () => reportIssue('App Crashes') },
        { text: 'Booking Problems', onPress: () => reportIssue('Booking Problems') },
        { text: 'Payment Issues', onPress: () => reportIssue('Payment Issues') },
        { text: 'Driver Issues', onPress: () => reportIssue('Driver Issues') },
        { text: 'Other', onPress: () => reportIssue('Other') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const reportIssue = (issueType) => {
    Alert.alert(
      'Issue Reported',
      `Thank you for reporting: ${issueType}\n\nWe've received your report and will investigate this issue. You'll receive an email update within 24 hours.`,
      [{ text: 'OK' }]
    );
  };

  const handleLiveChatSupport = () => {
    Alert.alert(
      '💬 Live Chat Support',
      'Connect with our support team for immediate assistance.',
      [
        { text: 'Start Chat', onPress: () => Alert.alert('Live Chat', 'Live chat feature coming soon! For immediate help, please call us.') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEmergencySupport = () => {
    Alert.alert(
      '🚨 Emergency Support',
      'This is for urgent safety issues during rides only.',
      [
        { 
          text: 'Call Emergency', 
          onPress: () => Linking.openURL('tel:911'),
          style: 'destructive'
        },
        { 
          text: 'Call UniNoah Emergency', 
          onPress: () => Linking.openURL('tel:+252634065954') 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I book a ride?",
      answer: "1. Go to 'Find Rides' tab\n2. Search for available rides\n3. Select your preferred ride\n4. Review details and confirm booking\n5. Wait for driver confirmation"
    },
    {
      question: "What if my ride is cancelled?",
      answer: "If a ride is cancelled, you'll receive an immediate notification. You can:\n• Find alternative rides\n• Request a refund if paid\n• Contact the driver for explanation"
    },
    {
      question: "How do I contact my driver?",
      answer: "Once your ride is confirmed:\n• Go to 'Live Tracking'\n• Tap 'Contact Driver' button\n• Choose call or message option"
    },
    {
      question: "What are the payment options?",
      answer: "Currently supported:\n• Cash payment to driver\n• Mobile money (Coming soon)\n• Credit/Debit cards (Coming soon)"
    },
    {
      question: "How do I rate my experience?",
      answer: "After completing a ride:\n• You'll receive a rating prompt\n• Rate from 1-5 stars\n• Add optional feedback\n• Submit your review"
    }
  ];

  const renderSupportOption = (icon, title, subtitle, onPress, color = Colors.primary) => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity style={styles.supportOption} onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.supportOptionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.supportOptionContent}>
            <View style={[styles.supportIconContainer, { backgroundColor: color + '15' }]}>
              <LinearGradient
                colors={[color, color + 'CC']}
                style={styles.supportIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={icon} size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={styles.supportOptionText}>
              <Text style={styles.supportOptionTitle}>{title}</Text>
              <Text style={styles.supportOptionSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.supportOptionArrow}>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFAQ = (item, index) => (
    <Animated.View
      key={index}
      style={[
        styles.faqItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.faqQuestion} 
        onPress={() => toggleFAQ(index)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={expandedFAQ === index ? Colors.gradients.primary : ['#FFFFFF', '#F8FAFC']}
          style={styles.faqQuestionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.faqQuestionContent}>
            <Text style={[
              styles.faqQuestionText,
              { color: expandedFAQ === index ? '#FFFFFF' : Colors.textPrimary }
            ]}>
              {item.question}
            </Text>
            <Ionicons 
              name={expandedFAQ === index ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={expandedFAQ === index ? '#FFFFFF' : Colors.primary} 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {expandedFAQ === index && (
        <Animated.View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003B73" />
      
      {/* Header Section */}
      <Animated.View
        style={[
          {
            transform: [{ translateY: headerSlideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#003B73', '#0074D9', '#00BFFF']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <View style={styles.backButtonContainer}>
                  <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Help & Support</Text>
              <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencySupport}>
                <Ionicons name="warning" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            {/* Support Hero */}
            <Animated.View 
              style={[
                styles.supportHero,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.supportHeroIcon}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.heroIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="headset" size={48} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <Text style={styles.supportHeroTitle}>We're here to help!</Text>
              <Text style={styles.supportHeroSubtitle}>Get assistance with rides, bookings, and more</Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Support Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Support</Text>
          {renderSupportOption('call', 'Contact Support', 'Call or message our support team', handleContactSupport, Colors.primary)}
          {renderSupportOption('chatbubbles', 'Live Chat', 'Chat with support agent (24/7)', handleLiveChatSupport, Colors.secondary)}
          {renderSupportOption('bug', 'Report Issue', 'Report a problem or bug', handleReportIssue, Colors.error)}
          {renderSupportOption('shield-checkmark', 'Safety Center', 'Emergency contacts and safety tips', handleEmergencySupport, Colors.warning)}
        </View>

        {/* FAQ Section removed per request */}

        {/* App Information */}
        <Animated.View 
          style={[
            styles.appInfoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#F8FAFC', '#E2E8F0']}
            style={styles.appInfoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.appInfoContent}>
              <View style={styles.appInfoHeader}>
                <View style={styles.appIcon}>
                  <LinearGradient
                    colors={Colors.gradients.primary}
                    style={styles.appIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="car" size={32} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.appDetails}>
                  <Text style={styles.appName}>UniNoah</Text>
                  <Text style={styles.appVersion}>Version 1.0.0</Text>
                  <Text style={styles.appDescription}>University Ride Sharing</Text>
                </View>
              </View>
              
              <View style={styles.appStats}>
                <View style={styles.appStat}>
                  <Text style={styles.appStatNumber}>1000+</Text>
                  <Text style={styles.appStatLabel}>Students</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.appStat}>
                  <Text style={styles.appStatNumber}>500+</Text>
                  <Text style={styles.appStatLabel}>Drivers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.appStat}>
                  <Text style={styles.appStatNumber}>5000+</Text>
                  <Text style={styles.appStatLabel}>Rides</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          {renderSupportOption('document-text', 'User Guide', 'Learn how to use UniNoah effectively', () => Alert.alert('User Guide', 'User guide coming soon!'), Colors.accent)}
          {renderSupportOption('people', 'Community', 'Join our student community forum', () => Alert.alert('Community', 'Community forum coming soon!'), Colors.secondary)}
          {renderSupportOption('star', 'Rate UniNoah', 'Share your feedback on app stores', () => Alert.alert('Rate App', 'Thank you! Rating feature coming soon!'), Colors.warning)}
        </View>

        {/* Contact Information */}
        <Animated.View 
          style={[
            styles.contactSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={Colors.gradients.secondary}
            style={styles.contactGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Need More Help?</Text>
              <Text style={styles.contactSubtitle}>Our support team is available 24/7</Text>
              
              <View style={styles.contactMethods}>
                <View style={styles.contactMethod}>
                  <Ionicons name="mail" size={16} color="#FFFFFF" />
                  <Text style={styles.contactText}>uninoaha@gmail.com</Text>
                </View>
                <View style={styles.contactMethod}>
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                  <Text style={styles.contactText}>+252 63 4065954</Text>
                </View>
                <View style={styles.contactMethod}>
                  <Ionicons name="time" size={16} color="#FFFFFF" />
                  <Text style={styles.contactText}>Available 24/7</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header Styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Shadows.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  backButton: {
    padding: 4,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  emergencyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Support Hero
  supportHero: {
    alignItems: 'center',
    width: '100%',
  },
  supportHeroIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.lg,
  },
  heroIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportHeroTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  supportHeroSubtitle: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 25,
    paddingBottom: 100,
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  
  // Support Options
  supportOption: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...Shadows.sm,
  },
  supportOptionGradient: {
    padding: 18,
  },
  supportOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 16,
    ...Shadows.sm,
  },
  supportIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportOptionText: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  supportOptionSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  supportOptionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // FAQ Styles
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  faqQuestion: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqQuestionGradient: {
    padding: 16,
  },
  faqQuestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestionText: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    flex: 1,
    letterSpacing: 0.2,
  },
  faqAnswer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  faqAnswerText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  
  // App Info Section
  appInfoSection: {
    marginBottom: 32,
  },
  appInfoGradient: {
    borderRadius: 20,
    padding: 24,
    ...Shadows.md,
  },
  appInfoContent: {
    alignItems: 'center',
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
    ...Shadows.md,
  },
  appIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  appDescription: {
    fontSize: Typography.sm,
    color: Colors.textTertiary,
  },
  appStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
  },
  appStat: {
    alignItems: 'center',
    flex: 1,
  },
  appStatNumber: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  appStatLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.gray300,
  },
  
  // Contact Section
  contactSection: {
    marginBottom: 20,
  },
  contactGradient: {
    borderRadius: 20,
    padding: 24,
    ...Shadows.md,
  },
  contactContent: {
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactMethods: {
    width: '100%',
    gap: 12,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactText: {
    fontSize: Typography.sm,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: Typography.medium,
  },
});
