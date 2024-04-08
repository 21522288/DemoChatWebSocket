import { type } from '@testing-library/user-event/dist/type';
import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
const  Room = () => {
    let { RoomId, userName } = useParams();
    const [message, setMessage] = useState('')
    const [number, setNumber] = useState(1)
    const [avatardefault, setAvatar] = useState('https://cdn.pixabay.com/photo/2024/02/24/22/37/ai-generated-8594846_1280.png')
    // const gettext = document.getElementById('Text')
    const log = document.getElementById('log')
    const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const [sock, setSock] = useState(null)
  useEffect(()=>{
    const a = getRandomAvatar();
    setAvatar(a);
  },[])
  useEffect(() => {
    // const ws = new WebSocket('wss://demochatwebsocket.onrender.com')
    const ws = new WebSocket('ws://localhost:8080')
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
    setNumber(json.roomSize);
    if (json.hasOwnProperty('name')){
      document.querySelector('#log').appendChild(Message(json.name, json.data,false, json.time, json.avt));
    }
  }
}
function getRandomAvatar() {
  var avatars = [
      "https://cdn.pixabay.com/photo/2023/11/03/02/38/ai-generated-8361907_1280.jpg",
      "https://cdn.pixabay.com/photo/2024/02/24/22/37/ai-generated-8594846_1280.png",
      "https://cdn.pixabay.com/photo/2023/06/13/03/42/game-8059847_1280.jpg",
      "https://tse2.mm.bing.net/th?id=OIP.w8wgGNI0uFHRL5ateKu1lQHaHa&pid=Api&P=0&h=220",
      "https://tse3.mm.bing.net/th?id=OIP.WwaA1jSvJBX2-XQq4CHkdwAAAA&pid=Api&P=0&h=220",
  ];

  var randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
}
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    console.log('hhahahha')
    setMessage((prevValue) => prevValue + '\n');
  }
};

function Message(name,text,isYou,timetext,avt){
  var messageContainer = document.createElement("div");
  var messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  var userName = document.createElement("div");
  userName.classList.add("user-name");
  userName.textContent = name;

  var paragraph = document.createElement("pre");
  paragraph.textContent = text;

  var timeText = document.createElement("h6")
  timeText.textContent = timetext;

  var avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = avt;
  avatar.alt = "Avatar";
  if(isYou){
    messageContainer.classList.add("message-container2");
    var div = document.createElement("div");
    div.classList.add("assistDiv");

    var userNameContainer = document.createElement('div')
    userNameContainer.classList.add('userNameContainer')

    var timeContainer = document.createElement('div')
    timeContainer.classList.add('timeContainer')
    // userNameContainer.appendChild(div)
    userNameContainer.appendChild(userName);
    messageContainer.appendChild(div);
    messageContent.appendChild(userNameContainer);
    messageContent.appendChild(paragraph);
    timeContainer.appendChild(timeText);
    messageContent.appendChild(timeContainer);
    messageContainer.appendChild(messageContent);
    messageContainer.appendChild(avatar);
  }
  else{
    messageContainer.classList.add("message-container");
    messageContent.appendChild(userName);
    messageContent.appendChild(paragraph);
    messageContent.appendChild(timeText);
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageContent);
  }
        return messageContainer;
//   return(
//     <div class="message-container">
//     <img class="avatar" src="avatar.jpg" alt="Avatar"/>
//     <div class="message-content">
//         <div class="user-name">{name}</div>
//         <p>{text}</p>
//     </div>
// </div>
//   )
}
    return(
        <div className="Room">
            <h2 style={{marginLeft:10}}>{RoomId}</h2>
            <h6 style={{marginLeft:10}}>Participants: {number}</h6>
  <div class="chat-container">
  <div class="chat-messages" id="log">
  </div>
  <div class="chat-input">
    <textarea  type="text" id='Text' placeholder="Input message..."  value={message} onChange={handleChange}  />
    <button  onClick={() => {
                // var text = gettext.value.trim()
                var time = new Date()
                if(message!='')
                // log.innerHTML+="You: "+message+"<br>"
                var e = Message('You', message,true,time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),avatardefault );
                document.getElementById("log").appendChild(e );
                if (sock !== null && sock.readyState === WebSocket.OPEN) {
            sock.send(JSON.stringify({
                type:"message",
                data:message,
                room:RoomId,
                currentTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar:avatardefault
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