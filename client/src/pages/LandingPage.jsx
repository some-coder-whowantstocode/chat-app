import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Nav from '../components/landingpage/Nav'
import image from '../assets/chatgroup.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { reopenconnection } from '../utils/Reconnection'
import {useSocket} from '../context/SocketProvider'
// import Authbox from '../components/landingpage/Authbox'

const min = 750;


const Input = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition-duration: 1s;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    input{
        width: 300px;
        height: 30px;
        padding-left: 3px;
        background-color: transparent;
        border: none;
        border: 2px solid #696969;
        border-radius: 5px;
        color: white;
        &:focus{
            transition-delay: 0.1s;
            color: black;
            outline: none;
        }
    }

    div{
        width: 300px;
        position: relative;
        p{
            position: absolute;
            top: 3px;
            left:0;
            transition-duration: 0.3s;
            font-size: 20px;
            color: #696969;
            pointer-events: none;

        }
    }
   
`

const Page = styled.div`
    ${innerWidth > min 
    ?
    `
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content:space-evenly;
    height:100vh;
    `
    :

    `
    width: 100vw;
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content:center ;
     
    `
    
    } 
`

const Imagechat = styled.img`
${innerWidth>min
    ?
    `
    height: 400px;
    width: 400px;
    `
    :
    `
    width: 100vw;
    `
}
    
`

const Controls = styled.div`
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Custombtn = styled.div`
    padding: 2px 8px;
    font-size: 17px;
    cursor: pointer;
    border: none;
    background-color: #0077ff;
    color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    margin-right: 10px;
    text-decoration: none;
`

const LandingPage = () => {

    const pageref = useRef(null);
    const [name,setname] = useState(``);
    const [roomid,setroomid] = useState(``);
    const [ws,setws] = useState()

    const navigate = useNavigate();

    const {socket} =useSocket()

  
    useEffect(()=>{
     
        setws(socket)
    
    },[socket])
    

    useEffect(()=>{
        if(pageref.current){
            const children = pageref.current.children[0].children;
            const titles = [];
            const inputs = [];
            let childs = Array.from(children);
            for(let i=0;i<2;i++){
                inputs.push(childs[i].children[1]);
                titles.push(childs[i].children[0].children[0]);
            }

            const handleclick =()=>{
  
                for(let i=0;i<inputs.length;i++){
                    if(document.activeElement === inputs[i]){
                        titles[i].style = `
                        position: absolute;
                        top: -10px;
                        font-size: 15px;
                        background-color: white;
                        color:gray;
                        `
                    }else{
                        titles[i].style = `
                        position: absolute;
                        top: 3px;
                        left:0;
                        transition-duration: 0.5s;
                        font-size: 20px;
                        `
                    }
                }
            }
            window.addEventListener('click',handleclick);

            return ()=> window.removeEventListener('click',handleclick);  
        }
    },[pageref])




   


    useEffect(()=>{
        if(ws){
   

        ws.onmessage = ({data})=>{
            const jsondata = JSON.parse(data)
            console.log(jsondata.type)
            if(jsondata.permission){
                if(jsondata.permission === 'Acc')
                {
                    console.log()
                    navigate('/chat',{state:{name:jsondata.name,room:jsondata.roomid}})
                }
            }
        }
    }
      
    },[ws])

   

    const requestcreate =async()=>{
        try{
            if(ws){
                ws.send(JSON.stringify({create:true,roomid:roomid,name:name}))
         
                navigate('/chat',{state:{name,room:roomid}})
               
        
            }
           
        }catch(error){
           console.log(error)
        }
        
    }

    const requestjoin =async()=>{
  try{
         if(ws){
            ws.send(JSON.stringify({join:true,roomid:roomid,name:name}))

         }
          
        }catch(error){
           console.log(error)
        }
        
    }


  return (
    <>
    <Nav/>
    <Page
    ref={pageref}
    >
        <div>
        <Input>
        <div>
        <p
        >Name</p>
        </div>
        <input 
       defaultValue={name}
       onChange={(e)=>setname(e.target.value)}
        type="text"  />
        </Input>
      <Input>
      <div>
      <p>Room Id</p>
      </div>
      <input 
      defaultValue={roomid}
      onChange={(e)=>setroomid(e.target.value)}
      type="text" />
      </Input>
      <Controls>
        <Custombtn  onClick={()=> requestcreate()}>CREATE</Custombtn>
        <Custombtn  onClick={()=> requestjoin()}>JOIN</Custombtn>
      </Controls>
      </div>
     
      <Imagechat src={image} alt="" />
    </Page>
    </>
  )
}

export default LandingPage
