import React, { useState, useEffect } from "react";
import run0 from "./pics/run0.png";
import run1 from "./pics/run1.png";
import run2 from "./pics/run2.png";
import run3 from "./pics/run3.png";
import run4 from "./pics/run4.png";
import run5 from "./pics/run5.png";
import robo from "./pics/robo.png"; // The PNG that stays with the character

// Array of images representing the character's running animation
const runningImages = [run0, run1, run2, run3, run4, run5];

const MoveBox = () => {
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

  const gravity = 0.5; // Gravity constant to pull the box down
  const jumpStrength = 10; // Initial upward velocity for jump
  const horizontalSpeed = 3; // Speed of horizontal movement
  const groundLevel = 200; // Defined ground level for the box to return to
  const animationSpeed = 150; // Speed to cycle through the running frames (in milliseconds)

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
    let animationFrameId;

    const moveWithLag = () => {
      const lagFactor = 0.1; // Increase the factor slightly for smoother and faster catching up

      // Gradually move the robot's position towards the character's position
      setFloatingPosition((prevPosition) => ({
        x: prevPosition.x + (position - prevPosition.x) * lagFactor, // Lerp towards the character's position
        y:
          prevPosition.y +
          (verticalPosition + 100 - prevPosition.y) * lagFactor, // Lerp towards the character's vertical position
      }));

      // Use requestAnimationFrame for the next frame
      animationFrameId = requestAnimationFrame(moveWithLag);
    };

    // Start the animation
    moveWithLag();

    return () => cancelAnimationFrame(animationFrameId); // Clean up on unmount
  }, [position, verticalPosition]);

  // Update position for jumping, falling, and horizontal movement
  useEffect(() => {
    const jumpInterval = setInterval(() => {
      // Apply gravity and adjust the vertical position
      setVerticalPosition((prevVertical) => {
        const newVertical = prevVertical - velocityY; // Subtract velocity to move up
        if (newVertical <= groundLevel) {
          // Reset to ground level when reaching the bottom
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel; // Stop at ground level
        }
        return newVertical;
      });

      // Apply horizontal movement
      setPosition((prevPosition) => {
        const newPosition = prevPosition - velocityX;
        return Math.max(0, Math.min(newPosition, window.innerWidth - 100)); // Keep the character within screen bounds
      });

      // Update vertical velocity due to gravity
      if (isJumping) {
        setVelocityY((prevVelocityY) => prevVelocityY + gravity); // Add gravity to pull the character back down
      }
    }, 20);

    return () => clearInterval(jumpInterval); // Clean up interval when the jump ends
  }, [isJumping, velocityX, velocityY, gravity]);

  useEffect(() => {
    const moveWithLag = () => {
      const lagFactor = 0.05; // Adjust this factor to increase or decrease lag (closer to 0 = more lag)

      // Gradually move the robot's X position towards the character's X position
      setFloatingPosition((prevPosition) => ({
        x: prevPosition.x + (position - prevPosition.x) * lagFactor, // Lerp towards the character's position
        y:
          prevPosition.y +
          (verticalPosition + 100 - prevPosition.y) * lagFactor, // Lerp towards the character's vertical position (plus 100px offset)
      }));
    };

    const followInterval = setInterval(moveWithLag, 20); // Update the position every 20ms to create a smooth lag effect

    return () => clearInterval(followInterval); // Clean up the interval when the component unmounts
  }, [position, verticalPosition]);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
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

  // Robot style (no changes here)
  const robotStyle = {
    width: "300px", // Adjust the size of the robot
    height: "300px",
    position: "fixed",
    bottom: `${floatingPosition.y}px`, // Use the lagged floating position for vertical movement
    right: isFlipped
      ? `${floatingPosition.x - 70}px`
      : `${floatingPosition.x - 30}px`, // Adjust the X position slightly if flipped to prevent jumping
    backgroundImage: `url(${robo})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    transformOrigin: "center", // Flip around the center to avoid shifting
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)", // Flip the robot like the character without shifting position
  };

  return (
    <div style={containerStyle}>
      {/* Main Character */}
      <img
        src={runningImages[currentImageIndex]}
        alt="Character"
        style={characterStyle}
      />

      {/* Robot (always rendered next to the character) */}
      <div style={robotStyle}></div>
    </div>
  );
};

export default MoveBox;
