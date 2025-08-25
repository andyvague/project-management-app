export const MONKEYBRAINS_BRANDING = {
  company: {
    name: 'Monkeybrains',
    fullName: 'Monkeybrains.net',
    tagline: 'San Francisco-based ISP since 1998',
    founded: '1998',
    founders: ['Rudy Rucker', 'Alex Menendez'],
    location: 'San Francisco, CA',
    website: 'https://www.monkeybrains.net/',
    description: 'Bringing affordable, hassle-free, month-to-month internet service to residents and businesses of San Francisco with incredible speed-to-cost ratio and quick installation.',
  },
  
  colors: {
    primary: '#1976d2', // Keep existing blue for consistency
    secondary: '#dc004e', // Keep existing red
    accent: '#ff9800', // Orange accent for Monkeybrains
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    
    // Monkeybrains-specific colors
    brand: {
      primary: '#2E7D32', // Green for tech/nature feel
      secondary: '#FF6F00', // Orange for energy/innovation
      accent: '#1565C0', // Deep blue for reliability
      neutral: '#424242', // Dark gray for professional look
    },
    
    // Dark mode variants
    dark: {
      primary: '#4CAF50', // Brighter green for dark mode
      secondary: '#FF9800', // Bright orange
      background: '#121212',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
    },
    
    // Light mode variants
    light: {
      primary: '#2E7D32', // Green
      secondary: '#FF6F00', // Orange
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#212121',
      textSecondary: '#757575',
    }
  },
  
  services: [
    'Residential Service',
    'Business Service', 
    'Event Bandwidth',
    'Business Static IPs',
    'Colocation',
    'MDU Buildouts'
  ],
  
  values: [
    'Affordable Internet',
    'Hassle-free Service',
    'Quick Installation',
    'Personal Support',
    'Net Neutrality',
    'Community Focus'
  ],
  
  stats: {
    locations: '20,000+',
    newLocationsPerWeek: '100+',
    maxSpeed: '300Mbps+',
    yearsOfService: '25+'
  }
};

export const getBrandColors = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? MONKEYBRAINS_BRANDING.colors.dark : MONKEYBRAINS_BRANDING.colors.light;
};
