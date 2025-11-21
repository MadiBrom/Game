import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Room from "./components/box/Room";

import Navbar from './components/Navbar';

const App = () => {
  const [coinCount, setCoinCount] = useState(0);

  return (
    <div>
      <Navbar coinCount={coinCount} />
      <Routes>
        <Route path="/" element={<Room />} />
      </Routes>
    </div>
  );
};

export default App;
