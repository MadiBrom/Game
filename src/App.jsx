import React from "react";
import { Route, Routes } from "react-router-dom";

import MoveBox from "./components/box/MoveBox";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<MoveBox />} />
      </Routes>
    </div>
  );
}

export default App;
