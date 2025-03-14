import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js'
import { connectDb } from './libs/db.js';
import cors from 'cors'
import cookieParser from "cookie-parser"
import { app,server } from './libs/socket.js';
import path from 'path';
dotenv.config();
const port=process.env.PORT;
const __dirname=path.resolve();
app.use(express.json({ limit: '10mb' })); 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })

}
server.listen(port,()=>{
    console.log("Server is running on port "+port);
    connectDb();
});