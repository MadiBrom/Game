import { Link } from "react-router-dom";
const Navbar = ({ coinCount }) => {
  console.log('Navbar coinCount:', coinCount);
  return (
    <>
      <ul>

        <li><Link to="/">Home</Link></li>
        <li><Link to="/1">1</Link></li>
        <li><Link to="/2">2</Link></li>
        <li><Link to="/3">3</Link></li>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          color: "white",
          fontSize: "24px",
        }}
      >
        Coins: {coinCount}
      </div>
      </ul>

    </>
  );
};
export default Navbar;