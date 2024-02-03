import { useEffect, useState, useconnection_state } from 'react'
import back from '../assets/back.jpg'
import  {
    Loading,
    Loader,
    Passed,
    Text,
    Backimg,
    Failed
} from '../components/Auth/cstomstyles'
import {useSocket} from '../context/SocketProvider'
import { Actions } from '../utils/Actions'
// import { useNavigate } from 'react-router-dom'



const Authbox = () => {

    const [dir,setdir] =useState(true);

    const {loading,connection_state,CONNECTION_STATES,reopensocket,Transport} =useSocket()

   
    // const navigate = useNavigate();

  

    
const remove =()=>{
    setdir(!dir)

     setTimeout(() => {
        Transport(Actions.TRANSPORT_LOCATIONS.LANDING_PAGE)
        
    }, 100);
    


}
  return (
    <>

    {
        connection_state === CONNECTION_STATES.INITIAL_STATE &&
        <Loading>
            <div>Connecting please wait...</div>
            <Loader size={50}/>
        </Loading>
    }

    {
        connection_state === CONNECTION_STATES.CONNECTED &&
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
        connection_state === CONNECTION_STATES.FAILED && 
        <Failed>
            <h1>401</h1>

            <p>UnAuthorized access</p>
            <button onClick={()=>reopensocket()}>{loading === false ?'Try Again' : <Loader size={30} />}</button>
        </Failed>
    }

{
        connection_state === CONNECTION_STATES.CONNECTION_LOST && 
        <Failed>
            <h1>OOPS</h1>

            <p>Connection lost.</p>
            <button onClick={()=>reopensocket()}>{loading === false ?'Try Again' : <Loader size={30} />}</button>
        </Failed>
    }
      
    </>
  )
}

export default Authbox
