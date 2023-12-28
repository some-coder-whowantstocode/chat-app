import { createContext, useContext, useEffect, useState } from 'react';
import { cancelrequest, createRoom, joinRoom, leaveRoom } from '../wsmethods/roomcontroller';
import { useNavigate } from 'react-router-dom';
import notification from '../assets/notification.wav';
import axios from 'axios';
import io from 'socket.io-client';


const SocketContext = createContext(null);

export function SocketProvider({ children }) {


  const [socket, setSocket] = useState(); /* websocket */
  const [loading, setLoading] = useState(true); /* To show the user when something is going on during which the app can not be used */
  const [state,setstate] = useState('notauthenticated');/* To check if the app is authenticatd or not. */
  const [isinchat,setinchat] = useState(false);/* To know if user is currntly in chat or not */
  const [waiting,setwaiting] = useState(false);/* Make user wait */
  const [err,seterr] = useState(true);/* If error notify the user */
  const [errmsg,seterrmsg] = useState([]);/* store the content of the error here and show it to user */
  const [creation,approvecreation] = useState(false);/* Notify user that room is created */
  const [entry,allowentry] = useState(false);/* Notify user that he has been allowed to the room he requested */
  const [Admin,setAdmin] = useState(false);/* To know if the user is the admin or not */
  const [rejoinmsg,setrem] = useState('want to rejoin room.');
  const [members,setmembers] = useState([]);
  const [adminname,setadminname] = useState();
  
  
  const [notificationsound] = useState(new Audio(notification));
  const navigate = useNavigate();
  console.log('socket rerendering')

  /* Frist get token for establising connection with websocket at backend.*/

  const gettoken = async () => {
  
  const url = 'http://localhost:9310/handshake'
  // const url = 'https://instant-chat-backend.onrender.com/handshake'
  const { data } = await axios.get(url).catch(err =>{
    
console.log(err);
  });
   const { jwtToken } = data;
  sessionStorage.setItem('jwtToken', jwtToken);

  // const wsurl =  `wss://instant-chat-backend.onrender.com`
  const wsurl =  `ws://localhost:9310`

  let socket = io(wsurl, { 
    query: { token: jwtToken },
    transports: ['websocket'],
    withCredentials: true
  });

  socket.on('connect_error', (err) => {
    if(isinchat){
      navigate('/rejoin')

    }
    setinchat(false);
    approvecreation(false);
    allowentry(false);
    console.log(`connect_error due to ${err.message}`);
    setrem('connection lost do you want to rejoin ?');
    
    
  });

  return socket;

}

  
  useEffect(()=>{
    if(state === 'notauthenticated'){
    
        setLoading(true);
        gettoken()
        .then(socket=>{
          setLoading(true);
          setSocket(socket);
          setstate('Authenticated');
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
              setSocket(socket);
              setstate('Authenticated');
            })
            .catch(err=>{
              console.log(err);
              setstate('Authfailed');
            })
            .finally(()=>{
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

   const wanttorejoin =async()=>{
    setwaiting(true);
    let name = sessionStorage.getItem('name');
    let roomid = sessionStorage.getItem('room');
  
    joinRoom(socket,name,roomid);
  }

 
   const wanttoleave =async(temp)=>{
     
     if(temp){
      setrem('want to rejoin room.');
     }
       await leaveRoom(socket,temp);
     
     setinchat(false);
     approvecreation(false);
     allowentry(false);
     setAdmin(false);
     setadminname('');
     setmembers([]);
   }

   const kickedout =async()=>{
    setinchat(false);
    approvecreation(false);
    allowentry(false);
    setAdmin(false);
    setadminname('');
    setmembers([]);
   }
   
 
   const wanttocancel =async()=>{
    await cancelrequest(socket);
     setwaiting(false);
    
 }


 const kickout = async(name)=>{
  if(socket){

    socket.send({
      name:name,
      roomid:sessionStorage.getItem('room'),
      Admin:sessionStorage.getItem('name'),
      type:'kickout'
    })
  }
 }
 
   
 

  useEffect(()=>{
    if(socket && socket.readyState ==0) setwaiting(true);
    if(socket){


      const handleOpen = () => {
       setwaiting(false);
      };

      const handlemessage =(jsondata)=>{

        let timeoutId;
        switch(jsondata.type){
          case "create":
              sessionStorage.setItem('name',jsondata.name);
              sessionStorage.setItem('room',jsondata.roomid);
              setadminname(jsondata.name);
              setinchat(true);
              setmembers([jsondata.name]);
              setAdmin(true);
              approvecreation(true);
            
          break;

          case "response":
           
              if(jsondata.permission === 'Acc')
              {
              let name = jsondata.name;
              let room = jsondata.roomid;
              sessionStorage.setItem('name',name);
              sessionStorage.setItem('room',room);
                  setwaiting(false);
                  setinchat(true);
                  setadminname(jsondata.Admin);
                  setmembers(jsondata.mems)
                  notificationsound.play();
                  allowentry(true);
                  setinchat(true);
              }
              else if(jsondata.permission == 'Dec')
              {
                sessionStorage.removeItem('joinroom');
                sessionStorage.removeItem('joinname');
                let timeoutId;
                seterrmsg(prevdata => {
                  const newMsg = { msg: 'Admin denied your access.', id: Date.now() };
                   timeoutId = setTimeout(() => {
                    seterrmsg(prevdata => prevdata.filter(msg => msg.id !== newMsg.id));
                  }, 3000);
                  return [...prevdata,{ ...newMsg, timeoutId }];
                });
                
                setwaiting(false);
              
                
              }
          break;

          case 'error':
            seterr(true);
           
            
            seterrmsg(prevdata => {
              const newMsg = { msg: jsondata.msg, id: Date.now() };
               timeoutId = setTimeout(() => {
                seterrmsg(prevdata => prevdata.filter(msg => msg.id !== newMsg.id));
              }, 3000);
              return [...prevdata,{ ...newMsg, timeoutId }];
            });
            setwaiting(false);

          break;

          case 'Announcement':
            /* change to admin if you are selected as admin */
            if(jsondata.change){
              if(sessionStorage.getItem('name') === jsondata.newAdmin) setAdmin(true);
              setadminname(jsondata.newAdmin)
            }
            if(jsondata.kickedout){
              kickedout()
              seterrmsg(prevdata => {
                const newMsg = { msg: jsondata.msg, id: Date.now() };
                 timeoutId = setTimeout(() => {
                  seterrmsg(prevdata => prevdata.filter(msg => msg.id !== newMsg.id));
                }, 3000);
                return [...prevdata,{ ...newMsg, timeoutId }];
              });
            }
            /* remove user if left the room */
            if(jsondata.left){
              let copymems = [...members];
              copymems = copymems.filter((m)=>jsondata.name !== m.name)
              setmembers(copymems)
            }

          break;

          case 'Alert':
            if(jsondata.action_required){
              setstate('ConnectionLost')
            }
          break;

          case 'Authentication':
            if(jsondata.status == 'failed'){
              setstate('Authfailed');
            }else{
              setstate('Authenticated')
            }
          break;
        }


        return()=> clearTimeout(timeoutId)
      }

      const handleclose =()=>{
        setstate('ConnectionLost');
      }
  
      socket.addEventListener('open', handleOpen);
      socket.addEventListener('message',handlemessage);
      socket.addEventListener('close',handleclose);


      let timeout;

      if (socket) {
       
        timeout = setInterval(() => {
          socket.emit('ping');
          console.log('ping')
        }, 10000);
  
      }
  
      return () => {
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('message',handlemessage);
        socket.removeEventListener('close',handleclose);
        clearInterval(timeout);

      };
    }
    

},[socket,notificationsound])


const handleconnection =()=>{
  allowentry(false);
  approvecreation(false);
  navigate('/')
}

const reconnect =async()=>{
  setLoading(true);
  let name = sessionStorage.getItem('name');
  let roomid = sessionStorage.getItem('room');
  joinRoom(socket,name,roomid);
  setLoading(false);
}



  return (
    <SocketContext.Provider value={{ kickout,members,Admin,adminname,rejoinmsg,handleconnection,reconnect,wanttorejoin, entry, wanttocancel, wanttojoin , wanttocreate , wanttoleave, creation, socket: socket, loading: loading,state,reopensocket,isinchat,waiting,err,errmsg }}>
      {children}
    </SocketContext.Provider>
  );

}

export function useSocket() {
  return useContext(SocketContext);
}
