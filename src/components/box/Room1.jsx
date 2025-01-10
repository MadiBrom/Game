import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import run0 from "./pics/run0.png";
import run1 from "./pics/run1.png";
import run2 from "./pics/run2.png";
import run3 from "./pics/run3.png";
import run4 from "./pics/run4.png";
import run5 from "./pics/run5.png";
import robo from "./pics/robo.png"; // The PNG that stays with the character
// import backgroundImage from "./pics/background.png";

// Array of images representing the character's running animation
const runningImages = [run0, run1, run2, run3, run4, run5];

const Room1 = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(20); // Horizontal position (from the right)
  const [verticalPosition, setVerticalPosition] = useState(200); // Vertical position (bottom distance)
  const [isJumping, setIsJumping] = useState(false); // Track if the character is in the middle of a jump
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

  const [isInRange, setIsInRange] = useState(false); // State to track if the character is near the button

  const gravity = 0.5; // Gravity constant to pull the box down
  const jumpStrength = 10; // Initial upward velocity for jump
  const horizontalSpeed = 3; // Speed of horizontal movement
  const groundLevel = 200; // Defined ground level for the box to return to
  const animationSpeed = 150; // Speed to cycle through the running frames (in milliseconds)

  const platforms = [
    { x: 300, y: 150, width: 200, height: 20 }, // Example platform
    { x: 600, y: 100, width: 150, height: 20 }, // Another platform
    { x: 900, y: 250, width: 200, height: 20 }, // Platform closer to the button
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
    if (keyState.ArrowUp && !isJumping) {
      setIsJumping(true);
      setVelocityY(-jumpStrength); // Apply upward velocity for jump (negative value for upward movement)
    }
  }, [keyState, isJumping, horizontalSpeed, jumpStrength]);

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

  useEffect(() => {
    const jumpInterval = setInterval(() => {
      // Apply gravity and adjust the vertical position
      setVerticalPosition((prevVertical) => {
        const newVertical = prevVertical - velocityY; // Subtract velocity to move up
  
        // Check if the character collides with any platform
        const onPlatform = platforms.some((platform) => {
          const isInHorizontalRange = position >= platform.x && position <= platform.x + platform.width;
          const isInVerticalRange = newVertical <= platform.y + platform.height && prevVertical > platform.y;
  
          return isInHorizontalRange && isInVerticalRange;
        });
  
        if (onPlatform) {
          setIsJumping(false);
          setVelocityY(0);
  
          // Find the platform the character landed on
          const landingPlatform = platforms.find(
            (platform) =>
              position >= platform.x &&
              position <= platform.x + platform.width &&
              newVertical <= platform.y + platform.height &&
              prevVertical >= platform.y
          );
  
          if (landingPlatform) {
            return landingPlatform.y + landingPlatform.height; // Ensure character lands on top of platform
          }
        }
  
        // Apply gravity and prevent going below ground level if not colliding with any platform
        if (newVertical <= groundLevel && !onPlatform) {
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel;
        }
  
        return newVertical;
      });
  
      // Horizontal movement
      setPosition((prevPosition) => {
        const newPosition = prevPosition - velocityX;
        return Math.max(0, Math.min(newPosition, window.innerWidth - 100));
      });
  
      // Apply gravity to pull character down
      if (isJumping) {
        setVelocityY((prevVelocityY) => prevVelocityY + gravity);
      }
    }, 20);
  
    return () => clearInterval(jumpInterval);
  }, [isJumping, velocityX, velocityY, gravity, position, verticalPosition]);
  
  
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    // backgroundImage: `url(${backgroundImage})`, // Set the background image
    backgroundColor: "grey",
    backgroundSize: "cover", // Make the image cover the entire background
    backgroundPosition: "center", // Center the background image
    backgroundRepeat: "no-repeat", // Prevent repeating the image
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
    transformOrigin: "center", // Flip around the center to avoid shifting
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)", // Flip the robot like the character without shifting position
  };
  const buttonPosition = {
    x: 1000, // Horizontal position of the button (adjust as needed)
    y: 400, // Vertical position above the ground level (higher than the character's max jump height)
  };
  
  const buttonStyle = {
    position: "absolute",
    bottom: `${buttonPosition.y}px`,
    right: `${buttonPosition.x}px`,
    padding: "10px 20px",
    backgroundColor: "gray", // Always gray since it will be unreachable
    color: "white",
    cursor: "default", // No interaction allowed
    pointerEvents: "none", // Disable interactions entirely
  };

  const platformStyle = {
    position: "absolute",
    backgroundColor: "brown", // Visible color
    height: "20px", // Platform height
    borderRadius: "5px", // Optional round edges
    zIndex: 1, // Ensure it's on top of the background
  };
  
  

  return (
    <div style={containerStyle}>
      {/* Main Character */}
      <img
        src={runningImages[currentImageIndex]}
        alt="Character"
        style={characterStyle}
      />

      {/* Robot */}
      <div style={robotStyle}></div>

      {/* Button */}
      <button
        style={buttonStyle}
        onClick={() => {
          if (isInRange) {
            navigate("/room1"); // Replace '/room1' with the actual path to your Room1 component
          }
        }}
      >
        {isInRange ? "Press me" : "Out of range"}
      </button>

      {platforms.map((platform, index) => (
  <div
    key={index}
    style={{
      ...platformStyle,
      width: `${platform.width}px`,
      height: `${platform.height}px`,
      left: `${platform.x}px`,
      bottom: `${platform.y}px`, // Platform position relative to the bottom (adjusted from ground level)
    }}
  ></div>
))}

    </div>
  );
};

export default Room1;