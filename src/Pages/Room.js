import { type } from '@testing-library/user-event/dist/type';
import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
const  Room = () => {
    let { RoomId, userName } = useParams();
    const [message, setMessage] = useState('')
    // const gettext = document.getElementById('Text')
    const log = document.getElementById('log')
    const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const [sock, setSock] = useState(null)
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')
    setSock(ws)
    return () => {
      if (ws.readyState === 1) {
        ws.close()
      } else {
        ws.addEventListener('open', () => {
          ws.close()
        })
      }
    }
  }, [])
//   var  sock = new WebSocket('ws://192.168.1.8:3000');
//   useEffect(() => {
//     return () => {
//       if (sock.readyState === 1) {
//         sock.close()
//       } else {
//         sock.addEventListener('open', () => {
//           sock.close()
//         })
//       }
//     }
//   }, [])
if(sock!=null){
  sock.onopen = function(){
    sock.send(JSON.stringify({
        type:"name",
        data:userName,
        room:RoomId
    }))
  }
  sock.onmessage = function(event){
    var json = JSON.parse(event.data);
    const messageElement = document.createElement('div');
    messageElement.innerText = json.name+": "+json.data;
    document.querySelector('#log').appendChild(messageElement);
    // log.innerText += json.name+": "+event.data+"<br>"
  }
}
  
    return(
        <div className="Room">
            <h2 style={{marginLeft:10}}>{RoomId}</h2>
  <div class="chat-container">
  <div class="chat-messages" id="log">
  </div>
  <div class="chat-input">
    <input type="text" id='Text' placeholder="Nhập tin nhắn..."  value={message} onChange={handleChange}/>
    <button  onClick={() => {
                // var text = gettext.value.trim()
                if(message!='')
                log.innerHTML+="You: "+message+"<br>"
                if (sock !== null && sock.readyState === WebSocket.OPEN) {
            sock.send(JSON.stringify({
                type:"message",
                data:message,
                room:RoomId
            }))
        }
                setMessage('')
                log.scrollTop = log.scrollHeight;
              }}>Send</button>
  </div>
</div>
        </div>
    )
}
export default Room