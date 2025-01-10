import React, { useState, useEffect } from "react";

const MoveBox = () => {
  const [position, setPosition] = useState(50); // Character's horizontal position
  const [verticalPosition, setVerticalPosition] = useState(50); // Character's vertical position
  const [velocityX, setVelocityX] = useState(0); // Horizontal velocity
  const [velocityY, setVelocityY] = useState(0); // Vertical velocity
  const [isJumping, setIsJumping] = useState(false);
  const [keyState, setKeyState] = useState({ ArrowLeft: false, ArrowRight: false, ArrowUp: false });

  const groundLevel = 50; // Base ground level (relative to container)
  const gravity = 0.5;
  const jumpStrength = 11;
  const horizontalSpeed = 3;

  const platforms = [
    { x: 300, y: 100, width: 200, height: 20 },
    { x: 600, y: 50, width: 200, height: 20 },
    { x: 900, y: 150, width: 200, height: 20 },
    { x: 1200, y: 200, width: 250, height: 20 },
    { x: 150, y: 250, width: 150, height: 20 },  
    { x: 500, y: 300, width: 180, height: 20 },   
    { x: 750, y: 350, width: 200, height: 20 },   
  ];

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

  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "lightblue",
    overflow: "hidden",
  };

  const characterStyle = {
    position: "absolute",
    width: "50px",
    height: "50px",
    backgroundColor: "red",
    left: `${position}px`,
    bottom: `${verticalPosition}px`,
  };

  const platformStyle = {
    position: "absolute",
    backgroundColor: "brown",
  };

  return (
    <div style={containerStyle}>
      <div style={characterStyle}></div>
      {platforms.map((platform, index) => (
        <div
          key={index}
          style={{
            ...platformStyle,
            width: `${platform.width}px`,
            height: `${platform.height}px`,
            left: `${platform.x}px`,
            bottom: `${platform.y}px`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default MoveBox;
