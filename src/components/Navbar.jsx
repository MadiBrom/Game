import { Link } from "react-router-dom";
const Navbar = ({ coinCount }) => {
  console.log('Navbar coinCount:', coinCount);
  return (
    <>
      <ul>
        <li><Link to="/">1</Link></li>

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