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

const Room2 = () => {
 // Define animation speed
 const animationSpeed = 100; // Adjust the speed of animation

 // Game state variables
 const [isInRange, setIsInRange] = useState(false); // State to track if the character is near the button
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

  const groundLevel = 50; // Base ground level (relative to container)
  const gravity = 0.5;
  const jumpStrength = 12;
  const horizontalSpeed = 3;

  const platforms = [
    { x: 300, y: 100, width: 200, height: 20, color: "red" },
    { x: 600, y: 50, width: 200, height: 20, color: "blue" },
    { x: 900, y: 150, width: 200, height: 20, color: "green" },
    { x: 1200, y: 200, width: 250, height: 20, color: "purple" },
    { x: 150, y: 250, width: 150, height: 20, color: "orange" },
    { x: 475, y: 300, width: 180, height: 20, color: "yellow" },
    { x: 750, y: 350, width: 200, height: 20, color: "cyan" },
    { x: 1500, y: 350, width: 200, height: 20, color: "magenta" },
    { x: 1100, y: 400, width: 250, height: 20, color: "brown" },
  ];

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
  

  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Update horizontal position
      setPosition((prevPos) => prevPos + velocityX);

      // Update vertical position (gravity and jumping behavior)
      setVerticalPosition((prevVert) => {
        let nextVert = prevVert + velocityY;

        const onPlatform = platforms.some((platform) =>
          checkPlatformCollision(platform, position, nextVert)
        );

        // Handle platform collision
        if (onPlatform) {
          // Stop downward movement and adjust position to the top of the platform
          setVelocityY(0);
          return platforms.find((platform) =>
            checkPlatformCollision(platform, position, nextVert)
          ).y + 20; // Adjust based on platform height
        }

        // If the character is falling below the ground level
        if (nextVert <= groundLevel) {
          setVelocityY(0); // Stop gravity at ground level
          return groundLevel;
        }

        // If not on a platform or ground, continue applying gravity
        return nextVert;
      });

      // Apply gravity only if not on a platform
      if (!onPlatform) {
        setVelocityY((prevVelY) => prevVelY - gravity);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [velocityX, velocityY, position, verticalPosition]);

  const checkPlatformCollision = (platform, charX, charY) => {
    const charWidth = 50; // Adjust based on character size
    const charHeight = 50;

    // Check if the character is within the horizontal bounds of the platform
    const withinX = charX + charWidth > platform.x && charX < platform.x + platform.width;
    // Check if the character is vertically aligned with the platform (slightly above or touching it)
    const onTop = charY - charHeight <= platform.y && charY >= platform.y;

    return withinX && onTop;
  };

  const handleKeyDown = (e) => {
    setKeyState((prev) => ({ ...prev, [e.key]: true }));
  };

  const handleKeyUp = (e) => {
    setKeyState((prev) => ({ ...prev, [e.key]: false }));
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    
    const gameLoop = () => {
      // Game update logic (same as before)
      setPosition((prevPos) => prevPos + velocityX);
      setVerticalPosition((prevVert) => {
        const nextVert = prevVert + velocityY;
        const onPlatform = platforms.some((platform) =>
          checkPlatformCollision(platform, position, nextVert)
        );
  
        if (onPlatform) {
          setIsJumping(false);
          setVelocityY(0);
          return platforms.find((platform) =>
            checkPlatformCollision(platform, position, nextVert)
          ).y + 20;
        }
  
        if (nextVert <= groundLevel) {
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel;
        }
  
        return nextVert;
      });
  
      setVelocityY((prevVelY) => prevVelY - gravity);
      
      // Re-run the game loop
      animationFrameId = requestAnimationFrame(gameLoop);
    };
  
    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);
  
    // Cleanup the game loop on component unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [velocityX, velocityY, position, verticalPosition]);
  
  useEffect(() => {
    if (keyState.ArrowLeft) setVelocityX(-horizontalSpeed);
    if (keyState.ArrowRight) setVelocityX(horizontalSpeed);
    if (!keyState.ArrowLeft && !keyState.ArrowRight) setVelocityX(0);

    // Jumping should be allowed whenever the up arrow is pressed, 
    // not dependent on being off the platform
    if (keyState.ArrowUp && !isJumping) {
      setIsJumping(true);
      setVelocityY(jumpStrength);
    }
  }, [keyState, isJumping]);

// Update running animation when moving
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

  useEffect(() => {
    const jumpInterval = setInterval(() => {
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

                const landingPlatform = platforms.find(
                    (platform) =>
                        position >= platform.x &&
                        position <= platform.x + platform.width &&
                        newVertical <= platform.y + platform.height &&
                        prevVertical >= platform.y
                );

                if (landingPlatform) {
                    return landingPlatform.y + landingPlatform.height; // Land on platform
                }
            }

            // Apply gravity and prevent going below ground level
            if (newVertical <= groundLevel && !onPlatform) {
                setIsJumping(false);
                setVelocityY(0);
                return groundLevel;
            }

            return newVertical;
        });

        // Update position horizontally based on velocityX
        setPosition((prevPosition) => {
            const newPosition = prevPosition - velocityX;
            return Math.max(0, Math.min(newPosition, window.innerWidth - 100)); // Prevent moving out of bounds
        });

        // Apply gravity if not on a platform
        if (!onPlatform) {
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

  useEffect(() => {
    // Handle horizontal movement (left and right)
    if (keyState.ArrowLeft) {
        setVelocityX(-horizontalSpeed); // Move left
        setIsFlipped(true); // Flip when moving left
    } else if (keyState.ArrowRight) {
        setVelocityX(horizontalSpeed); // Move right
        setIsFlipped(false); // Don't flip when moving right
    } else {
        setVelocityX(0); // Stop when no key is pressed
    }

    // Handle jumping logic
    if (keyState.ArrowUp && !isJumping) {
        setIsJumping(true);
        setVelocityY(jumpStrength); // Start jumping
    }

    // Gravity and vertical movement will be handled separately
}, [keyState, isJumping]);


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
    backgroundColor: "brown",
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
export default Room2;
