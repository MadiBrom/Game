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
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // State for platforms
  const [platforms, setPlatforms] = useState([
    { x: 300, y: 100, width: 200, height: 20, color: "red" },
    { x: 600, y: 50, width: 200, height: 20, color: "blue" },
    { x: 900, y: 150, width: 200, height: 20, color: "green" },
    { x: 1200, y: 200, width: 200, height: 20, color: "purple" },
    { x: 150, y: 250, width: 200, height: 20, color: "orange" },
    { x: 475, y: 300, width: 200, height: 20, color: "yellow" },
    { x: 750, y: 350, width: 200, height: 20, color: "cyan" },
    { x: 1500, y: 350, width: 200, height: 20, color: "magenta" },
    { x: 1100, y: 400, width: 200, height: 20, color: "brown" },
  ]);

  const groundLevel = 50;
  const gravity = 0.5;
  const jumpStrength = 10;
  const horizontalSpeed = 3;

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
  
    return (
      charX + charWidth > coin.x &&
      charX < coin.x + coinWidth &&
      charY + charHeight > coin.y &&  // Vertical overlap
      charY < coin.y + coinHeight    // Coin is below the character
    );
  };

  useEffect(() => {
    setCoins((prevCoins) =>
      prevCoins.map((coin) => {
        if (coin.visible && checkCoinCollision(coin, position, verticalPosition)) {
          setCoinCount((prevCount) => prevCount + 1); 
          return { ...coin, visible: false }; // Mark coin as collected
        }
        return coin;
      })
    );
  }, [position, verticalPosition, setCoinCount]);

  useEffect(() => {
    // Check if all coins are collected
    if (coins.every((coin) => !coin.visible)) {
      setShowModal(true); // Show modal when all coins are collected
    }
  }, [coins]);

  const handlePlayAgain = () => {
    setShowModal(false); // Close modal
  
    // Function to randomize platform positions
    const randomizePlatforms = () => {
      const newPlatforms = platforms.map(platform => ({
        ...platform,
        x: Math.floor(Math.random() * (window.innerWidth - platform.width)), // Random x position
        y: Math.floor(Math.random() * (window.innerHeight - platform.height)), // Random y position
      }));
  
      return newPlatforms;
    };
  
    setPlatforms(randomizePlatforms()); // Apply randomized positions
  
    // Reset player position
    setPosition(50); 
    setVerticalPosition(50); 
  };

  const handleExit = () => {
    alert("Thanks for playing!"); // You can handle the exit logic here
  };

  useEffect(() => {
    let animationFrameId;

    const gameLoop = () => {
      setPosition((prev) => prev + velocityX);

      setVerticalPosition((prev) => {
        const nextY = prev + velocityY;

        const onPlatform = platforms.some((platform) =>
          checkPlatformCollision(platform, position, nextY)
        );

        if (onPlatform && velocityY <= 0) {
          setIsJumping(false);
          setVelocityY(0);
          const platformY = platforms.find((platform) =>
            checkPlatformCollision(platform, position, nextY)
          ).y;
          return platformY + 20;
        }

        if (nextY <= groundLevel) {
          setIsJumping(false);
          setVelocityY(0);
          return groundLevel;
        }

        return nextY;
      });

      setVelocityY((prev) => prev - gravity);
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

  const coinStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    backgroundColor: "yellow",
    borderRadius: "50%",
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    border: "2px solid black",
    textAlign: "center",
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
      {coins.map(
        (coin, index) =>
          coin.visible && (
            <div
              key={index}
              style={{
                ...coinStyle,
                left: `${coin.x}px`,
                bottom: `${coin.y + 10}px`,
                border: "1px solid black"
              }}
            ></div>
          )
      )}

      {/* Modal */}
      {showModal && (
        <div style={modalStyle}>
          <h2>Congratulations! You've collected all the coins!</h2>
          <button onClick={handlePlayAgain}>Play Again</button>
          <button onClick={handleExit}>Exit</button>
        </div>
      )}
    </div>
  );
};

export default MoveBox;
