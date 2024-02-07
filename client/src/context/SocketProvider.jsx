import { createContext, useContext, useEffect, useState } from 'react';
import { cancelrequest, createRoom, joinRoom, leaveRoom } from '../services/chat';
import { useNavigate } from 'react-router-dom';
import notification from '../assets/notification.wav';
import axios from 'axios';
import io from 'socket.io-client';
import { useRef } from 'react';
import { Actions } from '../utils/Actions';
import { PATH } from '../utils/Paths';
import { DEVICE_SIZES, DEVICE_CHART } from '../utils/Sizechart';
import { Mediapackup } from '../utils/mediahandler';


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

  const CONNECTION_STATES = {
    CONNECTED:'connected',
    FAILED:'connection_failed',
    CONNECTION_LOST:'was_connected_but_now_lost',
    INITIAL_STATE:'has_not_started_yet'
  }

  const APP_FOR = {
    PRODUCTION:'PRODUCTION',
    TESTING:'TESTING'
  }

  const For = APP_FOR.PRODUCTION
  const [connection_state,setcon] = useState(CONNECTION_STATES.INITIAL_STATE);
  const [ viewport , setview ] = useState(innerWidth <= DEVICE_SIZES.MOBILE.MAX ? DEVICE_CHART.MOBILE : DEVICE_CHART.PC);
  const [socket, setSocket] = useState(); 
  const [loading, setLoading] = useState(true); /* To show the user when something is going on during which the app can not be used */
  const [state,setstate] = useState('notauthenticated');/* To check if the app is authenticatd or not. */
  const [waiting,setwaiting] = useState(false);/* Make user wait */
  const [errmsg,seterrmsg] = useState([]);/* store the content of the error here and show it to user */
  const [Admin,setAdmin] = useState(false);/* To know if the user is the admin or not */
  const [rejoinmsg,setrem] = useState('want to rejoin room.');
  const [members,setmembers] = useState([]);
  const [adminname,setadminname] = useState();
  const [ curr_poss , setcurr ] = useState(
    {
      location:PATH.HOME_PAGE,
      last_location:PATH.HOME_PAGE,
      activity:{
        main_act:Actions.USER_ACTIONS.IDLE,
        sub_act:Actions.USER_ACTIONS.IDLE
      }});
  const myaudio = useRef();
  const myvideo = useRef();
  const [leavechat,setleave] = useState(false);
  const [ leaving , gonnaleave] = useState(false);
  const [pc,addpc] = useState([]);//[{name of the other user,peer}]
  const [ media_size, changesize ] = useState({ width:innerWidth, height:innerHeight });
  const [pinned,setpinned] = useState(false);

  const remotemediasize =()=>{
    let copy = {...media_size};
    let num = pc.length;

    if(pinned){
      num += 1;
    }    
    num = num? num > 2 ? 2 : num : 1; //keep the num bettwen one and two
    copy.width = innerWidth/num;
    copy.height = innerHeight/num;
    if(copy.height !== media_size.height || copy.width !== media_size.width){
      changesize(copy);
    }
  }

  useEffect(()=>{
  remotemediasize();
  },[pc,pinned])




  const setmyaudio =(data)=>{
    myaudio.current = data;
  }
  const setmyvideo =(data)=>{
    myvideo.current = data;
  }
  const setpc =(data)=>{
    addpc(prevdata=>[...prevdata,data])
  }


  const Transport =(command)=>{
    const locations = Actions.TRANSPORT_LOCATIONS;
    let copy = {...curr_poss};
    copy.last_location = window.location.href ;
    switch(command){

      case locations.HOME:
        copy.location = PATH.HOME_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.IDLE;
        copy.activity.sub_act = Actions.USER_ACTIONS.IDLE;
        setcurr(copy);
      break;

      case locations.CHAT :
        copy.location = PATH.CHAT_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.CHAT;
        copy.activity.sub_act = Actions.USER_ACTIONS.CHAT;
        setcurr(copy);
      break;

      case locations.JOIN_CHAT :
        copy.location = PATH.LANDING_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.IDLE;
        copy.activity.sub_act = Actions.USER_ACTIONS.IDLE;
        setcurr(copy);
      break;

      case locations.LANDING_PAGE :
        copy.location = PATH.LANDING_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.IDLE;
        copy.activity.sub_act = Actions.USER_ACTIONS.IDLE;
        setcurr(copy);
      break;

      case locations.MEMBERS :
        copy.location = PATH.MEMBERS_PAGE;
        setcurr(copy);
      break;

      case locations.VIDEO_CHAT :
        copy.location = PATH.VIDEO_CHAT_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.CHAT;
        copy.activity.sub_act = Actions.USER_ACTIONS.VIDEO_CHAT;
        setcurr(copy);
      break;

      case locations.WAITING_ROOM :
        copy.location = PATH.WAITING_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.CHAT;
        copy.activity.sub_act = Actions.USER_ACTIONS.JOINING_VIDEO_CHAT;
        setcurr(copy);
      break;

      case locations.REJOIN:
        copy.location = PATH.REJOIN_PAGE;
        copy.activity.main_act = Actions.USER_ACTIONS.IDLE;
        copy.activity.sub_act = Actions.USER_ACTIONS.IDLE;
        setcurr(copy);
      break;
    }
  }


  useEffect(()=>{

    const handleresize =(e)=>{
      // remotemediasize()
      const { innerWidth } = e.target;

      if( DEVICE_SIZES.PC.MIN <= innerWidth && innerWidth <= DEVICE_SIZES.PC.MAX )
      {
        viewport != DEVICE_CHART.PC && setview(DEVICE_CHART.PC);
      }
      else if( DEVICE_SIZES.MOBILE.MIN <= innerWidth && innerWidth <= DEVICE_SIZES.MOBILE.MAX ){
        viewport != DEVICE_CHART.MOBILE && setview(DEVICE_CHART.MOBILE);
      }
    }

    window.addEventListener('resize',handleresize)

    return ()=>{
      window.removeEventListener('resize',handleresize);
    }
  },[])



 

  const removepc =(all,name,Id)=>{
    try{
      if(all){
        addpc([])
       }else{
         if(name){
           let copy = [...pc];
           let index = -1 ;
           for(let i = 0;i<copy.length;i++){
            if(copy[i].name === name && copy[i].Id === Id){
              index = i;
              break;
            }
           }
           
           if(index != -1){
             copy.splice(index,1);
             if(copy.length>0){
              addpc(copy);
             }else{
              addpc([]);
             }
           }
          
         }
        
       }


    }catch(err){
      console.log(err);
    }
   
   
  }

  useEffect(()=>{
    if(pc.length > 0){
      pc.map((p)=>{
        p.peer.oniceconnectionstatechange = async({ target }) => {
  
          const { iceConnectionState } = target;
          switch (iceConnectionState) {
              case "failed":
                  p.peer.restartIce();
                  break;
  
              case "disconnected":
                  try {
                      if (p.incall === false) {
                          p.Close();
                          removepc(false,p.name,p.Id)
                      }else{
                        const offer =await p.getOffer();
                        socket.send({
                          
                          roomid:sessionStorage.getItem('room'),
                          from:sessionStorage.getItem('name'),
                           command:Actions.CALL_ACTIONS.R_OFFER,
                           type:'videocall',
                           des:offer,
                           to:p.name,
                           Id:p.Id
                         })
                      }
                  } catch (err) {
                      console.log(err);
                  }
                  break;
  
              default:
                  console.log(iceConnectionState);
                  break;
          }
      };
      })
    }
   
  },[pc])


  const [notificationsound] = useState(new Audio(notification));
  const navigate = useNavigate();

  /* Frist get token for establising connection with websocket at backend.*/

  const gettoken = async () => {
    let url,wsurl;

    if(For === APP_FOR.TESTING ){
      url = 'http://localhost:9310/handshake';
      wsurl = 'ws://localhost:9310';
    }else{
      url = 'https://instant-chat-backend.onrender.com/handshake';
      wsurl = `wss://instant-chat-backend.onrender.com`;
    }


 
  const { data } = await axios.get(url).catch(err =>{
    
console.log(err);
  });
   const { jwtToken } = data;
  sessionStorage.setItem('jwtToken', jwtToken);

  let socket = io(wsurl, { 
    query: { token: jwtToken },
    transports: ['websocket'],
    withCredentials: true
  });

  socket.on('connect_error', async(err) => {
    if(curr_poss.activity.sub_act === Actions.USER_ACTIONS.VIDEO_CHAT || curr_poss.activity.sub_act === Actions.USER_ACTIONS.JOINING_VIDEO_CHAT){
     await Mediapackup(Actions.PACKUP_ACTIONS.ALL,{audio:myaudio.current,video:myvideo.current})
    }
    setcon(CONNECTION_STATES.CONNECTION_LOST)
    Transport(Actions.TRANSPORT_LOCATIONS.HOME);
    
    
  });

  return socket;

}

  
  useEffect(()=>{
    if(connection_state === CONNECTION_STATES.INITIAL_STATE){
    
        setLoading(true);
        gettoken()
        .then(socket=>{
          setLoading(true);
          setSocket(socket);
          setcon(CONNECTION_STATES.CONNECTED)
        })
        .catch(err=>{
          console.log(err);
          setcon(CONNECTION_STATES.FAILED)
        })
        .finally(()=>{
          setLoading(false);
        });

    }
  },[state])

  /* */

  
  const reopensocket =()=>{
    if (connection_state == CONNECTION_STATES.FAILED || connection_state == CONNECTION_STATES.CONNECTION_LOST) {
      setLoading(true);

            gettoken().then(socket=>{
              setSocket(socket);
              setcon(CONNECTION_STATES.CONNECTED)

            })
            .catch(err=>{
              setcon(CONNECTION_STATES.FAILED)
            })
            .finally(()=>{
              setLoading(false);
            });
          
        }
  }
      

  
  const wanttocreate =(name,roomid)=>{
    setLoading(true);
    createRoom(socket,name,roomid);
   }
 
   const wanttojoin =async(name,roomid)=>{
    // set_room_status('waiting');
     setwaiting(true);
     sessionStorage.setItem('joinname',name);
     sessionStorage.setItem('joinroom',roomid);
   
     joinRoom(socket,name,roomid);
   }

   const wanttorejoin =async(rejoin)=>{
    // set_room_status('waiting');
    setwaiting(true);
    let name = sessionStorage.getItem('name');
    let roomid = sessionStorage.getItem('room');
    if(rejoin){
    let key = sessionStorage.getItem('roomkey');
    socket && socket.send({type:'join',name,roomid,rejoin,key});
    return ;
    }
  
    joinRoom(socket,name,roomid);
  }

 
useEffect(()=>{
  if(leavechat === true && socket  )
  {
    try{
        leaveRoom(socket,true)
        .then(()=>{
          
            setrem('want to rejoin room.');
           setAdmin(false);
           setadminname('');
           setmembers([]);
          Transport(Actions.TRANSPORT_LOCATIONS.REJOIN)
           setleave(false);
        })
        .catch((err)=>{
          throw Error(err);
        })
       
        
      }
 catch(err){
  console.log(err);
 }
  }

},[leavechat,socket,curr_poss])

   const kickedout =async()=>{
    Transport(Actions.TRANSPORT_LOCATIONS.REJOIN);
    setAdmin(false);
    setadminname('');
    setmembers([]);
   }
   
 
   const wanttocancel =async()=>{
    await cancelrequest(socket);
    Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
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
      // set_room_status('waiting');
      
      setwaiting(true);

    }
    if(socket){


      const handleOpen = () => {
        Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
       setwaiting(false);
      };

     
      const handlemessage =(jsondata)=>{

        let timeoutId;
        switch(jsondata.type){
          case CHAT_METHODS.CREATE:
            setLoading(false);
              sessionStorage.setItem('name',jsondata.name);
              sessionStorage.setItem('room',jsondata.roomid);
              sessionStorage.setItem('roomkey',jsondata.key);
              setadminname(jsondata.name);
              Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
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
              Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
                  setwaiting(false);
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
                Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
                setwaiting(false);
              
                
              }
          break;

          case CHAT_METHODS.ERROR:
           if(jsondata.create){
            setLoading(false);
           }
            
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
              if(jsondata.joined){
                setmembers(prevdata=>[...prevdata,jsondata.name])
              }
              if(jsondata.leftroom){
                let copymems = [...members];
                copymems = copymems.filter((m)=>jsondata.name !== m)
                setmembers(copymems);
              }
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
                  Transport(Actions.TRANSPORT_LOCATIONS.REJOIN)
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



    
  
      return () => {
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('message',handlemessage);
        socket.removeEventListener('close',handleclose);
        

      };
    }
    

},[socket,notificationsound,curr_poss])


useEffect(()=>{
  if(!socket ) return;
  if (socket.io._readyState === 'open') {
      let timeout;
    timeout = setInterval(() => {
      const key = sessionStorage.getItem('roomkey');
      const roomid = sessionStorage.getItem('room');
      if( curr_poss.activity.main_act !== Actions.USER_ACTIONS.IDLE ){
        socket.emit('ping',{key,roomid,name:sessionStorage.getItem('name')});
      }
      
     
    }, 1000 * 15);


    return(()=>{
      clearInterval(timeout);
    })

  }


},[socket,curr_poss])




const handleconnection =()=>{
  Transport(Actions.TRANSPORT_LOCATIONS.HOME)
}

const reconnect =async()=>{
  setLoading(true);
  let name = sessionStorage.getItem('name');
  let roomid = sessionStorage.getItem('room');
  joinRoom(socket,name,roomid);
  setLoading(false);
}




useEffect(()=>{
  if(curr_poss.location != curr_poss.last_location){
    navigate(curr_poss.location);
  }
},[curr_poss])


  return (
    <SocketContext.Provider value={
      {
        curr_poss,
        Transport,
        myaudio:myaudio.current,
        myvideo:myvideo.current,
        setmyaudio,
        setmyvideo,
        kickout,
        members,
        setmembers,
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
        leavechat,
        socket,
        loading,
        connection_state,
        CONNECTION_STATES,
        reopensocket,
        waiting,
        errmsg,
        seterrmsg,
        pc,
        setpc,
        removepc,
        leaving,
        gonnaleave,
        viewport,
        DEVICE_CHART,
        pinned,
        setpinned,
        media_size
        }
        }>
      {children}
    </SocketContext.Provider>
  );

}

export function useSocket() {
  return useContext(SocketContext);
}
