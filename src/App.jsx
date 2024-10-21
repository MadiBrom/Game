import React from "react";
import { Route, Routes } from "react-router-dom";

import MoveBox from "./components/box/MoveBox";
import Room1 from "./components/Room1";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<MoveBox />} />
        <Route path="/room1" element={<Room1 />} />
      </Routes>
    </div>
  );
}

export default App;
