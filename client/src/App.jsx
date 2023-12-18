import './App.css'
import LandingPage from './pages/LandingPage'
import {Route, Routes} from 'react-router-dom'
import Chatpage from './pages/Chatpage'
import Authbox from './pages/Authbox'
import Confirmation from './pages/Confirmation'
import VideochatPage from './pages/VideochatPage'
import Waitingroom from './pages/Waitingroom'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Authbox/>}/>
      <Route path='/landingpage' element={<LandingPage/>}/>
      <Route path='/chat' element={<Chatpage/>}/>
      <Route path='/rejoin' element={<Confirmation/>}/>
      <Route path='/videochat' element={<VideochatPage/>}/>
      <Route path='/wait' element={<Waitingroom/>}/>
    </Routes>
  )
}

export default App
