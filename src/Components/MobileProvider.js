import React, { useState, useEffect, createContext, useContext } from 'react';

// Create the context
const MobileContext = createContext();

// Create a provider component
export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Do your user agent check here
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) || /* check screen ratio for mobile*/ window.innerWidth < window.innerHeight) {
      setIsMobile(true);
    }
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>
      {children}
    </MobileContext.Provider>
  );
}

// Create a hook to use the context
export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}

// In your App component:
// <MobileProvider>
//   <YourRouterOrOtherComponents />
// </MobileProvider>

// In your pages:
// const isMobile = useMobile();
