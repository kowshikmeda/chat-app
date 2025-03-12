import { create } from "zustand";
import {AxiosInstance} from '../lib/axios'
import toast from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    getUsers:async()=>{
        set({isUserLoading:true})
        try{
          const res=await AxiosInstance.get("/messages/users");
          set({users:res.data});
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isUserLoading:false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessageLoading:true})
        try{
          const res=await AxiosInstance.get(`/messages/${userId}`);
          set({messages:res.data});
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isMessageLoading:false})
        }
    },
    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get();
        
        
        try{
            console.log("reciever id",selectedUser);
           
           console.log("Before message",messageData)
            const res=await AxiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            console.log("After message",res)
            set({messages:[...messages,res.data]})

        }catch(error){
            toast.error(error.response.data.message)
        }

    },
    subscribeToMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser)return;
        const socket=useAuthStore.getState().socket;
        socket.on("New Message",(newMessage)=>{
            const isMessageSentFromSelectedUser=newMessage.senderId!==selectedUser._id;
            if(isMessageSentFromSelectedUser)return;
            set({messages:[...get().messages,newMessage]})
        })

    },
    unsubscribeFromMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("New Message")

    },
    setSelectedUser:(selectedUser)=>set({selectedUser}),
}))