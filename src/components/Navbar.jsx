import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>          <Link to="/room">1</Link>
        </li>
        <li><Link to="/room1">2</Link></li>
      </ul>
    </>
  );
};

export default Navbar;
