import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
const  Home = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const handleChange = (e) => {
        setName(e.target.value);
      };
     
    return(
        <div className="App-header">
      <h1 className='neon'>Chat Room</h1>
      <div>
      <div className='RoomForm'>
          {/* Room 1 */}
        <div class="room-square">
    <span>Room 1</span>
    <button  onClick={() => {
                navigate("/Room/Room 1/"+name)
              }}>Tham gia</button>
  </div>
  {/* Room 2 */}
  <div class="room-square">
    <span>Room 2</span>
    <button  onClick={() => {
                navigate("/Room/Room 2/"+name)
              }}>Tham gia</button>
  </div>
      </div>
       
  <div class="wrapper">
    <div class="input-label">Nhập tên</div>
    <input type="text" class="text-input" placeholder="Tên của bạn" value={name} onChange={handleChange}/>
  </div>

        </div>
    </div>
    )
}
export default Home