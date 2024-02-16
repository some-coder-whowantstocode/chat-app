import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Peer from '../services/peer';
import { useSocket } from "./SocketProvider";
import { Mediapackup } from "../utils/mediahandler";
import { Actions } from "../utils/Actions";


const Videocontext = createContext(null);

export function Videochatcontroller({ children }) {
  
    
    const {
      socket,
      videocallstatus,
      curr_poss,
      myaudio,
      myvideo,
      pc,
      setpc,
      removepc,
      setpinned,
      gonnaleave,
      leaving,
      Transport,
      findpeer,
      replacePeer,
      setmyaudio,
      setmyvideo,
      media
    } = useSocket();
   
    const remote_stream_list = useRef(new Map());//{username,streamId}
    const [joining_list,setlist] = useState([]);
    const [answer_list,setans] = useState([]);

  
/* adding new member to the video call --------------------------------------------------------------------------*/

    useEffect(()=>
    {
      if(joining_list.length > 0)
      {
        let list = [...joining_list];

        list.map(async(data)=>
        {
            try{
              const { name} = data;
        const Id = Date.now().toString(36) + Math.random().toString(36).slice(2);

              let peer = new Peer(socket,name,Id);
              const stream = new MediaStream([...myvideo.getTracks(), ...myaudio.getTracks()]);
             await peer.addTracks(stream)
             
              let offer = await peer.getOffer()
              

                socket.send({
                  roomid:sessionStorage.getItem('room'),
                  from:sessionStorage.getItem('name'),
                   command:Actions.CALL_ACTIONS.OFFER,
                   type:'videocall',
                   des:offer,
                   to:name,
                   video:media.current.cam,
                   audio:media.current.mic,
                   Id
                 })
                     
              setpc(peer)
            
            }catch(err){
              console.log(err);
            }
        })

        setlist([]); 
      }
        
    },[joining_list,socket,setpc,myvideo,myaudio])

/* adding new member to the video call ------------------------------------------------------------------------------*/

    useEffect(()=>{
      if(answer_list.length > 0){
        let list = [...answer_list];

        list = list.map(async(data)=>{
          return new Promise((resolve,reject)=>{
            try{
           
              const {Id} = data;
              let peer = new Peer(socket,data.from,Id);
             
                  setpc(peer)
                  const stream = new MediaStream([...myvideo.getTracks(), ...myaudio.getTracks()]);
              peer.addTracks(stream)
              .then(()=>{
              
                peer.handleOffer(data.des)
                .then((ans)=>{
                 
    
                  socket.send({
                    roomid:sessionStorage.getItem('room'),
                    from:sessionStorage.getItem('name'),
                   command:Actions.CALL_ACTIONS.ANSWER,
                   type:'videocall',
                   des:ans,
                   to:data.from,
                   video:media.current.cam,
                   audio:media.current.mic,
                   Id
                   })
                 
               resolve();
                })
                .catch((err)=>{
                  reject(err);
                })
              

              })
              .catch((err)=>{
                reject(err);
              })
      
              }catch(err){
                 console.log("error while sending answer",err);
                }
          }) 
         

        })
        
        Promise.all(list)
        .catch((err)=>{
          console.log(err);
        })
        setans([]);
        
      }
    
    },[answer_list,socket,myvideo,myaudio,setpc])

    //

    const goback =()=>{
      // changestatus('not_in_call')
      Mediapackup(Actions.PACKUP_ACTIONS.ALL,{audio:myaudio,video:myvideo});
    }


    



/*Leave video call */


const leavecall = useCallback(async()=>{
  if(socket && curr_poss.activity.sub_act === Actions.USER_ACTIONS.VIDEO_CHAT && leaving === true ){
    setpinned(false);
    try{
      let copy = [...pc];

      socket.send({
        type:'videocall',
        command:Actions.CALL_ACTIONS.LEAVE,
        name:sessionStorage.getItem('name'),
        roomid:sessionStorage.getItem('room'),
      })
      for(let i=0;i<copy.length;i++){
        if(!copy[i].active) continue;
        await copy[i].Close();
        const request = {
          type:'videocall',
          command:Actions.CALL_ACTIONS.LEFT,
          to:copy[i].name,
          Id:copy[i].Id,
          name:copy[i].myname,
          roomid:copy[i].roomid
        }
        socket.send(request)
  
      }

          
    Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
    removepc(true)
 
     
    }catch(err){
      console.log(err);
    }
    

  }
 },[videocallstatus,socket,leaving,removepc,pc])


useEffect(()=>{
  if(leaving === true){
    Mediapackup(Actions.PACKUP_ACTIONS.ALL,{video:myvideo,audio:myaudio})
      .then(()=>{
        leavecall();
      })
      .catch((err)=>{
        console.log('error while leaving call : ',err);
      })
      .finally(()=>{
    gonnaleave(false);
      
      })
  }
},[leaving,myvideo,myaudio,leavecall]);


/* */

    

    useEffect(()=>{


        const handlecall =async(data)=>{
            try{
                switch(data.command){

                    case Actions.CALL_ACTIONS.OFFER:
                      { 
                      setans(prevstate=>[...prevstate,data])

                       }
         break;
         
         
         case Actions.CALL_ACTIONS.NEW_JOIN:
           { 
                        setlist(prevstate=>[...prevstate,data])

                    
                      }
         break;

        //  case Actions.CALL_ACTIONS.R_OFFER:
        //   try{
        //     console.log('reconnect offer');
        //     const {Id,from} = data;
        //     let peer = new Peer(socket,from,Id);
        //     removepc(false,from,Id);
        //         replacePeer(from,Id,peer)
                // let audio,video;
                // let st = await navigator.mediaDevices.getUserMedia({audio:media.current.cam,video:media.current.mic})

                // for(const track of  st.getTracks()){
                //   if(track.kind === 'audio'){
                //     audio =track;
                //     setmyaudio(new MediaStream([track]))
                //   }
                //   else{
                //     video =track;
                //     setmyvideo(new MediaStream([track]))
                //   }
                // }
              
                // const stream = new MediaStream([audio, video]);
            // peer.addTracks(stream)
            // .then(()=>{
            
              // peer.handleOffer(data.des)
              // .then((ans)=>{
              //   socket.send({
              //     roomid:sessionStorage.getItem('room'),
              //     from:sessionStorage.getItem('name'),
              //    command:Actions.CALL_ACTIONS.ANSWER,
              //    type:'videocall',
              //    des:ans,
              //    to:data.from,
              //    video:media.current.cam,
              //    audio:media.current.mic,
              //    Id
              //    })
              //   })

              //   // console.log('peer',peer);
              // })
              
        //   }catch(err){
        //     console.log(err);
        //   }
        //  break;
         
         case Actions.CALL_ACTIONS.ANSWER:
                       {
                        try{
                          console.log('reconnect answer');
                          const { from, Id, des } = data;
                          let peer = findpeer(from,Id);
                          if(peer){
                              await peer.handleAnswer(des);
                             
                              await peer.addTracks(myvideo,myaudio);
                              // console.log(peer);
                          }  
                      } catch(err){
                          console.log(err);
                      }
                      
                     }
         break;
         

                    case Actions.CALL_ACTIONS.LEFT:
                      {
                        const { Id, name } = data;
                       for(let i = 0;i<pc.length;i++){
                        if(pc[i].name === name && pc[i].Id === Id){
                          pc[i].incall = false;
                          let timeout = setTimeout(()=>{
                            if(pc[i].active !== false) removepc(false,pc[i].name,pc[i].id);
                            clearTimeout(timeout);
                          },[1000*13])
                          break;
                        }
                       }
                     
                      }
                    break;

                    case Actions.CALL_ACTIONS.MEDIA:
                      {

                        let peer = await findpeer(data.from,data.Id);

                        peer.media_availability = {cam:data.video,mic:data.audio}
                 ;
                    }
                    break;

                    
                 
                }
             
            
            }catch(err){
                console.log(err);
            }
           
        }

        if(socket){
            socket.addEventListener('message',handlecall)

            return()=>{
                socket.removeEventListener('message',handlecall)
            }
        }
    },[socket,pc,setpc,answer_list,myaudio,myvideo])

  

 const joincall =()=>{
    if(socket){
        socket.send({
          type:'videocall',
          enter:true,
          name:sessionStorage.getItem('name'),
          roomid:sessionStorage.getItem('room')
        })
    }
 }


    return(
        <Videocontext.Provider value={{ goback,gonnaleave,remote_stream_list,media,joincall,leavecall,findpeer }}>
        {children}
        </Videocontext.Provider>
    )
}

export function useVideo(){
    return useContext(Videocontext);
}
