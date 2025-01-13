import React, { useState, useEffect } from "react";

const MoveBox = ({ coinCount, setCoinCount }) => {
  const [position, setPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [keyState, setKeyState] = useState({ ArrowLeft: false, ArrowRight: false, ArrowUp: false });
  const [coins, setCoins] = useState([
    { x: 380, y: 120, visible: true },
    { x: 680, y: 70, visible: true },
    { x: 980, y: 170, visible: true },
    { x: 1280, y: 220, visible: true },
    { x: 230, y: 270, visible: true },
    { x: 555, y: 320, visible: true },
    { x: 830, y: 370, visible: true },
    { x: 1580, y: 370, visible: true },
    { x: 1180, y: 420, visible: true },
  ]);
  const [showModal, setShowModal] = useState(false);

  const groundLevel = 50;
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

  const checkPlatformCollision = (platform, charX, charY) => {
    const charWidth = 50;
    const charHeight = 50;
    const platformLeft = platform.x;
    const platformRight = platform.x + platform.width;
    const platformTop = platform.y;
    const platformBottom = platform.y + platform.height;
  
    const charLeft = charX;
    const charRight = charX + charWidth;
    const charTop = charY;
    const charBottom = charY + charHeight;
  
    return (
      charRight > platformLeft &&
      charLeft < platformRight &&
      charBottom > platformTop &&
      charTop < platformBottom
    );
  };
  

  const checkCoinCollision = (coin, charX, charY) => {
    const charWidth = 50;
    const charHeight = 50;
    const coinWidth = 20;
    const coinHeight = 20;

    const withinX = charX + charWidth > coin.x && charX < coin.x + coinWidth;
    const withinY = charY + charHeight > coin.y && charY < coin.y + coinHeight;

    return withinX && withinY;
  };

  useEffect(() => {
    setCoins((prevCoins) =>
      prevCoins.map((coin) => {
        if (coin.visible && checkCoinCollision(coin, position, verticalPosition)) {
          setCoinCount((prevCount) => prevCount + 1);
          return { ...coin, visible: false };
        }
        return coin;
      })
    );
  }, [position, verticalPosition, setCoinCount]);

  useEffect(() => {
    const allCoinsCollected = coins.every((coin) => !coin.visible);
    if (allCoinsCollected) {
      setShowModal(true);
    }
  }, [coins]);

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

  const handlePlayAgain = () => {
    setCoins((prevCoins) => prevCoins.map((coin) => ({ ...coin, visible: true })));
    setPosition(50);
    setVerticalPosition(50);
    setShowModal(false);
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "lightblue", // Example background color
      }}
    >
      {/* Character */}
      <div
        style={{
          position: "absolute",
          width: "50px",
          height: "50px",
          backgroundColor: "blue",
          top: `${verticalPosition}px`,
          left: `${position}px`,
        }}
      ></div>
  
      {/* Platforms */}
      {platforms.map((platform, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: `${platform.width}px`,
            height: `${platform.height}px`,
            backgroundColor: platform.color,
            top: `${platform.y}px`,
            left: `${platform.x}px`,
          }}
        ></div>
      ))}
  
      {/* Coins */}
      {coins.map(
        (coin, index) =>
          coin.visible && (
            <div
              key={index}
              style={{
                position: "absolute",
                width: "20px",
                height: "20px",
                backgroundColor: "gold",
                borderRadius: "50%",
                top: `${coin.y}px`,
                left: `${coin.x}px`,
              }}
            ></div>
          )
      )}
  
      {/* Modal */}
      {showModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <h2>Congratulations! You've collected all the coins!</h2>
            <button onClick={handlePlayAgain}>Play Again</button>
          </div>
        </>
      )}
    </div>
  );
};  
export default MoveBox;
