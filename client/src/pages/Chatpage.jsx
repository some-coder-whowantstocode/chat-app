import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketProvider';
import RequestBox from '../components/Chatpage/RequestBox';
import Chat from '../components/Chatpage/Chat';
import notification from '../assets/notification.wav';
import {
  Leave,
  Chathead,
  Chatbox,
  Send,
  CustomInput,
  Chatroom,
  
} from '../components/Chatpage/customstyles'
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const Chatpage = () => {

  const {socket,state,wanttoleave,Admin,reconnect,creation,entry} = useSocket()


    // const location = useLocation();
    const [username,setname] = useState();
    const [roomid,setroomid] = useState();
    const [msgs,setmsgs] = useState([]);
    const [msg,setmsg] = useState();
    const [reqdata,setreqdata] = useState([]);
    const [notificationsound] = useState(new Audio(notification));
   

    const inputref = useRef(null)

    useEffect(()=>{

        setname(sessionStorage.getItem('name'));
        setroomid(sessionStorage.getItem('room'));
    },[])

   


    useEffect(()=>{

      const handleMessage =({data})=>{
        let jsondata = JSON.parse(data);
        if(jsondata.type ==`message`){
          setmsgs(prevmsg=>[...prevmsg,jsondata])
        }else if(jsondata.type == 'request'){
          notificationsound.play()
          setreqdata(prevreqdata =>[jsondata,...prevreqdata])
        }else if(jsondata.type == 'removereq'){

          setreqdata(prevreqdata => {
            let arr = prevreqdata.filter((r)=>r.name != jsondata.name);
            return arr;
          });
        }else if(jsondata.type == 'cancelrequest'){
          setreqdata(prevreqdata => {
            let arr = prevreqdata.filter((r)=>r.name != jsondata.name);
            return arr;
          });
        }
        else if(jsondata.type == 'Announcement'){
          setmsgs(prevmsg=>[...prevmsg,jsondata])
        }

      }


      if(socket){
        socket.addEventListener('message',handleMessage);

        return()=>{
          socket.removeEventListener('message',handleMessage);
        }
      }
     
  },[socket])

  const navigate = useNavigate()

  useEffect(() => {
    if (creation !== true && entry !== true) {
      navigate("/landingpage");
    }
  }, [creation,entry]);


  useEffect(() => {
    const handler = async() => {
        await wanttoleave();
    };

    window.addEventListener('beforeunload', handler);

    return () => {
        window.removeEventListener('beforeunload', handler);
    };
}, []);

    const sendmsg =async()=>{
      try{
        if(msg != ''){
          socket.send(JSON.stringify({
            create:false,
            msg:msg,
            Admin:Admin,
            name:sessionStorage.getItem("name"),
            roomid:sessionStorage.getItem('room')
          }))
          setmsg('')
          inputref.current.value = ''
        }
       
      }catch(err){
        console.log(err)
      }
    }


    useEffect(()=>{

      if(state == 'Authfailed' || state == 'ConnectionLost'){
        reconnect();

      }
    },[state])

   

  return (
    <Chatroom>
      <Loading/>
      <Chathead>
        {roomid}
        </Chathead>

        <Leave 
        onClick={async()=>{
          await wanttoleave();
          navigate('/landingpage')
        }}
        >
          Leave room
        </Leave>
      {
        reqdata.map((rd)=>(
          <RequestBox key={rd.name}  data={rd} />
          ))
      }
      <Chatbox>
      {
        
        msgs.map((msg)=>(
          <Chat m={msg} me={username==msg.name}/>
        ))
      }
      </Chatbox>
      <CustomInput placeholder='write here..' ref={inputref} defaultValue={msg} onChange={(e)=>setmsg(e.target.value)} onKeyUp={(e)=>e.key ==='Enter' && sendmsg()}/>
      <Send onClick={()=>sendmsg()}/>
    </Chatroom>
  )
}

export default Chatpage
