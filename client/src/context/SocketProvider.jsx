import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(true);
  const [state,setstate] = useState('notauthenticated');
  const [isinchat,setinchat] = useState(false);
  const [waiting,setwaiting] = useState(false);

      const url = 'http://localhost:9310/handshake';

      const gettoken =async()=>{
        try{
          const {data} =await axios.get(url);
          const {jwtToken} = data;
          sessionStorage.setItem('jwtToken',jwtToken);
          let socket =  new WebSocket(`ws://localhost:9827/${jwtToken}`);
          setSocket(socket);
          setstate('Authenticated')
        }catch(err){
          console.log(err);
        setstate('Authfailed')
        }finally{
          setLoading(false)
        }
       

      }

      useEffect(()=>{
        if(state === 'notauthenticated'){
          gettoken();

        }
      },[state])


  const updatestate =(value)=>{
    setstate(value)
  }

  const updatewait =()=>{
    setwaiting(!waiting);
  }

  const reopensocket =()=>{
    if (state == 'Authfailed' || state == 'ConnectionLost') {
            gettoken();
          
        }
  }

  const updateinchat =()=>{
    setinchat(!isinchat)
  }

  useEffect(() => {
    if (socket) {
      socket.onclose =() => {
      setstate('ConnectionLost');
      };
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket: socket, loading: loading,state,updatestate,reopensocket,isinchat,updateinchat,waiting,updatewait }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
