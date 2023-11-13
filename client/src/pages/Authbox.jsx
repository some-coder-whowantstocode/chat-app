import React, { useEffect, useState } from 'react'
import back from '../assets/back.jpg'
import  {
    Loading,
    Loader,
    Passed,
    Text,
    Backimg,

} from '../components/Auth/cstomstyles'
import {useSocket} from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Failed = styled.div`
    
`

const Authbox = () => {
const [ws,setws] = useState()

    const [dir,setdir] =useState(true);

    const {socket,loading,state,updatestate} =useSocket()
   
    const navigate = useNavigate();

  
    useEffect(()=>{
  if(loading===false){
        setws(socket)
    }
    },[loading,socket])


    


    useEffect(()=>{
        if(ws){
   

        ws.onmessage = ({data})=>{
            const jsondata = JSON.parse(data)
         
            
            if(jsondata.type){
                if(jsondata.status === 'passed'){
                    updatestate('Authenticated')
                }else{
                    updatestate('Authfailed')
                }
            }
        

        }
    }
      
    },[ws])


    
const remove =()=>{
    setdir(!dir)

     setTimeout(() => {
        navigate('/landingpage')
        
    }, 100);
    


}


  return (
    <>

    {
        state === 'notauthenticated' &&
        <Loading>
            <div>Connecting please wait...</div>
            <Loader/>
        </Loading>
    }

    {
        state === 'Authenticated' &&
        <Passed>
            <Backimg src={back}/>
            <Text time='0.5s' adir={dir}>
                <h1>WELCOME</h1>
                <p>There is no need to be alone.</p>
                <button onClick={()=>remove()} className='button-29'>start</button>
            </Text>
        </Passed>
    }

    {
        state === 'Authfailed' && 
        <Failed>
            Authentication Failed
        </Failed>
    }
      
    </>
  )
}

export default Authbox
