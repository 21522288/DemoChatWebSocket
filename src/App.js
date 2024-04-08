import './App.css';
import { BrowserRouter, Route, Routes, HashRouter} from "react-router-dom";
import Home from "./Pages/Home"
import Room from './Pages/Room';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* <Route index element={<Home/>}/> */}
      <Route path='/DemoChatWebSocket' exact element={<Home/>}/>
      <Route path='/DemoChatWebSocket/Room/:RoomId/:userName/' exact element={<Room/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
