import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home"
import Room from './Pages/Room';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Home/>}/>
      <Route path='/Home' element={<Home/>}/>
      <Route path='/Room/:RoomId/:userName' element={<Room/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
