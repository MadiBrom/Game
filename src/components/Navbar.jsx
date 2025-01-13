import { Link } from "react-router-dom";
const Navbar = ({ coinCount }) => {
  console.log('Navbar coinCount:', coinCount); // Debugging the prop
  return (
    <>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/1">1</Link></li>
        <li><Link to="/2">2</Link></li>
        <li><Link to="/3">3</Link></li>
      </ul>

      {/* Ensure this div always renders */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontSize: "24px",
        }}
      >
        Coins: {coinCount} {/* Display the coin count */}
      </div>
    </>
  );
};
export default Navbar;