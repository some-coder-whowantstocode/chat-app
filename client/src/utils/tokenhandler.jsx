
  import axios from "axios";

  const url = 'https://instant-chat-backend.onrender.com/handshake';
  
  export const gettoken = async () => {
    const { data } = await axios.get(url).catch(err => console.log(err));
    const { jwtToken } = data;
    sessionStorage.setItem('jwtToken', jwtToken);
  
    let socket = new WebSocket(`wss://localhost:443/${jwtToken}`);
  
    socket.onerror = function(error) {
      console.log(`WebSocket Error: ${error}`);
    };
  
    return socket;
  }
  