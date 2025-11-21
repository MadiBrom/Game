import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MoveBox from './components/box/MoveBox';
import Room from "./components/box/Room";
import Room1 from "./components/box/Room1";
import Room2 from "./components/box/Room2";
import Navbar from './components/Navbar';

const App = () => {
  const [coinCount, setCoinCount] = useState(0);

  return (
    <div>
      <Navbar coinCount={coinCount} />
      <Routes>
        <Route path="/" element={<MoveBox setCoinCount={setCoinCount} />} /> 
        <Route path="/1" element={<Room />} />
        <Route path="/2" element={<Room1 />} />
        <Route path="/3" element={<Room2 />} />
      </Routes>
    </div>
  );
};

export default App;
