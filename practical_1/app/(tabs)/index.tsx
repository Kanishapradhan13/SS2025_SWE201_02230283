import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import LanguagePopup from '@/components/LanguagePopup';

// Get screen width for the swiper
const { width } = Dimensions.get('window');

// Splash Screen Component
const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      {/* Top spacing */}
      <View style={{ height: 60 }} />
      
      {/* Gojek Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/gojek.png')} 
          style={styles.gojekLogo}
          resizeMode="contain"
        />
      </View>
      
      {/* From GOTO text */}
      <View style={styles.fromContainer}>
        <ThemedText style={styles.fromText}>from</ThemedText>
        <ThemedText style={styles.gotoText}>goto</ThemedText>
      </View>
      
      {/* Bottom Line */}
      <View style={styles.bottomLine} />
    </View>
  );
};

// Login/Onboarding Screen Component
const LoginScreen = () => {
  // Add router for navigation
  const router = useRouter();
  
  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [languagePopupVisible, setLanguagePopupVisible] = useState(false);
  
  // Get language display name
  const getLanguageDisplay = (code: string) => {
    switch(code) {
      case 'en': return 'English';
      case 'id': return 'Bahasa Indonesia';
      case 'vi': return 'Tiếng Việt';
      default: return 'English';
    }
  };


  // Onboarding content - add your three sets of content here
  const onboardingData = [
    {
      image: require('@/assets/images/gojek_illustration1.png'),
      title: 'Get going with us',
      description: 'Use GoCar to get across town - from anywhere, at any time  '
    },
    {
      image: require('@/assets/images/gojek_illustration2.png'), // Add your second image
      title: 'Welcome to Gojek!',
      description: 'We are your go-to app for hassle-free commutes   '
    },
    {
      image: require('@/assets/images/gojek_illustration3.png'), // Add your third image
      title: 'Rides for all',
      description: 'Up to three stops with every trip - prefect to travel with friends and family'
    }
  ];

  // State to track current page
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle scroll events to update current page
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(contentOffsetX / width);
    setCurrentPage(currentPage);
  };

  // Handle navigation to signup screen
  const handleSignUp = () => {
    router.push('/(tabs)/signup');  
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      {/* Header with logo and language selector */}
      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          <Image 
            source={require('@/assets/images/gojek-logo.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity 
          style={styles.languageButton}
          onPress={() => setLanguagePopupVisible(true)}
        >
          <Text style={styles.languageText}>{getLanguageDisplay(selectedLanguage)} </Text>
        </TouchableOpacity>
      </View>
      
      {/* Swipeable illustration area */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        {onboardingData.map((item, index) => (
          <View key={index} style={[styles.illustrationContainer, { width }]}>
            <Image 
              source={item.image} 
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
      
      {/* Bottom section with text and buttons */}
      <View style={styles.bottomSection}>
        <Text style={styles.heading}>{onboardingData[currentPage].title}</Text>
        <Text style={styles.subheading}>
          {onboardingData[currentPage].description}
        </Text>
        
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.paginationDot, 
                currentPage === index && styles.activeDot
              ]}
              onPress={() => {
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollTo({
                    x: index * width,
                    animated: true
                  });
                }
              }}
            />
          ))}
        </View>
        
        {/* Login button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        
        {/* Sign up button - Added onPress to navigate to signup */}
        <TouchableOpacity 
          style={styles.signupButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signupButtonText}>I'm new, sign me up</Text>
        </TouchableOpacity>
        
        {/* Terms text */}
        <Text style={styles.termsText}>
          By logging in or registering, you agree to our <Text style={styles.greenText}>Terms of service</Text> and <Text style={styles.greenText}>Privacy policy</Text>.
        </Text>
      </View>
      
      {/* Bottom Line */}
      <View style={styles.loginBottomLine} />

      {/* Language selection popup */}
      <LanguagePopup
        visible={languagePopupVisible}
        onClose={() => setLanguagePopupVisible(false)}
        onSelectLanguage={(language) => setSelectedLanguage(language)}
        selectedLanguage={selectedLanguage}
      />
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // Show splash screen for 3 seconds then transition to login screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  // Splash Screen Styles
  splashContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  gojekLogo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  fromContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  fromText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  gotoText: {
    color: '#00AA13',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomLine: {
    width: '50%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 20,
  },
  
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: 10,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 90,
    height: 90,
    marginRight: 4,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  illustration: {
    width: '100%',
    height: 200,
  },
  bottomSection: {
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#00AA13',
  },
  loginButton: {
    backgroundColor: '#00AA13',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#00AA13',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#00AA13',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  greenText: {
    color: '#00AA13',
  },
  loginBottomLine: {
    width: '50%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  }
});