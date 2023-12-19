import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getPeer, getAnswer , getOffer, closePeer } from "../services/peer";
import { useSocket } from "./SocketProvider";
import { Mediacleanup } from "../utils/mediahandler";


const Videocontext = createContext(null);

export function Videochatcontroller({ children }) {
    
    const [pc,setpc] = useState([]);//[{name of the other user,peer}]
    const [icecandidates,setice] = useState([]);
    const [mystreams,setmystreams] = useState();
    const media = useRef({mic:true,cam:true});
    const [remoteVideo,setremote] = useState([]); // [{name , stream}]
    const {socket} = useSocket();
    const [videocallstatus , changestatus] = useState('not_in_call');/* [ not_in_call , preparing_to_join , in_video_call ] */
    const [toggle,settoggle] = useState(true);

    const change_toggle =()=>{
      settoggle(!toggle);
    }

    const change_videocall_status =(value)=>{
      changestatus(value);
    }

    const findpeer = useCallback((name)=>{
    
        if(pc){
          return pc.find(p=>p.name === name).peer;
        }
      },[pc])


      useEffect(()=>{
        const handleice =async(data)=>{
          try{
            let peer = findpeer(data.from);
            if( peer.signalingState !== 'stable'){
              return;
            }
            await peer.addIceCandidate(data.des)
            
          }catch(err){
            console.log(err);
          }
        }
        if(icecandidates.length > 0){
          let icecopy = icecandidates;
          icecopy.map(async(data)=>{
           await handleice(data);
          })
    
          Promise.all(icecopy)
          .then(()=>{
            setice([]);
          })
          .catch((err)=>{
            console.log(err);
          })
        }
      },[icecandidates,findpeer])


    //media department ---------------------------

   
      const Getmedia =useCallback(()=>{
        const {cam,mic} = media.current;
        
        return new Promise((resolve,reject)=>{
          let copy = mystreams;
          navigator.mediaDevices.getUserMedia({audio:mic,video:cam})
          .then((stream)=>{
              resolve(stream);
              setmystreams(stream);
          
          })
          .catch((err)=>{
            if(err.name === 'TypeError'){
                media.current.cam = false;
                media.current.mic = false;
                setmystreams();
            }else{
                reject("Error while getting media in Getmedia : " + err);

            }
          
          })
          .finally(()=>{
            Mediacleanup(copy)
          })
         })
      },[mystreams])
      
      const addTrackstoPeer = useCallback(async(peer,change,givenstream)=>{
        try{
          let stream;
          if(change){
            if(givenstream){
              stream = givenstream;
            }else{
              stream = await Getmedia();

            }
          }else{
            stream = mystreams;
          }
           
           
           stream.getTracks()
           .forEach(async(track)=>{
            const senders = peer.getSenders();
            const senderexists = senders.some((sender)=>sender.track === track);
            if(!senderexists){
              await peer.addTrack(track,stream);
             }else{
               await peer.replaceTrack(track,stream);
             } 
           })
        }catch(err){
          console.log(err)
        }
       
      },[Getmedia,mystreams])

    
      const handlevideo =  async(which)=>{
        try{
          let {mic,cam} = media.current;
          if(which){
            media.current.cam = !cam;
            settoggle(!toggle);
          

          }else{
            media.current.mic = !mic;
          

          }
          Getmedia(true)
          .then((stream)=>{
            pc.forEach(({peer})=>{
              addTrackstoPeer(peer,true,stream);
          })
          })
           
         
        }catch(err){
          console.log(err);
        }
       
       }
      

    //


    //functions--------------------------------
    
    

    const goback =()=>{
      Mediacleanup(mystreams);
      setmystreams();
        setpc([]);
        setremote([]);
    }

    
useEffect(()=>{

    if(pc.length >0 && socket ){
       pc.forEach((p)=>{
         p.peer.onicecandidate =({candidate})=>{
           try{
             socket.send({
               roomid:sessionStorage.getItem('room'),
               from:sessionStorage.getItem('name'),
               command:'icecandidate',
               type:'videocall',
               des:candidate,
               to:p.name
             })
           }catch(err){
             console.log(err);
           }
         };
   
   
       
         p.peer.onnegotiationneeded = () => {
           try{
             let peer = findpeer(p.name)
         
             if (peer.signalingState != 'stable') {
               console.log('Negotiation needed but signaling state is not stable. Delaying...');
               return;
             }
             try {
               getOffer(peer)
             .then(()=>{
               socket.send({
                roomid:sessionStorage.getItem('room'),
                from:sessionStorage.getItem('name'),
                 command:'negoinitiated',
                 type:'videocall',
                 des:peer.localDescription,
                 to:p.name
               })
             })
             .catch(err=>{
               console.log(err);
             })
            
             } catch (err) {
               console.error(err);
             }
           }catch(err){
             console.log(err);
           }
         };
        
         p.peer.oniceconnectionstatechange = ({target}) => {
           const {iceConnectionState} = target;
           switch(iceConnectionState){
             case 'failed':
               target.restartIce();
             break;
   
             default:
               console.log(iceConnectionState);
             break;
           }
         };
   
         // p.peer.onsignalingstatechange =(e)=>{
         //   console.log(e.currentTarget.signalingState)
         // }
   
         p.peer.onconnectionstatechange =()=>{
          // console.log('closed')
       
         }
   
         p.peer.ontrack =({streams})=>{
           try{
             let copy = [...remoteVideo];
             let found = copy.find(v=>v.name === p.name);
             console.log('got tracks')
             if(streams.length >0){
               if(found ){
                //  console.log('found',found.stream.getTracks(),streams[0].getTracks())
                 copy.forEach((v)=>{
                  if( v.name == p.name ) v.stream = streams[0]
                 })
                 
               }else{
                 let newvideo = {name:p.name,stream:streams[0]};
                 copy.push(newvideo);
               }
                 setremote(copy)
       
             }
          
           }catch(err){
             console.log(err);
           }
         }
   
       })
   
   
       
    
     }
   },[pc,socket,remoteVideo,findpeer])
   

    //------------------------------------------------------------


   
    

    useEffect(()=>{


        const handlecall =async(data)=>{
            try{
                switch(data.command){

                    case "offer":
                      { 
                       try{
                       let peer = getPeer();
                      await addTrackstoPeer(peer,false);
                      let ans =  await getAnswer(peer,data.des)
                       
                       socket.send({
                        roomid:sessionStorage.getItem('room'),
                        from:sessionStorage.getItem('name'),
                       command:'sendanswer',
                       type:'videocall',
                       des:ans,
                       to:data.from
                       })   
                       setpc(prevstate=>[...prevstate,{name:data.from,peer:peer}]);
                    
                       }catch(err){
                          console.log(err);
                         }
                       }
         break;
         
         
         case "newmem":
                      { 
                       try{
                         let pc = getPeer();
                         await addTrackstoPeer(pc,false);
                         let offer = await getOffer(pc)
                           socket.send({
                            roomid:sessionStorage.getItem('room'),
                            from:sessionStorage.getItem('name'),
                             command:'offer',
                             type:'videocall',
                             des:offer,
                             to:data.name
                           })
                           setpc(prevstate=>[...prevstate,{name:data.name,peer:pc}]);
                 
                        
                       }catch(err){
                         console.log(err);
                       }
                      }
         break;
         
         case "sendanswer":
                       {
                         try{
                           let peer = findpeer(data.from);
                           if(peer){
                             await peer.setRemoteDescription(data.des);
                           }      
                         }catch(err){
                           console.log(err);
                         }
                     }
         break;
         
        
                    case "negoinitiated":
                      {
                        try{
                        let peer = findpeer(data.from);
                        if(peer.signalingState !== 'stable'){
                          console.log('can not insitiate not stable')
                          return;
                        }
        
                        getAnswer(peer,data.des)
                        .then(()=>{
                          socket.send({
                            roomid:sessionStorage.getItem('room'),
                            from:sessionStorage.getItem('name'),
                            type:'videocall',
                            command:'negodone',
                            des:peer.localDescription,
                            to:data.from,
                          })
                        })
                      
                      }
                      catch(err){
                        console.log(err);
                      }
                     
                      }
                    break;
        
                    case "negodone":
                      {
                        try{
                          let peer = findpeer(data.from);
                          await peer.setRemoteDescription(data.des)
                        }catch(err){
                          console.log(err);
                        }
                       
                      }
                    break;

                    case "left":
                      {
                           try{
                             let copy =[...pc];
                              copy = copy.filter(c=>c.name != data.name);
                              setpc(copy);
                              let copymedia = [...remoteVideo];
                              await Mediacleanup(copymedia.find(c=>c.name === data.name).stream);
                              copymedia = copymedia.filter(c=>c.name !== data.name);
                            }catch(err){
                              console.log(err);
                            }
                      }
                    break;
                   
                    case "icecandidate":
                     { 
                      // console.log('candidate')
                     setice(prevstate=>[...prevstate,data])
                      }
                    break;
        
                    default:
                        console.log(data);
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
    },[socket,pc,addTrackstoPeer,findpeer,remoteVideo])


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

 const leavecall =()=>{
  if(socket ){
    try{
      pc.forEach(({peer})=>{
        closePeer(peer);
      })
  
      
      socket.send({
        type:'videocall',
        command:'leavecall',
        name:sessionStorage.getItem('name'),
        roomid:sessionStorage.getItem('room')
      })
  
      setpc([]);
    }catch(err){
      console.log(err);
    }
    

  }
 }


    return(
        <Videocontext.Provider value={{goback,mystreams,remoteVideo,media,handlevideo,joincall,leavecall,Getmedia,videocallstatus,change_videocall_status,change_toggle,toggle}}>
        {children}
        </Videocontext.Provider>
    )
}

export function useVideo(){
    return useContext(Videocontext);
}