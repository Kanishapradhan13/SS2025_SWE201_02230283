import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import CountryCodePopup from './CountryCodePopup';

// Country interface
interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const SignupScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCodePopupVisible, setCountryCodePopupVisible] = useState(false);
  
  // Default to Singapore
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    dialCode: '+65'
  });

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Handle continue button press
  const handleContinue = () => {
    // Add validation here if needed
    console.log('Continue with phone number:', selectedCountry.dialCode + phoneNumber);
    // Navigate to the next screen in your flow
    // router.push('/verification'); // Uncomment when you have this route
  };

  // Handle issue with number press
  const handleIssueWithNumber = () => {
    console.log('User has issue with number');
    // Implement your logic for handling number issues
  };

  // Handle number input (simulating a keyboard)
  const handleNumberInput = (num: string) => {
    if (num === 'backspace') {
      setPhoneNumber(phoneNumber.slice(0, -1));
    } else {
      setPhoneNumber(phoneNumber + num);
    }
  };

  // Handle country selection
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonText}>?</Text>
              </TouchableOpacity>
              <View style={styles.languageContainer}>
                <Text style={styles.languageText}>English </Text>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Gojek!</Text>
            <Text style={styles.subtitle}>Enter or create an account in a few easy steps.</Text>
            
            {/* Phone Number Input */}
            <View style={styles.phoneInputContainer}>
              <Text style={styles.phoneLabel}>Phone number*</Text>
              <View style={styles.phoneInputWrapper}>
                {/* Country Code Selector - Now touchable */}
                <TouchableOpacity 
                  style={styles.countryCodeContainer}
                  onPress={() => setCountryCodePopupVisible(true)}
                >
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="92325933"
                  placeholderTextColor="#aaa"
                />
                {phoneNumber.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setPhoneNumber('')}
                  >
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            {/* Continue Button */}
            <TouchableOpacity 
              style={[
                styles.continueButton, 
                phoneNumber.length > 0 ? styles.continueButtonActive : {}
              ]}
              onPress={handleContinue}
              disabled={phoneNumber.length === 0}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
            
            {/* Terms and Conditions */}
            <Text style={styles.termsText}>
              I agree to Gojek's <Text style={styles.termsLink}>Terms of Service</Text> & <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
            
            {/* Issue with number */}
            <TouchableOpacity onPress={handleIssueWithNumber}>
              <Text style={styles.issueText}>Issue with number?</Text>
            </TouchableOpacity>
            
            {/* GOTO Logo */}
            <View style={styles.gotoContainer}>
    
              <Image 
                source={require('@/assets/images/goto-logo.png')} 
                style={styles.gotoLogo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Custom Keyboard */}
          <View style={styles.keyboard}>
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('1')}>
                <Text style={styles.keyboardKeyText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('2')}>
                <Text style={styles.keyboardKeyText}>2</Text>
                <Text style={styles.keyboardKeySubText}>ABC </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('3')}>
                <Text style={styles.keyboardKeyText}>3</Text>
                <Text style={styles.keyboardKeySubText}>DEF</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('4')}>
                <Text style={styles.keyboardKeyText}>4</Text>
                <Text style={styles.keyboardKeySubText}>GHI </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('5')}>
                <Text style={styles.keyboardKeyText}>5</Text>
                <Text style={styles.keyboardKeySubText}>JKL </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('6')}>
                <Text style={styles.keyboardKeyText}>6</Text>
                <Text style={styles.keyboardKeySubText}>MNO</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyboardRow}>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('7')}>
                <Text style={styles.keyboardKeyText}>7</Text>
                <Text style={styles.keyboardKeySubText}>PQRS </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('8')}>
                <Text style={styles.keyboardKeyText}>8</Text>
                <Text style={styles.keyboardKeySubText}>TUV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('9')}>
                <Text style={styles.keyboardKeyText}>9</Text>
                <Text style={styles.keyboardKeySubText}>WXYZ</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.keyboardRow}>
              <View style={styles.emptyKey}></View>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('0')}>
                <Text style={styles.keyboardKeyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.keyboardKey} onPress={() => handleNumberInput('backspace')}>
                <Text style={styles.backspaceText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Country Code Popup */}
      <CountryCodePopup
        visible={countryCodePopupVisible}
        onClose={() => setCountryCodePopupVisible(false)}
        onSelectCountry={handleSelectCountry}
        selectedCountryCode={selectedCountry.code}
      />
    </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  languageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageText: {
    fontSize: 12,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 24,
  },
  phoneInputContainer: {
    marginBottom: 24,
  },
  phoneLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  countryFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  continueButton: {
    backgroundColor: '#cccccc',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonActive: {
    backgroundColor: '#00AA13',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',
    marginBottom: 16,
  },
  termsLink: {
    color: '#00AA13',
  },
  issueText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
    marginBottom: 24,
  },
  gotoContainer: {
    alignItems: 'center',
  },
  gotoLogo: {
    height: 24,
    width: 80,
  },
  keyboard: {
    backgroundColor: '#d1d5db',
    paddingTop: 5,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    paddingHorizontal: 1,
  },
  keyboardKey: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 0.5,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardKeyText: {
    fontSize: 20,
    color: '#333',
  },
  keyboardKeySubText: {
    fontSize: 10,
    color: '#666',
  },
  emptyKey: {
    flex: 1,
    backgroundColor: '#d1d5db',
    marginHorizontal: 0.5,
  },
  backspaceText: {
    fontSize: 18,
    color: '#333',
  },
});

export default SignupScreen;