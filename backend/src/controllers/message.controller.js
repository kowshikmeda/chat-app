import cloudinary from "../libs/cloudinary.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import { getReceiverSocketId, io } from "../libs/socket.js";
export const getUsersForSidebar=async(req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers)
    }catch(error){
        console.log("Error in getusers for sidebar",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getMessages=async(req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({$or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}

        ]});
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in get messages",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export const sendMessage=async(req,res)=>{
    try{
        
        const{text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            let uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
       // console.log("msg obj:",newMessage);
        await newMessage.save();
        const savedmsg=await Message.find({senderId:senderId})
        //console.log("msg obj after saving:",savedmsg);
        const recieverSocketId=getReceiverSocketId(receiverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("New Message",newMessage);
        }
        // todo realtime by socket.io
        res.status(201).json(newMessage);
        
    }catch(error){
        console.log("Error in send messages",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}