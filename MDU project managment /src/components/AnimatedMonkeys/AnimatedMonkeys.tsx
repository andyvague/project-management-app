import React from 'react';
import { Box, keyframes } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMonkeyContext } from '../../context/MonkeyContext';

/**
 * AnimatedMonkeys Component
 * 
 * This component creates a fun animation of 5 monkeys running across the top of the page.
 * Each monkey has unique animations, colors, and timing to create a lively effect.
 * 
 * Features:
 * - 5 different colored monkeys with unique animations
 * - Staggered timing so monkeys don't all start at once
 * - Different animation styles (bounce, swing, wave)
 * - Responsive design that works on all screen sizes
 * - Toggle functionality through MonkeyContext
 */

// Keyframe animations for the monkeys

/**
 * runAcross: Makes monkeys run from left to right across the entire screen
 * Starts 100px off-screen left and ends 100px off-screen right
 * Uses viewport width (100vw) to ensure full screen coverage
 */
const runAcross = keyframes`
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(calc(100vw + 100px));
  }
`;

/**
 * bounce: Creates a gentle bouncing effect for monkeys
 * Moves them up and down in a smooth, natural motion
 */
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

/**
 * swing: Creates a swinging motion for monkeys
 * Rotates them slightly left and right for a playful effect
 */
const swing = keyframes`
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
`;

/**
 * wave: Creates a waving motion for monkeys
 * Rotates them in a larger arc for a friendly wave effect
 */
const wave = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
`;

/**
 * Props interface for AnimatedMonkeys component
 * Currently empty but can be extended for future customization
 */
interface AnimatedMonkeysProps {}

/**
 * Main AnimatedMonkeys component
 * Renders 5 animated monkeys running across the top of the page
 */
const AnimatedMonkeys: React.FC<AnimatedMonkeysProps> = () => {
  // Get theme for consistent styling
  const theme = useTheme();
  // Get monkey visibility state from context
  const { showMonkeys } = useMonkeyContext();

  // Don't render anything if monkeys are hidden
  if (!showMonkeys) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 
        Monkey 1 - Primary Green Monkey with Bouncing Animation
        - Runs across screen in 15 seconds
        - Bounces up and down while running
        - Uses primary theme color (green)
        - Starts immediately (no delay)
      */}
      <Box
        sx={{
          position: 'absolute',    // Absolute positioning within container
          top: '20px',             // Vertical position from top
          animation: `${runAcross} 15s linear infinite`,  // Run across screen
          animationDelay: '0s',    // Start immediately
        }}
      >
        {/* Monkey circle with emoji and label */}
        <Box
          sx={{
            fontSize: '3rem',      // Large emoji size
            animation: `${bounce} 0.6s ease-in-out infinite`,  // Bouncing effect
            animationDelay: '0.1s', // Slight delay for natural feel
            backgroundColor: theme.palette.primary.main,  // Primary green color
            color: 'white',        // White emoji and text
            borderRadius: '50%',   // Perfect circle shape
            width: '80px',         // Circle width
            height: '80px',        // Circle height
            display: 'flex',       // Flexbox for centering content
            alignItems: 'center',  // Center vertically
            justifyContent: 'center', // Center horizontally
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Subtle shadow
            border: '3px solid white', // White border for contrast
            flexDirection: 'column', // Stack emoji above label
          }}
        >
          <Box sx={{ fontSize: '2rem' }}>🐵</Box>  {/* Monkey emoji */}
          <Box sx={{ fontSize: '0.6rem', marginTop: '-5px' }}>1</Box>  {/* Label */}
        </Box>
      </Box>

      {/* 
        Monkey 2 - Secondary Orange Monkey with Swinging Animation
        - Runs across screen in 18 seconds
        - Swings arms while running
        - Uses secondary theme color (orange)
        - Starts after 3 second delay
      */}
      <Box
        sx={{
          position: 'absolute',    // Absolute positioning within container
          top: '15px',             // Vertical position from top
          animation: `${runAcross} 18s linear infinite`,  // Run across screen
          animationDelay: '3s',    // Start after 3 seconds
        }}
      >
        {/* Monkey circle with emoji and label */}
        <Box
          sx={{
            fontSize: '3.2rem',    // Large emoji size
            animation: `${swing} 0.8s ease-in-out infinite`,  // Swinging effect
            animationDelay: '0.2s', // Slight delay for natural feel
            backgroundColor: theme.palette.secondary.main,  // Secondary orange color
            color: 'white',        // White emoji and text
            borderRadius: '50%',   // Perfect circle shape
            width: '65px',         // Circle width
            height: '65px',        // Circle height
            display: 'flex',       // Flexbox for centering content
            alignItems: 'center',  // Center vertically
            justifyContent: 'center', // Center horizontally
            flexDirection: 'column', // Stack emoji above label
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Subtle shadow
            border: '3px solid white', // White border for contrast
          }}
        >
          🐵
          <Box sx={{ fontSize: '0.6rem', marginTop: '2px' }}>2</Box>
        </Box>
      </Box>

      {/* 
        Monkey 3 - Bright Orange Monkey with Waving Animation
        - Runs across screen in 20 seconds
        - Waves while running
        - Uses bright orange color
        - Starts after 6 second delay
      */}
      <Box
        sx={{
          position: 'absolute',    // Absolute positioning within container
          top: '25px',             // Vertical position from top
          animation: `${runAcross} 20s linear infinite`,  // Run across screen
          animationDelay: '6s',    // Start after 6 seconds
        }}
      >
        {/* Monkey circle with emoji and label */}
        <Box
          sx={{
            fontSize: '2.8rem',    // Large emoji size
            animation: `${wave} 1s ease-in-out infinite`,  // Waving effect
            animationDelay: '0.3s', // Slight delay for natural feel
            backgroundColor: '#FF6B35',  // Bright orange color
            color: 'white',        // White emoji and text
            borderRadius: '50%',   // Perfect circle shape
            width: '55px',         // Circle width
            height: '55px',        // Circle height
            display: 'flex',       // Flexbox for centering content
            alignItems: 'center',  // Center vertically
            justifyContent: 'center', // Center horizontally
            flexDirection: 'column', // Stack emoji above label
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Subtle shadow
            border: '3px solid white', // White border for contrast
          }}
        >
          🐵
          <Box sx={{ fontSize: '0.6rem', marginTop: '2px' }}>3</Box>
        </Box>
      </Box>

      {/* 
        Monkey 4 - Green Monkey with Bouncing Animation
        - Runs across screen in 16 seconds
        - Bounces while running
        - Uses green color
        - Starts after 9 second delay
      */}
      <Box
        sx={{
          position: 'absolute',    // Absolute positioning within container
          top: '18px',             // Vertical position from top
          animation: `${runAcross} 16s linear infinite`,  // Run across screen
          animationDelay: '9s',    // Start after 9 seconds
        }}
      >
        {/* Monkey circle with emoji and label */}
        <Box
          sx={{
            fontSize: '3.1rem',    // Large emoji size
            animation: `${bounce} 0.7s ease-in-out infinite`,  // Bouncing effect
            animationDelay: '0.4s', // Slight delay for natural feel
            backgroundColor: '#4CAF50',  // Green color
            color: 'white',        // White emoji and text
            borderRadius: '50%',   // Perfect circle shape
            width: '62px',         // Circle width
            height: '62px',        // Circle height
            display: 'flex',       // Flexbox for centering content
            alignItems: 'center',  // Center vertically
            justifyContent: 'center', // Center horizontally
            flexDirection: 'column', // Stack emoji above label
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Subtle shadow
            border: '3px solid white', // White border for contrast
          }}
        >
          🐵
          <Box sx={{ fontSize: '0.6rem', marginTop: '2px' }}>4</Box>
        </Box>
      </Box>

      {/* 
        Monkey 5 - Purple Monkey with Swinging Animation
        - Runs across screen in 17 seconds
        - Swings while running
        - Uses purple color
        - Starts after 12 second delay
      */}
      <Box
        sx={{
          position: 'absolute',    // Absolute positioning within container
          top: '22px',             // Vertical position from top
          animation: `${runAcross} 17s linear infinite`,  // Run across screen
          animationDelay: '12s',   // Start after 12 seconds
        }}
      >
        {/* Monkey circle with emoji and label */}
        <Box
          sx={{
            fontSize: '2.9rem',    // Large emoji size
            animation: `${swing} 0.9s ease-in-out infinite`,  // Swinging effect
            animationDelay: '0.5s', // Slight delay for natural feel
            backgroundColor: '#9C27B0',  // Purple color
            color: 'white',        // White emoji and text
            borderRadius: '50%',   // Perfect circle shape
            width: '58px',         // Circle width
            height: '58px',        // Circle height
            display: 'flex',       // Flexbox for centering content
            alignItems: 'center',  // Center vertically
            justifyContent: 'center', // Center horizontally
            flexDirection: 'column', // Stack emoji above label
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Subtle shadow
            border: '3px solid white', // White border for contrast
          }}
        >
          🐵
          <Box sx={{ fontSize: '0.6rem', marginTop: '2px' }}>5</Box>
        </Box>
      </Box>

      {/* 
        Trail Effects - Visual enhancement for the monkey parade
        Creates a subtle colored trail that follows the monkeys
        - Positioned below the monkeys for visual depth
        - Uses gradient from primary to secondary colors
        - Animated to move across screen with slight delay
        - Adds a polished, professional look to the animation
      */}
      <Box
        sx={{
          position: 'absolute',    // Absolute positioning
          top: '70px',             // Below the monkeys
          left: 0,                 // Full width
          right: 0,                // Full width
          height: '4px',           // Thin trail line
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, transparent)`, // Colorful gradient
          opacity: 0.6,            // Semi-transparent for subtlety
          animation: `${runAcross} 12s linear infinite`,  // Move across screen
          animationDelay: '1s',    // Start after monkeys begin
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Subtle shadow for depth
        }}
      />
    </Box>
  );
};

/**
 * Export the AnimatedMonkeys component
 * This component provides a fun, animated monkey parade across the top of the page
 * with toggle functionality through the MonkeyContext
 */
export default AnimatedMonkeys;
