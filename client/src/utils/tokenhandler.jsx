import axios from "axios";
import io from 'socket.io-client';

// const url = 'http://localhost:9310/handshake'
const url = 'https://instant-chat-backend.onrender.com/handshake'


export const gettoken = async () => {
  const { data } = await axios.get(url).catch(err => console.log(err));
  const { jwtToken } = data;
  sessionStorage.setItem('jwtToken', jwtToken);

  let socket = io(`ws://localhost:9310`, { // Update this line
    query: { token: jwtToken }, // Send the JWT token as a query parameter
    transports: ['websocket'],
    withCredentials: true
  });

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  return socket;
}
