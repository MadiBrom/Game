import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import run0 from "./pics/run0.png";
import run1 from "./pics/run1.png";
import run2 from "./pics/run2.png";
import run3 from "./pics/run3.png";
import run4 from "./pics/run4.png";
import run5 from "./pics/run5.png";
import robo from "./pics/robo.png"; // The PNG that stays with the character
import buttonImage from "./pics/buttonImage.png"; // The image that disguises the button

const runningImages = [run0, run1, run2, run3, run4, run5];

const Room1 = () => {
  const [position, setPosition] = useState(20);
  const [verticalPosition, setVerticalPosition] = useState(200);
  const [isJumping, setIsJumping] = useState(false);
  const [isOnPlatform, setIsOnPlatform] = useState(false);
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

  const [isCloseEnough, setIsCloseEnough] = useState(false); // Track proximity
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [cart, setCart] = useState([]); // Cart state to hold added items

  // Sample items for e-commerce
  const items = [
    { id: 1, name: "Item 1", price: 10, image: "item1.png" },
    { id: 2, name: "Item 2", price: 20, image: "item2.png" },
    { id: 3, name: "Item 3", price: 30, image: "item3.png" },
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
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % runningImages.length);
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

    if (keyState.ArrowUp && !isJumping && !isOnPlatform) {
      setIsJumping(true);
      setIsOnPlatform(false);
      setVelocityY(-jumpStrength);
    }
  }, [keyState, isJumping, isOnPlatform]);

  useEffect(() => {
    const moveWithLag = () => {
      const lagFactor = 0.1;
      setFloatingPosition((prevPosition) => ({
        x: prevPosition.x + (position - prevPosition.x) * lagFactor,
        y: prevPosition.y + (verticalPosition + 100 - prevPosition.y) * lagFactor,
      }));
    };

    const animationFrameId = requestAnimationFrame(moveWithLag);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, verticalPosition]);

  useEffect(() => {
    const jumpInterval = setInterval(() => {
      setVerticalPosition((prevVertical) => {
        let newVertical = prevVertical - velocityY;

        if (newVertical <= groundLevel) {
          setIsJumping(false);
          setIsOnPlatform(false);
          setVelocityY(0);
          return groundLevel;
        }

        return newVertical;
      });

      setPosition((prevPosition) => Math.max(0, Math.min(prevPosition - velocityX, window.innerWidth - 100)));

      if (isJumping || !isOnPlatform) {
        setVelocityY((prevVelocityY) => prevVelocityY + gravity);
      }
    }, 20);

    return () => clearInterval(jumpInterval);
  }, [isJumping, isOnPlatform, velocityX, velocityY, gravity, position, verticalPosition]);

  // Define a fixed position for the button
  const buttonPosition = {
    x: 800, // X position in the room
    y: 150, // Y position in the room
  };

  // Check for proximity between character and button
  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(buttonPosition.x - position, 2) + Math.pow(buttonPosition.y - verticalPosition, 2)
    );
    if (distance < 150) { // Set threshold for proximity
      setIsCloseEnough(true);
    } else {
      setIsCloseEnough(false);
    }
  }, [position, verticalPosition]);

  const handleImageClick = () => {
    if (isCloseEnough) {
      setIsModalOpen(true); // Open modal when button is clicked and close enough
    }
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]); // Add item to cart
  };

  const containerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "green",
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
    zIndex: 10,
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
    zIndex: 9,
    transformOrigin: "center",
    transform: isFlipped ? "scaleX(-1)" : "scaleX(1)",
    cursor: isCloseEnough ? "pointer" : "default", // Change cursor if clickable
  };

  // Style for the static button (always visible)
  const buttonStyle = {
    width: "100px",
    height: "100px",
    position: "fixed",
    bottom: `${buttonPosition.y}px`, // Fixed Y position
    right: `${buttonPosition.x}px`, // Fixed X position
    backgroundImage: `url(${buttonImage})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    zIndex: 11,
    cursor: isCloseEnough ? "pointer" : "default", // Make it clickable only when close
  };

  // Modal Style
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    zIndex: 100,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    display: isModalOpen ? "block" : "none", // Show or hide modal based on state
  };

  return (
    <div style={containerStyle}>
      <div style={characterStyle}>
        <img src={runningImages[currentImageIndex]} alt="Character" />
      </div>
      <div style={robotStyle} onClick={handleImageClick}></div>
      <div style={buttonStyle} onClick={handleImageClick}></div>
      {isModalOpen && (
        <div style={modalStyle}>
          <h2>E-Commerce Store</h2>
          <div>
            {items.map((item) => (
              <div key={item.id}>
                <img src={item.image} alt={item.name} style={{ width: "50px", height: "50px" }} />
                <span>{item.name}</span> - ${item.price}
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
          <h3>Cart:</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Room1;
