import { Routes, Route } from 'react-router-dom';
import Room from "./components/Room";

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Room />} />
      </Routes>
    </div>
  );
};

export default App;
