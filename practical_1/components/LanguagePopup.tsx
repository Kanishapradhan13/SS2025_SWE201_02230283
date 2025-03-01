import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

// Define the props interface
interface LanguagePopupProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
  selectedLanguage: string;
}

// Available languages - matching the screenshot
const languages = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'vi', name: 'Tiếng Việt' }
];

const LanguagePopup: React.FC<LanguagePopupProps> = ({ 
  visible, 
  onClose, 
  onSelectLanguage,
  selectedLanguage 
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popup}>
              {/* Close button */}
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              
              {/* Popup header */}
              <View style={styles.header}>
                <Text style={styles.title}>Change language</Text>
                <Text style={styles.subtitle}>Which language do you prefer?</Text>
              </View>
              
              {/* Language options */}
              <View style={styles.languageOptions}>
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={styles.languageOption}
                    onPress={() => {
                      onSelectLanguage(language.code);
                    }}
                  >
                    <View style={styles.languageRow}>
                      <Text style={styles.languageText}>{language.name}</Text>
                      <View style={[
                        styles.radioButton,
                        selectedLanguage === language.code && styles.radioButtonSelected
                      ]}>
                        {selectedLanguage === language.code && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Continue button */}
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={onClose}
              >
                <Text style={styles.continueButtonText}>
                  Continue in {languages.find(lang => lang.code === selectedLanguage)?.name}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Align to bottom
  },
  popup: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    position: 'relative',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  languageOptions: {
    marginBottom: 20,
  },
  languageOption: {
    paddingVertical: 15,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#00AA13',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00AA13',
  },
  continueButton: {
    backgroundColor: '#00AA13',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguagePopup;