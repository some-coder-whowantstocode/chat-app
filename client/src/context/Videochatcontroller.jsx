import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Peer from '../services/peer';
import { useSocket } from "./SocketProvider";
import { Mediapackup } from "../utils/mediahandler";
import { Actions } from "../utils/Actions";


const Videocontext = createContext(null);

export function Videochatcontroller({ children }) {
  
    const media = useRef({mic:true,cam:true});
    const {
      socket,
      videocallstatus,
      curr_poss,
      myaudio,
      myvideo,
      pc,
      setpc,
      removepc,
      gonnaleave,
      leaving,
      Transport
    } = useSocket();
   
    const remote_stream_list = useRef(new Map());//{username,streamId}
    const [joining_list,setlist] = useState([]);
    const [answer_list,setans] = useState([]);

  
/* adding new member to the video call --------------------------------------------------------------------------*/

    useEffect(()=>{
      if(joining_list.length > 0){
        let list = [...joining_list];

        list = list.map(async(data)=>{
          return new Promise((resolve,reject)=>{
            try{
              const Id = Date.now().toString(36) + Math.random().toString(36).slice(2);
              let peer = new Peer(socket,data.name,Id);
             //console.log(peer)
              const stream = new MediaStream([...myvideo.getTracks(), ...myaudio.getTracks()]);
              peer.addTracks(stream)
             .then(()=>{
              peer.getOffer()
              .then((offer)=>{

              //console.log('offer',offer)

                socket.send({
                  roomid:sessionStorage.getItem('room'),
                  from:sessionStorage.getItem('name'),
                   command:Actions.CALL_ACTIONS.OFFER,
                   type:'videocall',
                   des:offer,
                   to:data.name,
                   video:media.current.cam,
                   audio:media.current.mic,
                   Id
                 })
                 
               
               
              
              setpc(peer)
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
            reject(err);
            }
          })
         

        })
        
        Promise.all(list)
        .then(()=>{
          setlist([]);
        })
        .catch((err)=>{
          console.log("error while adding new",err);
        })
        
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

    


    const findpeer =(name,Id)=>{
    
        if(pc){
          if(Id){
            return pc.find(p=>p.name === name && p.Id === Id);
          }else{
            return pc.find(p=>p.name === name );
          }
          
        }
      }



/*Leave video call */


const leavecall = useCallback(()=>{
  if(socket && curr_poss.activity.sub_act === Actions.USER_ACTIONS.VIDEO_CHAT && leaving === true ){
    console.log('entered')
    try{
      let copy = [...pc];
    copy =copy.map((peer)=>{
        peer.Close();
      })
  Promise.all(copy)
  .then(()=>{
    socket.send({
      type:'videocall',
      command:Actions.CALL_ACTIONS.LEAVE,
      name:sessionStorage.getItem('name'),
      roomid:sessionStorage.getItem('room')
    })
    Transport(Actions.TRANSPORT_LOCATIONS.CHAT)
    removepc(true)
  })
  .catch((err)=>{
    console.log(err);
  })
      
     
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
              //console.log(data,data.command)
                switch(data.command){

                    case Actions.CALL_ACTIONS.OFFER:
                      { 
                      setans(prevstate=>[...prevstate,data])
              console.log('me got offer yayyyyyyyyy',data,answer_list)

                       }
         break;
         
         
         case Actions.CALL_ACTIONS.NEW_JOIN:
           { 
             console.log('new member yayyyyyyyyy')
                        setlist(prevstate=>[...prevstate,data])

                    
                      }
         break;
         
         case Actions.CALL_ACTIONS.ANSWER:
                       {
                        try{
                          let peer = findpeer(data.from,data.Id);
                          if(peer){
                              await peer.handleAnswer(data.des);
                             
                              await peer.addTracks(myvideo,myaudio);
                          }  
                      } catch(err){
                          console.log(err);
                      }
                      
                     }
         break;
         
        
                    case Actions.CALL_ACTIONS.NEGO_INIT:
                      {
                        try{
                          console.log(data,'nego inittiated')
                        let peer = findpeer(data.from,data.Id);
                        if(peer.peer.signalingState !== 'stable'){
                          // //console.log('can not insitiate not stable')
                         console.log('stable')
                          return;
                        }
        
                        peer.handleOffer(data.des)
                        .then((ans)=>{
                         //console.log('nego intit')
                          socket.send({
                            roomid:sessionStorage.getItem('room'),
                            from:sessionStorage.getItem('name'),
                            type:'videocall',
                            command:Actions.CALL_ACTIONS.NEGO_DONE,
                            des:ans,
                            to:data.from,
                            Id:data.Id
                          })
                        })
                      
                      }
                      catch(err){
                        console.log(err);
                      }
                     
                      }
                    break;
        
                    case Actions.CALL_ACTIONS.NEGO_DONE:
                      {
                        try{
                          let peer = findpeer(data.from,data.Id);
                          await peer.handleAnswer(data.des);
                        }catch(err){
                          console.log(err);
                        }
                       
                      }
                    break;

                    case Actions.CALL_ACTIONS.LEFT:
                      {
                       console.log('left so ',pc.length)
                       for(let i = 0;i<pc.length;i++){

                        if(pc[i].name === data.name){
                          pc[i].incall = false;
                          console.log(pc[i])
                          break;
                        }
                       }
                        // pc.forEach((p)=>{
                        //   if(p.name === data.name){
                        //     p.incall = false;
                        //   }
                        // })
                          
                      }
                    break;

                    case Actions.CALL_ACTIONS.MEDIA:
                      {

                        let peer = await findpeer(data.from,data.Id);

                        peer.media_availability = {cam:data.video,mic:data.audio}
                       //console.log(peer.media_availability)

                 
                    }
                    break;
        
                    default:
                       //console.log(data);
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
        <Videocontext.Provider value={{ goback,gonnaleave,remote_stream_list,media,joincall,leavecall}}>
        {children}
        </Videocontext.Provider>
    )
}

export function useVideo(){
    return useContext(Videocontext);
}
