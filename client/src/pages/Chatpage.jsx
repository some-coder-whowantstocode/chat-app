import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components';
import { AiOutlineSend } from "react-icons/ai";
import { useSocket } from '../context/SocketProvider';
import RequestBox from '../components/Chatpage/RequestBox';
import Chat from '../components/Chatpage/Chat';


const min = 750

const Chatroom = styled.div`
width: 100%;
height: calc(100vw - 160px);
background-color: #ebebeb;
padding-top: 40px;
padding-bottom: 80px;

`

const CustomInput = styled.input`
  
  height: 35px;
  position: fixed;
  bottom: 10px;
  left: 1%;
  font-size: 17px;
  box-shadow: rgba(189, 189, 189, 0.12)0px 2px 4px 0px, rgba(147, 147, 147, 0.32) 0px 2px 16px 0px;
  border: none;
  border-radius: 20px;
  padding: 7px;
  background-color: white;
  ${
    innerWidth<min 
    ?
    ` 
    width:98%;
    box-sizing: border-box;
    `
    :
    `
    width: 600px;
    `
  }

  &:focus{
    outline:none;
  }
`

const Send = styled(AiOutlineSend)`
  position: fixed;
  bottom: 18px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
`

const Chatbox = styled.div`
  display: flex;
  flex-direction: column;
`

const Chathead = styled.div`
  background-color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-weight: 800;
  font-size: 20px;
  position: fixed;
  top: 0;
`

const Leave = styled.div`
  color: #a70303;
  position: fixed;
  top: 6px;
  right: 10px;
  padding: 4px ;
  border-radius: 10px;
  cursor: pointer;
  transition-duration: 0.3s;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  &:hover{
    color: white;
    background-color: #a70303;
  }
`

const Chatpage = () => {

  const {socket} = useSocket()


    const location = useLocation();
    const [username,setname] = useState();
    const [roomid,setroomid] = useState();
    const [msgs,setmsgs] = useState([]);
    const [msg,setmsg] = useState();
    const [reqdata,setreqdata] = useState([]);
    
   

    const inputref = useRef(null)

    useEffect(()=>{
      socket.onmessage =(event)=>{
        console.log(event.data)
      }
    },[socket])

    useEffect(()=>{
        if(location.state){
            const {name,room} = location.state;
            setname(name);
            setroomid(room);
            
        }
    },[location.state])

    useEffect(()=>{

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
  },[socket])

 

    const sendmsg =async()=>{
      try{
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


    const leaveroom =()=>{
      try{
        socket.send(JSON.stringify({
          leave:true,
          name:username,
          roomid:roomid
        }))
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
          <Chat m={msg.msg} me={username==msg.name}/>
        ))
      }
      </Chatbox>
      <CustomInput ref={inputref} defaultValue={msg} onChange={(e)=>setmsg(e.target.value)} onKeyUp={(e)=>e.key ==='Enter' && sendmsg()}/>
      <Send onClick={()=>sendmsg()}/>
    </Chatroom>
  )
}

export default Chatpage
