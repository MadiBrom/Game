import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import run0 from "./pics/run0.png";
import run1 from "./pics/run1.png";
import run2 from "./pics/run2.png";
import run3 from "./pics/run3.png";
import run4 from "./pics/run4.png";
import run5 from "./pics/run5.png";
import robo from "./pics/robo.png";

const runningImages = [run0, run1, run2, run3, run4, run5];

const Room1 = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(20); 
  const [verticalPosition, setVerticalPosition] = useState(200); 
  const [isJumping, setIsJumping] = useState(false);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [keyState, setKeyState] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState({
    x: position + 50,
    y: verticalPosition + 100,
  });

  const [isInRange, setIsInRange] = useState(false);

  const gravity = 0.5;
  const jumpStrength = 10;
  const horizontalSpeed = 3;
  const groundLevel = 200;
  const animationSpeed = 150;

  const platforms = [
    { x: 300, y: 150, width: 200, height: 20 },
    { x: 600, y: 100, width: 150, height: 20 }, 
    { x: 900, y: 250, width: 200, height: 20 }, 
  ];

  const handleKeyDown = (e) => {
    setKeyState((prevState) => ({ ...prevState, [e.key]: true }));
  };

  const handleKeyUp = (e) => {
    setKeyState((prevState) => ({ ...prevState, [e.key]: false }));
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
    if (keyState.ArrowLeft || keyState.ArrowRight) {
      const animationInterval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % runningImages.length
        );
      }, animationSpeed);
      return () => clearInterval(animationInterval);
    }
  }, [keyState.ArrowLeft, keyState.ArrowRight]);

  useEffect(() => {
    if (keyState.ArrowLeft) {
      setVelocityX(-horizontalSpeed); 
      setIsFlipped(true); 
    } else if (keyState.ArrowRight) {
      setVelocityX(horizontalSpeed); 
      setIsFlipped(false);
    } else {
      setVelocityX(0); 
    }


    if (keyState.ArrowUp && !isJumping) {
      setIsJumping(true);
      setVelocityY(-jumpStrength);
    }
  }, [keyState, isJumping, horizontalSpeed, jumpStrength]);

  useEffect(() => {
    const moveWithLag = () => {
      const lagFactor = 0.1;

      setFloatingPosition((prevPosition) => ({
        x: prevPosition.x + (position - prevPosition.x) * lagFactor,
        y:
          prevPosition.y +
          (verticalPosition + 100 - prevPosition.y) * lagFactor,
      }));
    };

    const animationFrameId = requestAnimationFrame(moveWithLag);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position, verticalPosition]);

  useEffect(() => {
    const jumpInterval = setInterval(() => {
      setVerticalPosition((prevVertical) => {
        const newVertical = prevVertical - velocityY;
  
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
            return landingPlatform.y + landingPlatform.height; 
          }
        }
  
        if (newVertical <= groundLevel && !onPlatform) {
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel;
        }
  
        return newVertical;
      });
  
      setPosition((prevPosition) => {
        const newPosition = prevPosition - velocityX;
        return Math.max(0, Math.min(newPosition, window.innerWidth - 100));
      });
  
      if (isJumping) {
        setVelocityY((prevVelocityY) => prevVelocityY + gravity);
      }
    }, 20);
  
    return () => clearInterval(jumpInterval);
  }, [isJumping, velocityX, velocityY, gravity, position, verticalPosition]);
  
  
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "grey",
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat",
    position: "relative",
  };


  const characterStyle = {
    width: "500px",
    height: "500px",
    position: "fixed",
    bottom: `${verticalPosition}px`,
    right: `${position}px`, 
    transition: !isJumping ? "right 0.1s" : "none",
    backgroundColor: "transparent",
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)",
  };

  const robotStyle = {
    width: "300px",
    height: "300px",
    position: "fixed",
    bottom: `${floatingPosition.y}px`, 
    right: `${floatingPosition.x}px`, 
    backgroundImage: `url(${robo})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    transformOrigin: "center", 
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)",
  };
  const buttonPosition = {
    x: 1000, 
    y: 400, 
  };
  
  const buttonStyle = {
    position: "absolute",
    bottom: `${buttonPosition.y}px`,
    right: `${buttonPosition.x}px`,
    padding: "10px 20px",
    backgroundColor: "gray", 
    color: "white",
    cursor: "default",
    pointerEvents: "none", 
  };

  const platformStyle = {
    position: "absolute",
    backgroundColor: "brown", 
    height: "20px", 
    borderRadius: "5px",
    zIndex: 1,
  };
  
  

  return (
    <div style={containerStyle}>
      <img
        src={runningImages[currentImageIndex]}
        alt="Character"
        style={characterStyle}
      />

      <div style={robotStyle}></div>

      <button
        style={buttonStyle}
        onClick={() => {
          if (isInRange) {
            navigate("/room1");
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
      bottom: `${platform.y}px`,
    }}
  ></div>
))}

    </div>
  );
};

export default Room1;