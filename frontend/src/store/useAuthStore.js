import { create } from 'zustand';
import { AxiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const  baseURL=import.meta.env.MODE==="development"?"http://localhost:5001/":"/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // Check if user is logged in
  checkAuth: async () => {
    try {
      const res = await AxiosInstance("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();  // Connect socket after login
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup function
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await AxiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();  // Connect socket after signup
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await AxiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();  // Connect socket after login
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Logout function
  logout: async () => {
    try {
      await AxiosInstance.post("/auth/logout");
      get().disconnectSocket(); // Disconnect socket before logging out
      set({ authUser: null });  
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // Profile Update
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await AxiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Connect socket
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    // Update online users when received from the server
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    console.log("Socket connected:", newSocket.id);
  },

  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null }); // Do not clear onlineUsers, let server handle it
      console.log("Socket disconnected");
    }
  },
}));
