import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import run0 from "./pics/run0.png";
import run1 from "./pics/run1.png";
import run2 from "./pics/run2.png";
import run3 from "./pics/run3.png";
import run4 from "./pics/run4.png";
import run5 from "./pics/run5.png";
import robo from "./pics/robo.png"; // The PNG that stays with the character

const runningImages = [run0, run1, run2, run3, run4, run5];

const MoveBox = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(50); // Character's horizontal position
  const [verticalPosition, setVerticalPosition] = useState(0); // Character's vertical position
  const [velocityX, setVelocityX] = useState(0); // Horizontal velocity
  const [velocityY, setVelocityY] = useState(0); // Vertical velocity
  const [isJumping, setIsJumping] = useState(false);
  const [keyState, setKeyState] = useState({ ArrowLeft: false, ArrowRight: false, ArrowUp: false });

  const groundLevel = 50; // Base ground level (relative to container)
  const gravity = 0.5;
  const jumpStrength = 10;
  const horizontalSpeed = 3;

  // Platforms (x, y is top-left corner of the platform)
  const platforms = [
    { x: 300, y: 100, width: 200, height: 20 },
    { x: 600, y: 50, width: 150, height: 20 },
    { x: 900, y: 150, width: 200, height: 20 },
  ];

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPosition((prevPos) => prevPos + velocityX);

      setVerticalPosition((prevVert) => {
        const nextVert = prevVert - velocityY;
        const onPlatform = platforms.some((platform) =>
          checkPlatformCollision(platform, position, nextVert)
        );

        if (onPlatform) {
          setIsJumping(false);
          setVelocityY(0);
          return platforms.find((platform) =>
            checkPlatformCollision(platform, position, nextVert)
          ).y;
        }

        if (nextVert <= groundLevel) {
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel;
        }

        return nextVert;
      });

      if (isJumping) {
        setVelocityY((prevVelY) => prevVelY - gravity);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [velocityX, velocityY, position, verticalPosition, isJumping]);

  const checkPlatformCollision = (platform, charX, charY) => {
    const charWidth = 50; // Adjust based on character size
    const charHeight = 50;

    const withinX = charX + charWidth > platform.x && charX < platform.x + platform.width;
    const abovePlatform = charY <= platform.y && charY + charHeight > platform.y;

    return withinX && abovePlatform;
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
  }, [keyState]);

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
