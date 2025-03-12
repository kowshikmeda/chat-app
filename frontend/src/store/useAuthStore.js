import {create} from 'zustand'
import {AxiosInstance} from '../lib/axios'
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'
const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:5001":"/";
export const useAuthStore=create((set,get)=>({
  authUser:null,
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth:true,
  onlineUsers:[],
  socket:null,
  checkAuth:async()=>{
    try{
        const res=await AxiosInstance("/auth/check");
        set({authUser:res.data});
        get().connectSocket()
    }catch(error){
        console.log("Error in check Auth:",error);
        set({authUser:null});
    }finally{
        set({isCheckingAuth:false});
    }
  },
  signUp:async(data)=>{
    set({isSigningUp:true})
    try{
      const res=await AxiosInstance.post("/auth/signup",data);
      set({authUser:res.data});
      toast.success("Account created successfully");
      get().connectSocket()
    }catch(error){
      toast.error(error.response.data.message);
    }finally{
      set({isSigningUp:false})
    }
  },
  login:async(data)=>{
    set({isLoggingIn:true})
    try{
      const res=await AxiosInstance.post("/auth/login",data);
      console.log("sender id",res);
      set({authUser:res.data});
      toast.success("Logged in successfully");
      get().connectSocket()

    }catch(error){
      toast.error(error.response.data.message);
    }finally{
      set({isLoggingIn:false})
    }
  },
  logout:async()=>{
    try{
        await AxiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logout Successfully")
        get.disconnectSocket();
    }catch(error){
      toast.error(error.response.data.message);
    }
  },
  updateProfile:async(data)=>{
    set({isUpdatingProfile:true})
    try{
     const res=await AxiosInstance.put("/auth/update-profile",data);
     set({authUser:res.data});
     toast.success("updated profile successfully!!!")
    }catch(error){
      toast.error(error.response.data.message);
    }finally{
      set({isUpdatingProfile:false})
    }
  },
  connectSocket:()=>{
    const {authUser}=get();
    if(!authUser || get().socket?.connected)return;
    const newSocket=io(BASE_URL,{
      query:{
        userId:authUser._id,
      }
    });
    newSocket.connect()
    set({socket:socket})
    newSocket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})
    })
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
        get().socket.disconnect();
        set({ socket: null }); // Reset socket after disconnect
    }
}

}))