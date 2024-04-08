const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const cors = require('cors')
const https = require('http');
// const server = https.createServer({
//     key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
//     cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
//     requestCert: false,
//     rejectUnauthorized: false
// },app)
const server = https.createServer(app)
var WebSocket = require('ws');
const wss = new WebSocket.Server({server})
app.use(cors({
    origin:'*'
}))

let Room1 = [];
let Room2 = [];

wss.on('connection',function(ws){
    ws.on('message',function(message){
        message = JSON.parse(message);
        if(message.type === "name"){
            ws.personName = message.data;
            if(message.room === 'Room1'){
                Room1.push(ws)
            }
            else Room2.push(ws)

            return;
        }
        console.log("Received: "+message.data);
  
        if(message.room==='Room1'){
            for(let i = 0; i < Room1.length;i++){
                if(Room1[i]!=ws){
                    Room1[i].send(JSON.stringify({
                        name:ws.personName,
                        data:message.data,
                        time:message.currentTime,
                        avt:message.avatar
                        }));
                }
                Room1[i].send(JSON.stringify({
                    roomSize:Room1.length
                    }));
            }
        }
        else{
            for(let i = 0; i < Room2.length;i++){
                if(Room2[i]!=ws){
                    Room2[i].send(JSON.stringify({
                        name:ws.personName,
                        data:message.data,
                        time:message.currentTime,
                        avt:message.avatar
                        }));
                }
                Room2[i].send(JSON.stringify({
                    roomSize:Room2.length
                    }));
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