import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  TextInput,
  Keyboard
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const VerificationCodeScreen = () => {
  // Get parameters from route
  const params = useLocalSearchParams();
  const method = params.method as string || 'email';
  const email = 'douglaswm1@gmail.com'; // This would come from params or an API

  // State for OTP code input
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Refs for TextInputs to handle focus
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
  
  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer]);
  
  // Format timer display as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Handle help button press
  const handleHelp = () => {
    console.log('Help requested');
  };
  
  // Handle OTP input changes
  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste of full OTP
      const otpArray = text.split('').slice(0, 4);
      setOtp(prev => {
        const newOtp = [...prev];
        otpArray.forEach((digit, i) => {
          if (i < 4) newOtp[i] = digit;
        });
        return newOtp;
      });
      
      // Focus last input if we have all 4 digits
      if (otpArray.length >= 4 && inputRefs.current[3]) {
        inputRefs.current[3]?.focus();
      }
    } else {
      // Handle single digit input
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Auto-advance to next input
      if (text !== '' && index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  
  // Handle backspace key for OTP inputs
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      // Move to previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Try another verification method
  const handleTryAnotherMethod = () => {
    router.back(); // Go back to verification method selection
  };

  // Calculate if the OTP is complete (all fields filled)
  const isOtpComplete = otp.every(digit => digit !== '');

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
      <View style={styles.content}>
        <Text style={styles.title}>
          Enter OTP sent via E-Mail
        </Text>
        
        <Text style={styles.subtitle}>
          We've sent OTP to {email}
        </Text>
        
        {/* OTP Input Row */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>OTP *</Text>
          
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => inputRefs.current[index] = el}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>
          
          {/* Timer */}
          <Text style={[
            styles.timer,
            timer < 10 && styles.timerWarning
          ]}>
            {formatTime(timer)}
          </Text>
        </View>
        
        {/* Try another method button */}
        <TouchableOpacity 
          onPress={handleTryAnotherMethod}
          style={styles.tryAnotherButton}
        >
          <Text style={styles.tryAnotherText}>Try another method</Text>
        </TouchableOpacity>
      </View>
      
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
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 20,
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
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timer: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#00AA13',
    fontWeight: 'bold',
  },
  timerWarning: {
    color: '#FF6B6B',
  },
  tryAnotherButton: {
    marginTop: 16,
  },
  tryAnotherText: {
    fontSize: 14,
    color: '#333',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  footerLogo: {
    height: 30,
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

export default VerificationCodeScreen;