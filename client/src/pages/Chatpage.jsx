import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components';
import { AiOutlineSend } from "react-icons/ai";
import { reopenconnection } from '../utils/Reconnection';
import { useSocket } from '../context/SocketProvider';


const min = 750

const Chatroom = styled.div`
height: 1009vh;
width: 100%;
background-color: #ebebeb;

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

const Requestcard = styled.div`
height:160px ;
width: 230px;
background-color: black;
position: fixed;
top: 50%;
left: 50%;
transform: translateX(-50%) translateY(-50%);
`

const Chatpage = () => {

  let ws = useSocket()


    const location = useLocation();
    const [username,setname] = useState();
    const [roomid,setroomid] = useState();
    const [msgs,setmsgs] = useState([]);
    const [msg,setmsg] = useState();
    const [reqbox,setreqbox] = useState(false)
    const [reqdata,setreqdata] = useState(null);

    const inputref = useRef(null)

    useEffect(()=>{
      ws.onmessage =(event)=>{
        console.log(event.data)
      }
    },[])

    useEffect(()=>{
        // console.log(location.state)
        if(location.state){
            const {name,room,wss} = location.state;
            setname(name);
            setroomid(room);
            ws = ws
        }
    },[location.state])

    useEffect(()=>{
      ws.onclose = async () => {
          console.log('Connection closed, trying to reconnect...');
          ws = await reopenconnection();
          console.log('connected')
          
      };

      ws.onmessage = ({data})=>{
          let jsondata = JSON.parse(data);
          if(jsondata.type =`message`){
            console.log(jsondata);
          }else if(jsondata.type = 'request'){
            setreqbox(true);
            setreqdata(data);
            console.log(jsondata);
          }
      }
  },[])

    const sendmsg =async()=>{
      if(ws.readyState === 1 && msg != ''){
        ws.send(JSON.stringify({
          create:false,
          msg:msg,
          name:username,
          roomid:roomid
        }))
        setmsg('')
        inputref.current.value = ''
      }else{
        ws =await reopenconnection();
        ws.onopen = ()=>sendmsg();
      }
    }

    useEffect(()=>{
      reqbox && console.log(reqbox)
    },[reqbox])

  return (
    <Chatroom>
      {reqbox === true &&
        <Requestcard></Requestcard>}
      <CustomInput ref={inputref} defaultValue={msg} onChange={(e)=>setmsg(e.target.value)}/>
      <Send onClick={()=>sendmsg()}/>
    </Chatroom>
  )
}

export default Chatpage
