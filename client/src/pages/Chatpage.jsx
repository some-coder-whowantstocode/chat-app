import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider';
import RequestBox from '../components/Chatpage/RequestBox';
import Chat from '../components/Chatpage/Chat';
import {
  Leave,
  Chathead,
  Chatbox,
  Send,
  CustomInput,
  Chatroom,
  
} from '../components/Chatpage/customstyles'

const Chatpage = () => {

  const {socket,state,updateinchat,isinchat} = useSocket()



    const location = useLocation();
    const [username,setname] = useState();
    const [roomid,setroomid] = useState();
    const [msgs,setmsgs] = useState([]);
    const [msg,setmsg] = useState();
    const [reqdata,setreqdata] = useState([]);
    
   

    const inputref = useRef(null)

    useEffect(()=>{
        if(location.state){
            const {name,room} = location.state;
            setname(name);
            setroomid(room);
            
        }
    },[location.state])

   


    useEffect(()=>{
      if(socket){
        socket.onmessage = ({data})=>{
          let jsondata = JSON.parse(data);
          if(jsondata.type ==`message`){
            console.log(jsondata);
            setmsgs(prevmsg=>[...prevmsg,jsondata])
          }else if(jsondata.type == 'request'){
            setreqdata(prevreqdata =>[jsondata,...prevreqdata])
          }else if(jsondata.type == 'removereq'){

            setreqdata(prevreqdata => {
              let arr = prevreqdata.filter((r)=>r.name != jsondata.name);
              return arr;
            });
          }else if(jsondata.type == 'Announcement'){
            console.log(jsondata)
          }
         
      }
      }
     
  },[socket])

 
    window.addEventListener('beforeunload', (event) => {
      if(isinchat){
        leaveroom()

      }
      });

    const sendmsg =async()=>{
      try{
        // console.log(username,roomid)
        socket.send(JSON.stringify({
          create:false,
          msg:msg,
          name:username,
          roomid:roomid
        }))
        setmsg('')
        inputref.current.value = ''
      }catch(err){
        console.log(err)
      }
    }

    const navigate = useNavigate()

    useEffect(()=>{

      if(state == 'Authfailed' || state == 'ConnectionLost'){
        navigate('/')
      }
    },[state])

    const leaveroom =()=>{
      try{
        socket.send(JSON.stringify({
          leave:true,
          name:username,
          roomid:roomid
        }))
        updateinchat()
        navigate('/landingpage')
      }catch(err){
        console.log(err)
      }
    
    }


  return (
    <Chatroom>
      <Chathead>
        {roomid}
        </Chathead>

        <Leave 
        onClick={()=>leaveroom()}
        >
          Leave room
        </Leave>
      {
        reqdata.map((rd)=>(
          <RequestBox key={rd.name} data={rd}/>
          ))
      }
      <Chatbox>
      {
        
        msgs.map((msg)=>(
          <Chat m={msg} me={username==msg.name}/>
        ))
      }
      </Chatbox>
      <CustomInput ref={inputref} defaultValue={msg} onChange={(e)=>setmsg(e.target.value)} onKeyUp={(e)=>e.key ==='Enter' && sendmsg()}/>
      <Send onClick={()=>sendmsg()}/>
    </Chatroom>
  )
}

export default Chatpage
