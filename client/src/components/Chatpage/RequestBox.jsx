import React, { useEffect } from 'react'
import { useSocket } from '../../context/SocketProvider';
import {
  Requestcard,
  Nameholder,
  Logo,
  Name,
  Req,
  Res,
  Resbtn
} from './customstyles'


const RequestBox = ({data}) => {

  const {socket} = useSocket()


    const sendresponse =(res)=>{
        try{
            const resp = {
                
                name:data.name,
                roomid:data.roomid,
                admin:sessionStorage.getItem('name'),
                type:'response',
                response:res?'Acc' :'Dec'
            }
            socket.send(resp);
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
      const handleevent =()=>{
        sendresponse(false);
      }
      window.addEventListener('beforeunload',handleevent);

      return()=>{
        window.removeEventListener('beforeunload',handleevent);
      }
    },[])


  return (
    <>
      {(data.name) &&
        <Requestcard>
          <Nameholder> 
            <Logo>{String(data.name).slice(0,1).toUpperCase()}</Logo>
            <Name>{data.name}</Name>
          </Nameholder>
          <Req>
           requests to join would you like to Accept ?
          </Req>
          <Res>
            <Resbtn clr={'#af1818'} onClick={()=>sendresponse(false)} >NO</Resbtn>
            <Resbtn clr={'#036cef'} onClick={()=>sendresponse(true)}>YES</Resbtn>
          </Res>
          </Requestcard>
          }
    </>
  )
}

export default RequestBox
