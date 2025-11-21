import React, { useState, useEffect } from "react";

import run0 from "./pics/rori/run0.png";
import run1 from "./pics/rori/run1.png";
import run2 from "./pics/rori/run2.png";
import run3 from "./pics/rori/run3.png";
import run4 from "./pics/rori/run4.png";
import run5 from "./pics/rori/run5.png";
import robo from "./pics/robots/robo.png";

const runningImages = [run0, run1, run2, run3, run4, run5];

const Room = () => {
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

  const gravity = 0.5;
  const jumpStrength = 10;
  const horizontalSpeed = 3;
  const groundLevel = 200;
  const animationSpeed = 150;

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
        if (newVertical <= groundLevel) {
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

  return (
    <div style={containerStyle}>
      <img
        src={runningImages[currentImageIndex]}
        alt="Character"
        style={characterStyle}
      />

      <div style={robotStyle}></div>
    </div>
  );
};

export default Room;
