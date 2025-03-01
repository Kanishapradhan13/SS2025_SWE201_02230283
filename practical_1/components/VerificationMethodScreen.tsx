import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const VerificationMethodScreen = () => {
  // Get phone number from route params
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string || '';
  const countryCode = params.countryCode as string || '';

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Handle method selection
  const handleSelectMethod = (method: 'email' | 'whatsapp' | 'sms') => {
    console.log(`Selected verification via ${method}`);
    // Navigate to the verification code entry screen with the selected method
    // router.push({
    //   pathname: '/verification-code',
    //   params: { method, phoneNumber, countryCode }
    // });
  };

  // Handle help button press
  const handleHelp = () => {
    console.log('Help requested');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Choose verification method</Text>
          
          {/* Verification Methods */}
          <View style={styles.methodsContainer}>
            {/* Email Method */}
            <TouchableOpacity 
              style={styles.methodItem}
              onPress={() => handleSelectMethod('email')}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, styles.emailIcon]}>
                  <Text style={styles.methodIconText}>✉️</Text>
                </View>
                <Text style={styles.methodText}>OTP via E-mail </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            {/* WhatsApp Method */}
            <TouchableOpacity 
              style={styles.methodItem}
              onPress={() => handleSelectMethod('whatsapp')}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, styles.whatsappIcon]}>
                  <Text style={styles.methodIconText}>📱</Text>
                </View>
                <Text style={styles.methodText}>OTP via WhatsApp </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            {/* SMS Method */}
            <TouchableOpacity 
              style={styles.methodItem}
              onPress={() => handleSelectMethod('sms')}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, styles.smsIcon]}>
                  <Text style={styles.methodIconText}>💬</Text>
                </View>
                <Text style={styles.methodText}>OTP via SMS </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Image 
          source={require('@/assets/images/goto-logo.png')} 
          style={styles.footerLogo}
          resizeMode="contain"
        />
      </View>
      
      {/* Bottom divider */}
      <View style={styles.bottomDivider} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  methodsContainer: {
    marginTop: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailIcon: {
    backgroundColor: '#E3F2FD',
  },
  whatsappIcon: {
    backgroundColor: '#E8F5E9',
  },
  smsIcon: {
    backgroundColor: '#FFF8E1',
  },
  methodIconText: {
    fontSize: 20,
  },
  methodText: {
    fontSize: 16,
    color: '#333',
  },
  chevron: {
    fontSize: 24,
    color: '#999',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerLogo: {
    height: 40,
    width: 70,
  },
  bottomDivider: {
    width: '25%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
});

export default VerificationMethodScreen;