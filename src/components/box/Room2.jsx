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

const Room2 = () => {
 const animationSpeed = 100; 

 const [isInRange, setIsInRange] = useState(false);
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

  const groundLevel = 50; 
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
  

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPosition((prevPos) => prevPos + velocityX);

      setVerticalPosition((prevVert) => {
        let nextVert = prevVert + velocityY;

        const onPlatform = platforms.some((platform) =>
          checkPlatformCollision(platform, position, nextVert)
        );

        if (onPlatform) {
          setVelocityY(0);
          return platforms.find((platform) =>
            checkPlatformCollision(platform, position, nextVert)
          ).y + 20; 
        }

        if (nextVert <= groundLevel) {
          setVelocityY(0);
          return groundLevel;
        }

        return nextVert;
      });

      if (!onPlatform) {
        setVelocityY((prevVelY) => prevVelY - gravity);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [velocityX, velocityY, position, verticalPosition]);

  const checkPlatformCollision = (platform, charX, charY) => {
    const charWidth = 50; 
    const charHeight = 50;

    const withinX = charX + charWidth > platform.x && charX < platform.x + platform.width;
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
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
  
    animationFrameId = requestAnimationFrame(gameLoop);
  
    return () => cancelAnimationFrame(animationFrameId);
  }, [velocityX, velocityY, position, verticalPosition]);
  
  useEffect(() => {
    if (keyState.ArrowLeft) setVelocityX(-horizontalSpeed);
    if (keyState.ArrowRight) setVelocityX(horizontalSpeed);
    if (!keyState.ArrowLeft && !keyState.ArrowRight) setVelocityX(0);


    if (keyState.ArrowUp && !isJumping) {
      setIsJumping(true);
      setVelocityY(jumpStrength);
    }
  }, [keyState, isJumping]);


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

        if (!onPlatform) {
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
        setVelocityY(jumpStrength);
    }

}, [keyState, isJumping]);


 
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
export default Room2;
