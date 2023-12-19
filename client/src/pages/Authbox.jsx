import { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'



const Authbox = () => {

    const [dir,setdir] =useState(true);

    const {loading,state,reopensocket} =useSocket()

   
    const navigate = useNavigate();

    
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
            <Loader size={50}/>
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
            <h1>401</h1>

            <p>UnAuthorized access</p>
            <button onClick={()=>reopensocket()}>{loading === false ?'Try Again' : <Loader size={30} />}</button>
        </Failed>
    }

{
        state === 'ConnectionLost' && 
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
