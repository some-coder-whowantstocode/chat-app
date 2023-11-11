import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import {Route, Routes} from 'react-router-dom'
import Chatpage from './pages/Chatpage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/chat' element={<Chatpage/>}/>
    </Routes>
  )
}

export default App
