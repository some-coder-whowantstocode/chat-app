import React, { createContext, useContext, useEffect, useState } from 'react';
import { cancelrequest, createRoom, joinRoom, leaveRoom } from '../wsmethods/roomcontroller';
import { useNavigate } from 'react-router-dom';
import notification from '../assets/notification.wav'
import { gettoken } from '../utils/tokenhandler';


const SocketContext = createContext();

export function SocketProvider({ children }) {


  const [socket, setSocket] = useState(); /* websocket */
  const [loading, setLoading] = useState(true); /* To show the user when something is going on during which the app can not be used */
  const [state,setstate] = useState('notauthenticated');/* To check if the app is authenticatd or not. */
  const [isinchat,setinchat] = useState(false);/* To know if user is currntly in chat or not */
  const [waiting,setwaiting] = useState(false);/* Make user wait */
  const [err,seterr] = useState(true);/* If error notify the user */
  const [errmsg,seterrmsg] = useState([]);/* store the content of the error here and show it to user */
  const [creation,approvecreation] = useState();/* Notify user that room is created */
  const [entry,allowentry] = useState();/* Notify user that he has been allowed to the room he requested */
  const [Admin,setAdmin] = useState(false);/* To know if the user is the admin or not */
  
  
  const [notificationsound] = useState(new Audio(notification));
  const navigate = useNavigate();

  /* Frist get token for establising connection with websocket at backend.*/
  
  useEffect(()=>{
    if(state === 'notauthenticated'){
    
        setLoading(true);
        gettoken()
        .then(socket=>{
          setLoading(true);
          setSocket(socket);
          setstate('Authenticated');
          console.log('Authpassed')
        })
        .catch(err=>{
          console.log(err);
          setstate('Authfailed');
        })
        .finally(()=>{
          setLoading(false);
        });

    }
  },[state])

  /* */

  
  const reopensocket =()=>{
    if (state == 'Authfailed' || state == 'ConnectionLost') {
      setLoading(true);

            gettoken().then(socket=>{
          console.log('hey')
              setSocket(socket);
              setstate('Authenticated');
            })
            .catch(err=>{
              setstate('Authfailed');
            })
            .finally(()=>{
              console.log('hoi')
              setLoading(false);
            });
          
        }
  }
      

  
  const wanttocreate =(name,roomid)=>{
    createRoom(socket,name,roomid);
   }
 
   const wanttojoin =async(name,roomid)=>{
     setwaiting(true);
     sessionStorage.setItem('joinname',name);
     sessionStorage.setItem('joinroom',roomid);
   
     joinRoom(socket,name,roomid);
   }
 
   const wanttoleave =async()=>{
     
     if(isinchat){
       await leaveRoom(socket);
     }
     setinchat(false);
     approvecreation(false);
     allowentry(false);
   }
   
 
   const wanttocancel =async()=>{
    await cancelrequest(socket);
     setwaiting(false);
    
 }
 
   
 

  useEffect(()=>{
    if(socket && socket.readyState ==0) setwaiting(true);
    if(socket){


      const handleOpen = () => {
       setwaiting(false);
      };

      const handlemessage =({data})=>{
        const jsondata = JSON.parse(data)
        if(jsondata.type == 'response'){
          if(jsondata.permission === 'Acc')
          {
          let name = sessionStorage.getItem('joinname');
          let room = sessionStorage.getItem('joinroom');
          sessionStorage.setItem('name',name);
          sessionStorage.setItem('room',room);
              setwaiting(false);
              setinchat(true);
              notificationsound.play();
              allowentry(true);
              setinchat(true);
          }else(jsondata.permission == 'Dec')
          {
            sessionStorage.removeItem('joinroom');
            sessionStorage.removeItem('joinname');
              setwaiting(false);
            
          }
      }
 
     else if(jsondata.type === 'error'){
          seterr(true);
          let timeoutId;
          
          seterrmsg(prevdata => {
            const newMsg = { msg: jsondata.msg, id: Date.now() };
             timeoutId = setTimeout(() => {
              seterrmsg(prevdata => prevdata.filter(msg => msg.id !== newMsg.id));
            }, 3000);
            return [...prevdata,{ ...newMsg, timeoutId }];
          });
          setwaiting(false);

          return()=> clearTimeout(timeoutId)
      }
  

    if(jsondata.type === 'create'){
      console.log(jsondata)
      sessionStorage.setItem('name',jsondata.name);
      sessionStorage.setItem('room',jsondata.roomid);
      setinchat(true);
      setAdmin(true);
      approvecreation(true);
    }
      }

      const handleclose =()=>{
        setstate('ConnectionLost');
      }
  
      socket.addEventListener('open', handleOpen);
      socket.addEventListener('message',handlemessage);
      socket.addEventListener('close',handleclose);
  
      return () => {
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('message',handlemessage);
        socket.removeEventListener('close',handleclose);
      };
    }
    

},[socket])


const handleconnection =()=>{
  allowentry(false);
  approvecreation(false);
  navigate('/')
}

const reconnect =async()=>{
  setLoading(true);
  let name = sessionStorage.getItem('name');
  let roomid = sessionStorage.getItem('room');
  await joinRoom(socket,name,roomid);
  setLoading(false);
}



  return (
    <SocketContext.Provider value={{ Admin,handleconnection,reconnect, entry, wanttocancel, wanttojoin , wanttocreate , wanttoleave, creation, socket: socket, loading: loading,state,reopensocket,isinchat,waiting,err,errmsg }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
