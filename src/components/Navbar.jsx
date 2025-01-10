import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>          <Link to="/1">1</Link>
        </li>
        <li><Link to="/1">2</Link></li>
        <li><Link to="/3">3</Link></li>
      </ul>
    </>
  );
};

export default Navbar;
