import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes,Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from 'lucide-react'
import {Toaster} from'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
const App = () => {
  const {authUser,checkAuth,ischeckingAuth,onlineUsers}=useAuthStore();

  const {theme}=useThemeStore();
 
  useEffect(()=>{
   checkAuth();
  },[checkAuth])
  
if(ischeckingAuth && !authUser)return (
  <Loader className="size-10 animate-spin"/>
)
  return (
    <div className='' data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to='/login'/>}/>
        <Route path='/signup' element={!authUser?<SignupPage/>:<Navigate to='/'/>}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to='/'/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to='/login'/>}/>
      </Routes>

    <Toaster/>
    </div>
  )
}

export default App