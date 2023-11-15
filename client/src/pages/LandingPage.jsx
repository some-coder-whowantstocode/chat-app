import React, { useEffect, useRef, useState } from 'react'
import Nav from '../components/landingpage/Nav'
import image from '../assets/chatgroup.jpg'
import { useNavigate } from 'react-router-dom'
import {useSocket} from '../context/SocketProvider'
import {
    Custombtn,
    Controls,
    Imagechat,
    Page,
    Input,
    Imgcover
} from '../components/landingpage/customstyles'

const LandingPage = () => {

    const pageref = useRef(null);
    const [name,setname] = useState(``);
    const [roomid,setroomid] = useState(``);
    const [ws,setws] = useState()

    const navigate = useNavigate();

   
    const {socket,state,updateinchat} =useSocket()

    if(state == 'Authfailed' || state == 'ConnectionLost'){
        navigate('/')
      }

    useEffect(()=>{
     
        setws(socket)
    
    },[socket])
    
// input style code 
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
                      
                    inputs[i].style=`
                    color:black;
                `
                    }else{
                        titles[i].style = `
                        position: absolute;
                        top: 3px;
                        left:0;
                        transition-duration: 0.5s;
                        font-size: 20px;

                        `
                        inputs[i].style=`
                        color:transparent;

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
            if(jsondata.permission){
                if(jsondata.permission === 'Acc')
                {
                    updateinchat();
                    navigate('/chat',{state:{name:jsondata.name,room:jsondata.roomid}})
                }
            }else if(jsondata.type === 'error'){
                // console.log(jsondata)
            }else if(jsondata.type === 'create'){
                updateinchat();
                navigate('/chat',{state:{name:jsondata.name,room:jsondata.roomid}})
            }
        }
    }
      
    },[ws])

   

    const requestcreate =async()=>{
        try{
            if(ws){
                ws.send(JSON.stringify({create:true,roomid:roomid,name:name}))
         
               
        
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
        autoComplete='off'
       defaultValue={name}
       onChange={(e)=>setname(e.target.value)}
        type="text"  />
        </Input>
      <Input>
      <div>
      <p>Room Id</p>
      </div>
      <input 
      autoComplete='off'
      defaultValue={roomid}
      onChange={(e)=>setroomid(e.target.value)}
      type="text" />
      </Input>
      <Controls>
        <Custombtn  onClick={()=> requestcreate()}>CREATE</Custombtn>
        <Custombtn  onClick={()=> requestjoin()}>JOIN</Custombtn>
      </Controls>
      </div>
     <Imgcover>

      <Imagechat src={image} alt="" />
     </Imgcover>
    </Page>
    </>
  )
}

export default LandingPage
