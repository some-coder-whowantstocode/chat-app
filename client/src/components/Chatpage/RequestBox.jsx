import React, { useEffect, useState } from 'react'
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
                response:res?'Acc' :'Dec'
            }
            socket.send(JSON.stringify(resp));
        }catch(err){
            console.log(err)
        }
    }


  return (
    <>
      {(data.name) &&
        <Requestcard>
          <Nameholder> 
            <Logo>{String(data.name).slice(0,1).toUpperCase()}</Logo>
            <Name>{data.name}</Name>
          </Nameholder>
          <Req>
           <span> {data.name} </span>requests to join would you like to Accept ?
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
