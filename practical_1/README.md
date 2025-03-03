# Gojek App Clone: UI Development Process Using Expo and Expo Router

1. Project Structure
We organized our app using the following folder structure:

- /app - Contains all route files for Expo Router

  - /(tabs) - Tab-based navigation routes

    - _layout.tsx - Tab navigation configuration
    - index.tsx - Home/landing page
    - signup.tsx - Sign up screen
    - verification-method.tsx - Verification method selection screen
    - verificationcode.tsx - OTP verification screen


- /components - Reusable UI components

  - signup.tsx - Sign up form component
  - VerificationMethodScreen.tsx - Verification method selection UI
  - VerificationCodeScreen.tsx - OTP input UI
  -  CountryCodePopup.tsx - Country code selection popup
  - LanguagePopup.tsx - Language selection popup
  - Various utility components (ThemedText, etc.)


- /assets - Static assets like images

  - /images - App images like logos and illustrations

2. Start the app

   ```bash
    npx expo start
   ```

## Key UI Development Steps

1. Splash Screen Development

- Created a simple splash screen with Gojek logo and "from goto" text
- Added a 3-second timer to transition to the landing page


2. Landing Page with Swipeable Illustrations

- Implemented a swipe-based carousel for onboarding images
- Added pagination dots that update as user swipes
- Created Sign In and Sign Up buttons
- Added language selector in the header


3. Language Selection Popup

- Developed a bottom sheet popup for language selection
- Implemented swipe-down gesture to dismiss
- Added language options with radio button selection


4. Sign Up Screen with Phone Entry

- Created form for entering phone number with country code
- Implemented custom numeric keyboard
- Added conditional button state (enabled when phone number entered)


5. Country Code Selection Popup

- Developed searchable country list
- Implemented sections for "Popular Countries" and "All Countries"
- Added country flags and dial codes


6. Verification Method Selection

- Created a list of verification options (Email, WhatsApp, SMS)
- Added distinctive icons for each method
- Implemented navigation to verification code entry


7. OTP Verification Screen

- Created 4-digit OTP input with auto-focus functionality
- Implemented countdown timer (60 seconds)
- Added "Try another method" option

## Navigation Implementation

We used Expo Router to handle navigation between screens:

```
// Example navigation to sign up screen
router.push('/(tabs)/signup');

// Example navigation with parameters
router.push({
  pathname: '/(tabs)/verification-code',
  params: { method, phoneNumber, countryCode }
} as any);
```

## Challenges and Solutions

- TypeScript Route Type Checking: Used as any to bypass strict route checking when necessary
- Proper File Naming: Ensured route file names matched exactly with navigation paths
- Complex UI Interactions: Implemented custom behaviors like auto-advancing inputs for OTP

The result is a clean, functional UI that closely matches the Gojek app design, with smooth navigation between screens and intuitive user interactions.