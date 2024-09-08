import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Create from './pages/Create'
import Search from './pages/Search'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="profile/:userName"  element={<Profile/>}/> 
        <Route path='/create' element={<Create/>}/>
        <Route path='/search' element={<Search/>}/>
      </Routes>
    </>
  )
}

export default App
