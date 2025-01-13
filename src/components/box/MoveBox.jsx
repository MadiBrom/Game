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
  const jumpStrength = 12;
  const horizontalSpeed = 3;

  const platforms = [
    { x: 300, y: 100, width: 200, height: 20, color: "red" },
    { x: 600, y: 50, width: 200, height: 20, color: "blue" },
    { x: 900, y: 150, width: 200, height: 20, color: "green" },
    { x: 1200, y: 200, width: 200, height: 20, color: "purple" },
    { x: 150, y: 250, width: 200, height: 20, color: "orange" },
    { x: 475, y: 300, width: 200, height: 20, color: "yellow" },
    { x: 750, y: 350, width: 200, height: 20, color: "cyan" },
    { x: 1500, y: 350, width: 200, height: 20, color: "magenta" },
    { x: 1100, y: 400, width: 200, height: 20, color: "brown" },
  ];

  useEffect(() => {
    let animationFrameId;

    const gameLoop = () => {
      setPosition((prevPos) => prevPos + velocityX);
      setVerticalPosition((prevVert) => {
        const nextVert = prevVert + velocityY;
        const onPlatform = platforms.some((platform) =>
          checkPlatformCollision(platform, position, nextVert)
        );

        if (onPlatform && velocityY <= 0) {
          setIsJumping(false);
          setVelocityY(0);
          return platforms.find((platform) =>
            checkPlatformCollision(platform, position, nextVert)
          ).y + 20; // Align to the top of the platform
        }

        if (nextVert <= groundLevel) {
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel;
        }

        return nextVert;
      });

      setVelocityY((prevVelY) => prevVelY - gravity);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [velocityX, velocityY, position, verticalPosition]);

  const checkPlatformCollision = (platform, charX, charY) => {
    const charWidth = 50; // Character width
    const charHeight = 50; // Character height

    const withinX = charX + charWidth > platform.x && charX < platform.x + platform.width;
    const onTop = charY - charHeight <= platform.y && charY >= platform.y - 5;

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
    if (keyState.ArrowLeft) setVelocityX(-horizontalSpeed);
    if (keyState.ArrowRight) setVelocityX(horizontalSpeed);
    if (!keyState.ArrowLeft && !keyState.ArrowRight) setVelocityX(0);

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
    border: "2px solid black",
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
            backgroundColor: platform.color,
          }}
        ></div>
      ))}
    </div>
  );
};

export default MoveBox;
