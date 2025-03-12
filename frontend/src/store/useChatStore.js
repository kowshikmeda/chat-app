import { create } from "zustand";
import { AxiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await AxiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching users");
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await AxiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
            toast.error("No user selected");
            return;
        }

        try {
            console.log("Receiver ID:", selectedUser._id);
            console.log("Before message send:", messageData);

            const res = await AxiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

            console.log("After message send:", res.data);

            // Append the new message to the list
            set({ messages: [...messages, res.data] });

        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return; // Don't subscribe if no user is selected

        const socket = useAuthStore.getState().socket;
        if (!socket) return; // Prevent errors if socket is null

        socket.on("New Message", (newMessage) => {
            console.log("Received New Message:", newMessage);

            // Check if the new message belongs to the selected chat
            if (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id) {
                set({ messages: [...get().messages, newMessage] });
            }
        });
    },

    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return; // Prevent errors when logging out

        socket.off("New Message");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
