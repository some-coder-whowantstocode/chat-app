import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(true);
  const [state,setstate] = useState('notauthenticated')

  useEffect(() => {
    try {
      const url = 'http://localhost:9310/handshake';

      axios.get(url).then(({ data }) => {
        const { jwtToken } = data;
        sessionStorage.setItem('jwtToken',jwtToken);
        let socket = new WebSocket(`ws://localhost:9827/${'jwtToken'}`);
        setSocket(socket);
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

  
  }, []);

  const updatestate =(value)=>{
    setstate(value)
  }

  const reopensocket =()=>{
    if (state == 'Authfailed') {
          
            const jwtToken = sessionStorage.getItem('jwtToken');
            let socket = new WebSocket(`ws://localhost:9827/${jwtToken}`);
            setSocket(socket);
          
        }
  }

  useEffect(() => {
    if (socket) {
      socket.onclose =() => {
      setstate('Authfailed');
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket: socket, loading: loading,state,updatestate,reopensocket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
