import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  SafeAreaView,
  StatusBar,
  Pressable,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';

// Country interface
interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

// Component props
interface CountryCodePopupProps {
  visible: boolean;
  onClose: () => void;
  onSelectCountry: (country: Country) => void;
  selectedCountryCode: string;
}

// Get screen dimensions
const { height } = Dimensions.get('window');

// Sample countries data with flags, names, and dial codes
const countries: Country[] = [
  // Popular countries section
  { name: 'Indonesia ', code: 'ID', flag: '🇮🇩', dialCode: '+62 ' },
  { name: 'Vietnam ', code: 'VN', flag: '🇻🇳', dialCode: '+84 ' },
  { name: 'Singapore ', code: 'SG ', flag: '🇸🇬', dialCode: '+65 ' },
  
  // All countries section (alphabetical)
  { name: 'Afghanistan ', code: 'AF', flag: '🇦🇫', dialCode: '+93 ' },
  { name: 'Albania ', code: 'AL', flag: '🇦🇱', dialCode: '+355 ' },
  { name: 'Algeria ', code: 'DZ', flag: '🇩🇿', dialCode: '+213 ' },
  { name: 'American Samoa ', code: 'AS', flag: '🇦🇸', dialCode: '+1' },
  { name: 'Andorra ', code: 'AD', flag: '🇦🇩', dialCode: '+376 ' },
  { name: 'Angola ', code: 'AO', flag: '🇦🇴', dialCode: '+244 ' },
  { name: 'Anguilla ', code: 'AI', flag: '🇦🇮', dialCode: '+1' },
  { name: 'Antarctica ', code: 'AQ', flag: '🇦🇶', dialCode: '+672 ' },
  { name: 'Antigua and Barbuda ', code: 'AG', flag: '🇦🇬', dialCode: '+1' },
  { name: 'Argentina ', code: 'AR', flag: '🇦🇷', dialCode: '+54 ' },
  { name: 'American Samoa ', code: 'AS', flag: '🇦🇸', dialCode: '+1' },
  { name: 'Andorra ', code: 'AD', flag: '🇦🇩', dialCode: '+376 ' },
  { name: 'Angola ', code: 'AO', flag: '🇦🇴', dialCode: '+244 ' },
  { name: 'Anguilla ', code: 'AI', flag: '🇦🇮', dialCode: '+1' },
  { name: 'Antarctica ' , code: 'AQ', flag: '🇦🇶', dialCode: '+672 ' },
  { name: 'Antigua and Barbuda ', code: 'AG', flag: '🇦🇬', dialCode: '+1' },
  { name: 'Argentina' , code: 'AR', flag: '🇦🇷', dialCode: '+54 ' },
  
];

const CountryCodePopup: React.FC<CountryCodePopupProps> = ({ 
  visible, 
  onClose, 
  onSelectCountry,
  selectedCountryCode 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const translateY = new Animated.Value(visible ? 0 : height);
  
  // Animation for showing/hiding the popup
  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      speed: 12,
      bounciness: 4
    }).start();
  }, [visible]);

  // Set up pan responder for swipe-down gesture
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // If swipe distance is greater than 50, close the popup
          onClose();
        } else {
          // Otherwise, animate back to open position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 12,
            bounciness: 4
          }).start();
        }
      }
    })
  ).current;
  
  // Filter countries based on search query
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get popular countries
  const popularCountries = countries.slice(0, 3);
  
  // Separate all other countries
  const allCountries = countries.slice(3);
  
  // Render section header
  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
  
  // Render country item
  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity 
      style={styles.countryItem}
      onPress={() => {
        onSelectCountry(item);
        onClose();
      }}
    >
      <View style={styles.countryInfo}>
        <Text style={styles.countryFlag}>{item.flag}</Text>
        <Text style={styles.countryName}>{item.name}</Text>
      </View>
      <Text style={styles.dialCode}>{item.dialCode}</Text>
    </TouchableOpacity>
  );
  
  // Render list items with sections
  const renderListItems = () => {
    if (searchQuery) {
      return filteredCountries.map((country, index) => renderCountryItem({ item: country }));
    } else {
      return (
        <>
          {renderSectionHeader('Popular countries')}
          {popularCountries.map((country) => renderCountryItem({ item: country }))}
          {renderSectionHeader('All countries')}
          {allCountries.map((country) => renderCountryItem({ item: country }))}
        </>
      );
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" />
        
        <Animated.View 
          style={[
            styles.container,
            { transform: [{ translateY }] }
          ]}
        >
          {/* Swipe handle */}
          <View 
            {...panResponder.panHandlers}
            style={styles.swipeHandle}
          >
            <View style={styles.swipeIndicator} />
          </View>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Search country code</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Type country name or country code"
                placeholderTextColor="#999"
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <FlatList
            data={[]} // We're using custom render instead
            renderItem={null}
            ListHeaderComponent={<View>{renderListItems()}</View>}
            style={styles.list}
          />
        </Animated.View>
        
        {/* Background overlay to close on tap outside */}
        <Pressable 
          style={styles.backdrop} 
          onPress={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '90%',
    zIndex: 1,
  },
  swipeHandle: {
    height: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
  list: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#666',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    fontSize: 14,
    color: '#333',
  },
  dialCode: {
    fontSize: 14,
    color: '#666',
  },
});

export default CountryCodePopup;