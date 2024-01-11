import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cancelrequest, createRoom, joinRoom, leaveRoom } from '../wsmethods/roomcontroller';
import { useNavigate } from 'react-router-dom';
import notification from '../assets/notification.wav';
import axios from 'axios';
import io from 'socket.io-client';


const SocketContext = createContext(null);

export function SocketProvider({ children }) {

  const CHAT_METHODS = {
    CREATE:"create",
    JOIN_RESPONSE:"response",
    ERROR:"error",
    ANNOUNCEMENT:"Announcement",
    ALERT:"Alert",
    AUTHENTICATION:"Authentication",
    KICKOUT:"kickout"
  }


  const [socket, setSocket] = useState(); /* websocket */
  const [loading, setLoading] = useState(true); /* To show the user when something is going on during which the app can not be used */
  const [state,setstate] = useState('notauthenticated');/* To check if the app is authenticatd or not. */
  const [waiting,setwaiting] = useState(false);/* Make user wait */
  const [err,seterr] = useState(true);/* If error notify the user */
  const [errmsg,seterrmsg] = useState([]);/* store the content of the error here and show it to user */
  const [Admin,setAdmin] = useState(false);/* To know if the user is the admin or not */
  const [rejoinmsg,setrem] = useState('want to rejoin room.');
  const [members,setmembers] = useState([]);
  const [adminname,setadminname] = useState();
  const [ room_status , set_room_status ] = useState("not in room");/* [not in room,waiting,in room] */
  const [videocallstatus , setstatus] = useState('not_in_call');/* [ not_in_call , preparing_to_join , in_video_call ] */
  const [myaudio,addaudio] = useState();
  const [myvideo,addvideo] = useState();
  const [leavecall,setleave] = useState(false);
  const [ leaving , gonnaleave] = useState(false);
  // const [pc,addpc] = useState([]);//[{name of the other user,peer}]
  const pc = useRef([]);//<name,peer,Id,incall>

  const setmyaudio =(data)=>{
    addaudio(data);
  }
  const setmyvideo =(data)=>{
    addvideo(data);
  }
  const setpc =(data)=>{
    pc.current.push(data);
    // addpc(data);
  }

 

  const removepc =(all,name,Id)=>{
    try{
      if(all){
        pc.current = [];
       }else{
         if(name){
           let copy = pc.current;
           let index = -1 ;
           for(let i = 0;i<copy.length;i++){
            if(copy[i].name === name && copy[i].Id === Id){
              index = i;
              break;
            }
           }
           
           console.log(copy,name,index)
           if(index != -1){
             copy.splice(index,1);
             pc.current = copy;
             console.log(copy);
           }
          
         }
        
       }
       console.log(pc.current)
    }catch(err){
      console.log(err);
    }
   
   
  }


  // const [request_processing , req_res ] = useState(false);
  
  const changestatus =(value)=>{
    setstatus(value);
  }
  
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
    if(room_status === "in room"){
      navigate('/rejoin')

    }
    set_room_status('not in room');
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
    set_room_status('waiting');
     setwaiting(true);
     sessionStorage.setItem('joinname',name);
     sessionStorage.setItem('joinroom',roomid);
   
     joinRoom(socket,name,roomid);
   }

   const wanttorejoin =async(rejoin)=>{
    set_room_status('waiting');
    setwaiting(true);
    let name = sessionStorage.getItem('name');
    let roomid = sessionStorage.getItem('room');
    console.log(rejoin)
    if(rejoin){
    let key = sessionStorage.getItem('roomkey');
    socket && socket.send({type:'join',name,roomid,rejoin,key});
    return ;
    }
  
    joinRoom(socket,name,roomid);
  }

 
useEffect(()=>{

  if(leavecall === true && socket && room_status === "in room")
  {
    try{
        console.log('hmm in call')
        console.log(leavecall,room_status)
        leaveRoom(socket,true)
        .then(()=>{
          
            setrem('want to rejoin room.');
           setAdmin(false);
           setadminname('');
           setmembers([]);
           set_room_status('not in room');
           setleave(false);
           console.log('setroom', 'not in room')
          //  sessionStorage.removeItem('name');
          //  sessionStorage.removeItem('room');
          //  sessionStorage.removeItem('roomkey');
        })
        .catch((err)=>{
          throw Error(err);
        })
       
        
      }
 catch(err){
  console.log(err);
 }
  }

},[leavecall,socket,room_status])

   const kickedout =async()=>{
    set_room_status('not in room');
    setAdmin(false);
    setadminname('');
    setmembers([]);
   }
   
 
   const wanttocancel =async()=>{
    await cancelrequest(socket);
    set_room_status('not in room');
     setwaiting(false);
    
 }


 const kickout = async(name)=>{
  if(socket){

    socket.send({
      name:name,
      roomid:sessionStorage.getItem('room'),
      Admin:sessionStorage.getItem('name'),
      type:CHAT_METHODS.KICKOUT
    })
  }
 }
 
   
 

  useEffect(()=>{
    if(socket && socket.readyState ==0) {
      set_room_status('waiting');
      setwaiting(true);

    }
    if(socket){


      const handleOpen = () => {
        set_room_status('not in room');
       setwaiting(false);
      };


     
      const handlemessage =(jsondata)=>{

        let timeoutId;
        switch(jsondata.type){
          case CHAT_METHODS.CREATE:
              sessionStorage.setItem('name',jsondata.name);
              sessionStorage.setItem('room',jsondata.roomid);
              sessionStorage.setItem('roomkey',jsondata.key);
              setadminname(jsondata.name);
              set_room_status('in room');
              setmembers([jsondata.name]);
              setAdmin(true);
            
          break;

          case CHAT_METHODS.JOIN_RESPONSE:
           
              if(jsondata.permission === 'Acc')
              {
                const {name,roomid,key} = jsondata;
              sessionStorage.setItem('name',name);
              sessionStorage.setItem('room',roomid);
              sessionStorage.setItem('roomkey',key)
              set_room_status('in room');
                  setwaiting(false);
                  set_room_status('in room');
                  setadminname(jsondata.Admin);
                  setmembers(jsondata.mems)
                  notificationsound.play();
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
                set_room_status('not in room');
                setwaiting(false);
              
                
              }
          break;

          case CHAT_METHODS.ERROR:
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

          case CHAT_METHODS.ANNOUNCEMENT:
            try{
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
                  gonnaleave(true)
                  setrem('want to rejoin room.');
                  set_room_status('not in room');
                 setAdmin(false);
                 setadminname('');
                 setmembers([]);
               
              }
            
  
            }catch(err){
              console.log('error at socketprovider/announcement :' , err)
            }
            /* change to admin if you are selected as admin */
           
          break;

          case CHAT_METHODS.ALERT:
            if(jsondata.action_required){
              setstate('ConnectionLost')
            }
          break;

          case CHAT_METHODS.AUTHENTICATION:
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
          const key = sessionStorage.getItem('roomkey');
          const roomid = sessionStorage.getItem('room');
          if(room_status === 'in room'){
            socket.emit('ping',{key,roomid});
          }
          
         
        }, 1000 * 5);
  
      }
  
      return () => {
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('message',handlemessage);
        socket.removeEventListener('close',handleclose);
        clearInterval(timeout);

      };
    }
    

},[socket,notificationsound,room_status,videocallstatus])


const handleconnection =()=>{
  set_room_status("not in call")
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
    <SocketContext.Provider value={
      {
        room_status,
        myaudio,
        myvideo,
        setmyaudio,
        setmyvideo,
        changestatus,
        videocallstatus,
        kickout,
        members,
        Admin,
        adminname,
        rejoinmsg,
        handleconnection,
        reconnect,
        wanttorejoin,
        wanttocancel,
        wanttojoin,
        wanttocreate,
        setleave,
        leavecall,
        socket,
        loading,
        state,
        reopensocket,
        waiting,
        err,
        errmsg,
        pc:pc.current,
        setpc,
        removepc,
        leaving,
        gonnaleave
        }
        }>
      {children}
    </SocketContext.Provider>
  );

}

export function useSocket() {
  return useContext(SocketContext);
}
