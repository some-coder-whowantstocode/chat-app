import axios from "axios";

const url = 'http://localhost:9310/handshake';

export const gettoken =async()=>{
    
      const {data} =await axios.get(url).catch(err=>console.log(err));
      const {jwtToken} = data;
      sessionStorage.setItem('jwtToken',jwtToken);
      let socket =  new WebSocket(`ws://localhost:9827/${jwtToken}`);
      return socket;
   

  }
