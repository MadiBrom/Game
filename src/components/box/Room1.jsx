import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import run0 from "./pics/run0.png";
import run1 from "./pics/run1.png";
import run2 from "./pics/run2.png";
import run3 from "./pics/run3.png";
import run4 from "./pics/run4.png";
import run5 from "./pics/run5.png";
import robo from "./pics/robo.png"; // The PNG that stays with the character

// Array of images representing the character's running animation
const runningImages = [run0, run1, run2, run3, run4, run5];

const Room1 = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(20); // Horizontal position (from the right)
  const [verticalPosition, setVerticalPosition] = useState(200); // Vertical position (bottom distance)
  const [isJumping, setIsJumping] = useState(false); // Track if the character is in the middle of a jump
  const [isOnPlatform, setIsOnPlatform] = useState(false); // Track if character is standing on a platform
  const [velocityX, setVelocityX] = useState(0); // Horizontal velocity
  const [velocityY, setVelocityY] = useState(0); // Vertical velocity (for jump and fall)
  const [keyState, setKeyState] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
  }); // Track the state of key presses
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current running frame
  const [isFlipped, setIsFlipped] = useState(false); // Track if character is mirrored
  const [floatingPosition, setFloatingPosition] = useState({
    x: position + 50, // Initialize the robot's X position near the character
    y: verticalPosition + 100, // Initialize the robot's Y position above the character
  });

  const gravity = 0.5; // Gravity constant to pull the character down
  const jumpStrength = 10; // Initial upward velocity for jump
  const horizontalSpeed = 3; // Speed of horizontal movement
  const groundLevel = 200; // Defined ground level for the character to return to
  const animationSpeed = 150; // Speed to cycle through the running frames (in milliseconds)

  // Fixed platform positions
  const platforms = [
    { x: 100, y: 300, width: 200, height: 20 }, // Platform 1
    { x: 400, y: 320, width: 200, height: 20 }, // Platform 2
    { x: 700, y: 340, width: 200, height: 20 }, // Platform 3
  ];

  // Handle key down events to update keyState
  const handleKeyDown = (e) => {
    setKeyState((prevState) => ({ ...prevState, [e.key]: true }));
  };

  // Handle key up events to update keyState
  const handleKeyUp = (e) => {
    setKeyState((prevState) => ({ ...prevState, [e.key]: false }));
  };

  useEffect(() => {
    // Add event listeners for keydown and keyup
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Animation: Cycle through images when moving left or right
  useEffect(() => {
    if (keyState.ArrowLeft || keyState.ArrowRight) {
      const animationInterval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % runningImages.length
        ); // Cycle through the running images
      }, animationSpeed);
      return () => clearInterval(animationInterval); // Stop animation when key is released
    }
  }, [keyState.ArrowLeft, keyState.ArrowRight]);

  // Check for key presses and set the corresponding velocities and flipping direction
  useEffect(() => {
    if (keyState.ArrowLeft) {
      setVelocityX(-horizontalSpeed); // Move left
      setIsFlipped(true); // Flip the character
    } else if (keyState.ArrowRight) {
      setVelocityX(horizontalSpeed); // Move right
      setIsFlipped(false); // Don't flip the character
    } else {
      setVelocityX(0); // Stop horizontal movement if no arrow keys are pressed
    }

    // Jumping logic
    if (keyState.ArrowUp && !isJumping && !isOnPlatform) {
      setIsJumping(true);
      setIsOnPlatform(false); // Leave the platform
      setVelocityY(-jumpStrength); // Apply upward velocity for jump (negative value for upward movement)
    }
  }, [keyState, isJumping, isOnPlatform, horizontalSpeed, jumpStrength]);

  useEffect(() => {
    const moveWithLag = () => {
      const lagFactor = 0.1; // Increase the factor slightly for smoother and faster catching up

      // Gradually move the robot's position towards the character's position
      setFloatingPosition((prevPosition) => ({
        x: prevPosition.x + (position - prevPosition.x) * lagFactor, // Lerp towards the character's position
        y:
          prevPosition.y +
          (verticalPosition + 100 - prevPosition.y) * lagFactor, // Lerp towards the character's vertical position
      }));
    };

    // Start the animation
    const animationFrameId = requestAnimationFrame(moveWithLag);

    return () => cancelAnimationFrame(animationFrameId); // Clean up on unmount
  }, [position, verticalPosition]);

  // Update position for jumping, falling, and horizontal movement
  useEffect(() => {
    const jumpInterval = setInterval(() => {
      // Apply gravity only if not standing on a platform
      setVerticalPosition((prevVertical) => {
        let newVertical = prevVertical - velocityY; // Subtract velocity to move up

        // Check if character is landing on any platform
        const platformLandedOn = platforms.find((platform) => {
          const isWithinPlatformWidth =
            position > platform.x && position < platform.x + platform.width;
          const isLandedOnPlatform =
            prevVertical >= platform.y &&
            newVertical <= platform.y &&
            velocityY > 0; // Check if falling down onto the platform
          return isWithinPlatformWidth && isLandedOnPlatform;
        });

        if (platformLandedOn) {
          // If landed, set position on the platform
          newVertical = platformLandedOn.y + platformLandedOn.height;
          setIsJumping(false);
          setIsOnPlatform(true); // The character is now on a platform
          setVelocityY(0); // Stop downward velocity
          return newVertical;
        }

        // Check if the character should fall to the ground
        if (newVertical <= groundLevel) {
          setIsJumping(false);
          setIsOnPlatform(false); // Character is no longer on a platform
          setVelocityY(0);
          return groundLevel; // Stop at ground level
        }

        // If the character falls off a platform
        if (!platformLandedOn && isOnPlatform && velocityY > 0) {
          setIsOnPlatform(false);
        }

        return newVertical;
      });

      // Apply horizontal movement
      setPosition((prevPosition) => {
        const newPosition = prevPosition - velocityX;
        return Math.max(0, Math.min(newPosition, window.innerWidth - 100)); // Keep the character within screen bounds
      });

      // Update vertical velocity due to gravity
      if (isJumping || !isOnPlatform) {
        setVelocityY((prevVelocityY) => prevVelocityY + gravity); // Add gravity to pull the character back down
      }
    }, 20);

    return () => clearInterval(jumpInterval); // Clean up interval when the jump ends
  }, [
    isJumping,
    isOnPlatform,
    velocityX,
    velocityY,
    gravity,
    position,
    verticalPosition,
    platforms,
  ]);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "green",
    position: "relative",
  };

  // Define styles for the character image
  const characterStyle = {
    width: "500px", // Adjust width based on your character image
    height: "500px", // Adjust height based on your character image
    position: "fixed",
    bottom: `${verticalPosition}px`, // Adjust vertical position for jumping
    right: `${position}px`, // Adjust horizontal position
    transition: !isJumping ? "right 0.1s" : "none", // Smooth transitions for horizontal movement
    backgroundColor: "transparent", // Ensure the background is transparent
    zIndex: 10, // Ensure character is above the platforms
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)", // Flip the image when moving left
  };

  // Define styles for the robot image
  const robotStyle = {
    width: "300px", // Adjust the size of the robot
    height: "300px",
    position: "fixed",
    bottom: `${floatingPosition.y}px`, // Adjust robot's vertical position with lag
    right: `${floatingPosition.x}px`, // Adjust robot's horizontal position with lag
    backgroundImage: `url(${robo})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    zIndex: 9, // Robot is behind the character but above platforms
    transformOrigin: "center", // Flip around the center to avoid shifting
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)", // Flip the robot like the character without shifting position
  };

  // Define styles for the platforms
  const platformStyle = (platform) => ({
    position: "fixed",
    width: `${platform.width}px`,
    height: `${platform.height}px`,
    backgroundColor: "brown",
    bottom: `${platform.y}px`,
    left: `${platform.x}px`,
    zIndex: 5, // Platforms are behind the character and the robot
  });

  return (
    <div style={containerStyle}>
      {/* Main Character */}
      <img
        src={runningImages[currentImageIndex]}
        alt="Character"
        style={characterStyle}
        className="character"
      />

      {/* Robot (always rendered next to the character) */}
      <div style={robotStyle} className="robot"></div>

      {/* Render the platforms */}
      {platforms.map((platform, index) => (
        <div key={index} style={platformStyle(platform)} className="platform" />
      ))}
    </div>
  );
};

export default Room1;
