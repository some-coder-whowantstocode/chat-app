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
import Peer from '../services/peer';


const SocketContext = createContext(null);

export function SocketProvider({ children }) {


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
  const [notificationsound] = useState(new Audio(notification));
  const navigate = useNavigate();
  const For = APP_FOR.PRODUCTION
  const SERVER_URL = FOR === APP_FOR.TESTING ? 'http://localhost:9310/handshake' : 'https://instant-chat-backend.onrender.com/handshake';
  const WS_URL = FOR === APP_FOR.TESTING ? 'ws://localhost:9310' : `wss://instant-chat-backend.onrender.com`;
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
  const [requests,setrequests] = useState([]);
  const media = useRef({mic:true,cam:true});

  const popup =(message)=>{
    let timeoutId;
    seterrmsg(prevdata => {
      const newMsg = { msg: message, id: Date.now() };
       timeoutId = setTimeout(() => {
        seterrmsg(prevdata => prevdata.filter(msg => msg.id !== newMsg.id));
      }, 3000);
      return [...prevdata,{ ...newMsg, timeoutId }];
    });
  }

  const copyToclip =()=>{
    const link = `${window.location.origin}/invite/${sessionStorage.getItem('room')}`
    navigator.clipboard.writeText(link);
  }

  const verify =(suitable_condition,name,roomid,key)=>{
    if(curr_poss.activity.main_act !== suitable_condition){
      return false;
    }
    
    if(name){
      const curr_name = sessionStorage.getItem('name');
      if(curr_name !== name) return false;
    }
    
    if(roomid){
      const curr_room = sessionStorage.getItem('room');
      if(curr_room !== roomid) return false;
    }
   
    if(curr_poss.activity.main_act === Actions.USER_ACTIONS.CHAT){
      const curr_key = sessionStorage.getItem('roomkey');
      if(key !== curr_key) return false;
    }

    return true;
    
  }


  const remotemediasize =()=>{
    let copy = {...media_size};
    let num = 0;

    pc.map((p)=>{
      p.active && num++;
    })

    if(pinned){
    num++;
    }    
    num = num? num > 2 ? 2 : num : 1; //keep the num either one or two
    copy.width = innerWidth/num;
    copy.height = innerHeight/num;
    if(copy.height !== media_size.height || copy.width !== media_size.width){
      changesize(copy);
    }
  }

  useEffect(()=>{
  remotemediasize();
  },[pc,pinned])

  const findpeer =(name,Id)=>{
    
        return pc.find(p=>p.name === name && p.Id === Id);
  }

  const replacePeer =(name,Id,newpeer)=>{
    let copy = [...pc];
    
    copy = copy.map((peer)=>{
      if(peer.name === name && peer.Id === Id){
        return newpeer;
      }
      return peer;
    })
  }


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
      remotemediasize()
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
  },[pc])



 

  const removepc =(all,name,Id)=>{
    try{
      if(all){
        addpc([])
       }else{
         if(name){
           let copy = [...pc];
           for(let i = 0;i<copy.length;i++){
            if(copy[i].name === name && copy[i].Id === Id){
              copy[i].Close();
              break;
            }
           }
           addpc(copy);           
          
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
                    removepc(false,p.name,p.Id);
                      // if (p.active === true && p.connecting !== true) {

                      //   let newpeer = new Peer(socket,p.name,p.Id);
                      //   let audio ,video;
                      //   newpeer.connecting = true;
                      //   replacePeer(p.name,p.Id,newpeer);
                      //  let st = await navigator.mediaDevices.getUserMedia({audio:media.current.cam,video:media.current.mic})

                      //     for(const track of  st.getTracks()){
                      //       if(track.kind === 'audio'){
                      //         audio =track;
                      //         setmyaudio(new MediaStream([track]));
                      //       }
                      //       else{
                      //         video =track;
                      //         setmyvideo(new MediaStream([track]));
                      //       }
                      //     }
                        
                      //   const stream = new MediaStream([audio,video]);
                      //   await newpeer.addTracks(stream)
                      //   const offer =await newpeer.getOffer();
                      //   socket.send({
                      //     roomid:sessionStorage.getItem('room'),
                      //     from:sessionStorage.getItem('name'),
                      //      command:Actions.CALL_ACTIONS.R_OFFER,
                      //      type:'videocall',
                      //      des:offer,
                      //      to:newpeer.name,
                      //      Id:newpeer.Id
                      //    })
                      // }
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
   
  },[pc,socket])


  

  /* Frist get token for establising connection with websocket at backend.*/

const gettoken = async () => {
 
  const { data } = await axios.get(SERVER_URL).catch(err =>{
    
console.log(err);
  });
   const { jwtToken } = data;
  sessionStorage.setItem('jwtToken', jwtToken);

  let socket = io(WS_URL, { 
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
    sessionStorage.setItem('name',name);
    sessionStorage.setItem('room',roomid);
    setLoading(true);
    createRoom(socket,name,roomid);
   }
 
   const wanttojoin =async(name,roomid)=>{
     setwaiting(true);
     let copy = {...curr_poss};
     copy.activity.sub_act = Actions.USER_ACTIONS.JOINING_CHAT;
     sessionStorage.setItem('name',name);
     sessionStorage.setItem('room',roomid);
     joinRoom(socket,name,roomid);
   }

   const wanttorejoin =async(rejoin_oldroom)=>{
    // set_room_status('waiting');
    setwaiting(true);
    let name = sessionStorage.getItem('name');
    let roomid = sessionStorage.getItem('room');
    if(rejoin_oldroom){
    let key = sessionStorage.getItem('roomkey');
    socket && socket.send({type:'join',name,roomid,rejoin_oldroom,key});
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
    try{
    Transport(Actions.TRANSPORT_LOCATIONS.REJOIN);
    setAdmin(false);
    setadminname('');
    setmembers([]);
    }catch(err){
      console.log(err);
    }
    
   }
   
 
   const wanttocancel =async()=>{
    try {
      await cancelrequest(socket);
      Transport(curr_poss.last_location)
       setwaiting(false);
    } catch (error) {
      console.log(error);
    }
 }


 const kickout = async(name)=>{
  try {
    socket.send({
      name:name,
      roomid:sessionStorage.getItem('room'),
      Admin:sessionStorage.getItem('name'),
      type:Actions.CHAT_METHODS.KICKOUT
    })
  } catch (error) {
   console.log(error); 
  }
 }
 
  useEffect(()=>{
    if(socket && socket.readyState ==0) {
      
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
          case Actions.CHAT_METHODS.CREATE:
           if( verify(Actions.USER_ACTIONS.IDLE,jsondata.name,jsondata.roomid)){
            setLoading(false);
              sessionStorage.setItem('roomkey',jsondata.key);
              setadminname(jsondata.name);
              Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
              setmembers([jsondata.name]);
              setAdmin(true);
           }
          break;

          case Actions.CHAT_METHODS.JOIN_RESPONSE:
            if( verify(Actions.USER_ACTIONS.IDLE,jsondata.name,jsondata.roomid)){
              if(jsondata.permission === 'Acc')
              {

                const {key} = jsondata;
              sessionStorage.setItem('roomkey',key)
              Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
                  setwaiting(false);
                  setadminname(jsondata.Admin);
                  setmembers(jsondata.mems)
                  notificationsound.play();
              }
              else if(jsondata.permission == 'Dec')
              {
                sessionStorage.removeItem('room');
                sessionStorage.removeItem('name');
               
                popup('Admin denied your access.');

                Transport(curr_poss.last_location)
                setwaiting(false);
              
                
              }
            }
          break;

          case Actions.CHAT_METHODS.ERROR:
           if(jsondata.create){
            setLoading(false);
           }
            popup(jsondata.msg);
          
            setwaiting(false);

          break;

          case Actions.CHAT_METHODS.ANNOUNCEMENT:
            try{
              if( verify(Actions.USER_ACTIONS.CHAT,null,jsondata.roomid,jsondata.key)){

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
                popup(jsondata.msg);
              }
              if(jsondata.left){
                  gonnaleave(true)
                  setrem('want to rejoin room.');
                  Transport(Actions.TRANSPORT_LOCATIONS.REJOIN)
                 setAdmin(false);
                 setadminname('');
                 setmembers([]);
                 setrequests([]);
                }
               
            
            }
            }catch(err){
              console.log('error at socketprovider/announcement :' , err)
            }
            /* change to admin if you are selected as admin */
           
          break;

          case Actions.CHAT_METHODS.ALERT:
            if(jsondata.action_required){
              setstate('ConnectionLost')
            }
          break;

          case Actions.CHAT_METHODS.AUTHENTICATION:
            if(jsondata.status == 'failed'){
              setstate('Authfailed');
            }else{
              setstate('Authenticated')
            }
          break;


          case Actions.CHAT_METHODS.REQUEST:
            notificationsound.play();
            setrequests((prevrequests) => [jsondata, ...prevrequests]);
          break;
  
          case Actions.CHAT_METHODS.REMOVE_REQUEST:
            setrequests((prevrequests) => {
              let arr = prevrequests.filter((r) => r.name != jsondata.name);
              return arr;
            });
          break;
  
          case Actions.CHAT_METHODS.CANCEL_REQUEST:
            setrequests((prevrequests) => {
              let arr = prevrequests.filter((r) => r.name != jsondata.name);
              return arr;
            });
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
    

},[socket,notificationsound,curr_poss,members])


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
      
     
    }, 1000 * 2);


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
        media,
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
        popup,
        pc,
        setpc,
        removepc,
        leaving,
        gonnaleave,
        viewport,
        DEVICE_CHART,
        pinned,
        setpinned,
        media_size,
        requests,
        setrequests,
        findpeer,
        replacePeer,
        copyToclip
        }
        }>
      {children}
    </SocketContext.Provider>
  );

}

export function useSocket() {
  return useContext(SocketContext);
}
