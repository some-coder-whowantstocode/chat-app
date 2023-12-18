import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { SocketProvider } from './context/SocketProvider.jsx'
import { Videochatcontroller } from './context/Videochatcontroller.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
     <SocketProvider>
      <Videochatcontroller>
          <App />
      </Videochatcontroller>
     </SocketProvider>
    </BrowserRouter>
)
