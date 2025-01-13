import React from "react";
import { Route, Routes } from "react-router-dom";

import MoveBox1 from "./components/box/MoveBox";
import Room from "./components/box/Room";

import Room1 from "./components/box/Room1";
import Room2 from "./components/box/Room2";

import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<MoveBox1 />} />
        <Route path="/1" element={<Room />} />
        <Route path="/2" element={<Room1 />} />
        <Route path="/3" element={<Room2 />} />

      </Routes>
    </div>
  );
}

export default App;
