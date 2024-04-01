const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const cors = require('cors')
const https = require('https');
const server = https.createServer({
    key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
    cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
    requestCert: false,
    rejectUnauthorized: false
},app)
// const server = https.createServer(app)
var WebSocket = require('ws');
const wss = new WebSocket.Server({server})
app.use(cors({
    origin:'*'
}))
// var s = new server({port:3000});
let Room1 = [];
let Room2 = [];



// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};
wss.on('connection',function(ws){
    ws.on('message',function(message){
        message = JSON.parse(message);
        if(message.type === "name"){
            ws.personName = message.data;
            if(message.room === 'Room 1'){
                Room1.push(ws)
            }
            else Room2.push(ws)

            return;
        }
        console.log("Received: "+message.data);
        // s.clients.forEach(function e(client){
        //     if(client != ws){
        //         client.send(JSON.stringify({
        //             name:ws.personName,
        //             data:message.data
        //             }));
        //     }
            
        // })
        if(message.room==='Room 1'){
            for(let i = 0; i < Room1.length;i++){
                if(Room1[i]!=ws){
                    Room1[i].send(JSON.stringify({
                        name:ws.personName,
                        data:message.data
                        }));
                }
            }
        }
        else{
            for(let i = 0; i < Room2.length;i++){
                if(Room2[i]!=ws){
                    Room2[i].send(JSON.stringify({
                        name:ws.personName,
                        data:message.data
                        }));
                }
            }
        }
        //cái này là gưi riêng cho người gửi tin nhắn đến server
        // ws.send(JSON.stringify({
        //     name:ws.personName,
        //     data:'fromserver'+message.data
        //     }));
    })
   


    ws.on('close',function(){
        console.log("one client closed"+ws.personName)
        Room1 = Room1.filter(function (connection) {
            return connection !== ws;
          });
          Room2 = Room2.filter(function (connection) {
            return connection !== ws;
          });
       
    })
    console.log("one client connected" )
})
app.use('/',(req,res)=>{
    res.send('hello')
})
const port = process.env.PORT||8080
server.listen(port,()=>console.log("server is listening on "+port))