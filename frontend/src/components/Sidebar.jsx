import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from '../skeletons/SidebarSkeleton';
import { User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    isUserLoading,
    setSelectedUser
  } = useChatStore();
  const [showOnlineOnly,setShowOnlineOnly]=useState(false)

  const {onlineUsers} = useAuthStore();

  useEffect(() => {
    getUsers(); // Fetch users when the component mounts
  }, [getUsers]);
 const filteredUsers=showOnlineOnly?users.filter(user=>onlineUsers.includes(user._id)):users;
  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-100 w-full p-5'>
        <div className='flex items-center gap-2'>
          <User className='w-6 h-6' />
          <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
        <div className='mt-3 hidden lg:flex items-center gap-2'>
          <label className='cursor-pointer flex items-center gap-2'>
            <input type="checkbox"
            checked={showOnlineOnly}
            className='checkbox checkbox-sm'
            onChange={(e)=>setShowOnlineOnly(e.target.checked)} />
            <span className='text-sm'>Show Online only</span>
          </label>
          <span className='text-xs text-zinc-500'>({onlineUsers.length-1}online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors 
              ${selectedUser && selectedUser._id === user._id ? "bg-base-200 ring-1 ring-base-100" : ""}`}
          >
            <div className="relative mx-0">
              <img
                src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-200' />
              )}
            </div>

            <div className='hidden lg:block text-left min-w-0 ml-1'>
              <div className='font-medium truncate '>{user.fullName}</div>
              <div className='text-sm text-zinc-400'>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length===0 && (
           <div className='text-center py-4 text-zinc-500'>
           No Users online
         </div>
        )}
       

      </div>
    </aside>
  );
};

export default Sidebar;
