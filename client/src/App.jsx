import LandingPage from './pages/LandingPage'
import {Route, Routes} from 'react-router-dom'
import Chatpage from './pages/Chatpage'
import Authbox from './pages/Authbox'
import Confirmation from './pages/Confirmation'
import VideochatPage from './pages/VideochatPage'
import Waitingroom from './pages/Waitingroom'
import Members from './components/Chatpage/Members'
import { PATH } from './utils/Paths'
import Invitation from './pages/Invitation'

function App() {

  return (
    <Routes>

      <Route 
      path={ PATH.HOME_PAGE } 
      element={ <Authbox/> }
      />

      <Route 
      path={ PATH.VIDEO_CHAT_PAGE } 
      element={ <VideochatPage/> }
      />

      <Route 
      path={ PATH.LANDING_PAGE } 
      element={ <LandingPage/> }
      />

      <Route 
      path={ PATH.CHAT_PAGE } 
      element={ <Chatpage/> }
      />

      <Route 
      path={ PATH.REJOIN_PAGE } 
      element={ <Confirmation/> }
      />

      <Route 
      path={ PATH.MEMBERS_PAGE } 
      element={ <Members/> }
      />

      <Route 
      path={ PATH.WAITING_PAGE } 
      element={ <Waitingroom/> }
      />

      <Route
      path={PATH.INVITATION_PAGE}
      element={<Invitation/>}
      />
      
    </Routes>
  )
}

export default App
