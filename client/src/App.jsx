import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import {Route, Routes} from 'react-router-dom'
import Chatpage from './pages/Chatpage'
import Authbox from './pages/Authbox'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Authbox/>}/>
      <Route path='/landingpage' element={<LandingPage/>}/>
      <Route path='/chat' element={<Chatpage/>}/>
    </Routes>
  )
}

export default App
