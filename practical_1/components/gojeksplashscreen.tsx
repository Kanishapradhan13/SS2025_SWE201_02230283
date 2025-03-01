import React from 'react';

interface GojekSplashScreenProps {
  // You can add props here if needed
}

const GojekSplashScreen: React.FC<GojekSplashScreenProps> = () => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: 'white',
        padding: '20px 0',
        boxSizing: 'border-box'
      }}
    >
      {/* Top spacing */}
      <div style={{ height: '60px' }}></div>
      
      {/* Gojek Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src="/assets/images/gojek.png" 
          alt="Gojek Logo"
          style={{
            width: '60px',
            height: '60px',
            marginBottom: '10px'
          }}
        />
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4A4A4A' }}>
          gojek
        </div>
      </div>
      
      {/* From GOTO text */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
          from
        </div>
        <div style={{ color: '#00AA13', fontSize: '18px', fontWeight: 'bold' }}>
          goto
        </div>
      </div>
      
      {/* Bottom Line */}
      <div 
        style={{
          width: '50%',
          height: '4px',
          backgroundColor: '#333',
          borderRadius: '2px'
        }}
      />
    </div>
  );
};

export default GojekSplashScreen;

// Usage example
// import GojekSplashScreen from './GojekSplashScreen';
// 
// function App() {
//   return <GojekSplashScreen />;
// }