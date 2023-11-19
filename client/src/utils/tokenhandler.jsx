import axios from "axios";

const url = 'https://instant-chat-backend.onrender.com';

export const gettoken =async()=>{
    
      const {data} =await axios.get(url).catch(err=>console.log(err));
      const {jwtToken} = data;
      sessionStorage.setItem('jwtToken',jwtToken);
      let socket =  new WebSocket(`ws://localhost:9827/${jwtToken}`);
      return socket;
   

  }
