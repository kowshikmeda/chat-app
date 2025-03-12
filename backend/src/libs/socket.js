import {Server} from 'socket.io'
import express from 'express'
import http from 'http'

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{origin:["http://localhost:5173"],}
    
})
export function getReceiverSocketId(userId){
    return userSocketMap[userId];

}
const userSocketMap={}
io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;}
    else {
        console.log("User ID missing in handshake query");
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);  
      
        const disconnectedUserId = Object.keys(userSocketMap).find(
            key => userSocketMap[key] === socket.id
        );

        if (disconnectedUserId) {
            delete userSocketMap[disconnectedUserId];
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})
export {io,app,server}