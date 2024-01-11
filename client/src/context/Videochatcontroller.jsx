import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getPeer, getAnswer , getOffer, closePeer } from "../services/peer";
import { useSocket } from "./SocketProvider";
import { Mediacleanup } from "../utils/mediahandler";


const Videocontext = createContext(null);

export function Videochatcontroller({ children }) {
    
    const CALL_ACTIONS = {
      OFFER : "offer",
      ANSWER: "answer",
      NEW_JOIN: "newmem",
      NEGO_INIT: "negoinitiated",
      NEGO_DONE: 'negodone',
      ICE:'icecandidate',
      MEDIA:'media',
      LEFT:'leftcall',
      LEAVE:'leavecall'
    }

    const REDUCER_ACTIONS = {
      CREATE:"create",
      UPDATETRACK:"update",
      UPDATEVISIBILITY:"updatemedia",
      DELETE:"delete",
      CLEAR:"clear"
    }



    
    const reducer = (state, action) => {
      console.log(action)
      switch (action.type) {
        case REDUCER_ACTIONS.CREATE:
          state.push(action.payload.stream)
          console.log(state)
          return state


        case REDUCER_ACTIONS.UPDATETRACK:
          console.log(state)
          {
            const {p,newstream} = action.payload
            console.log(state)
            let allstreams = [...state];
            let istheone = allstreams.find((a)=>a.name === p.name && a.Id === p.Id);
            if(istheone)
            { if (istheone.stream !== null) {
              let incomingTracks = newstream.getTracks();
  
                let existingTracks = istheone.stream.getTracks();
                console.log('existing ones',existingTracks)
                
                let audioexists=false, videoexists=false;
                for(let i=0;i<incomingTracks.length;i++){
                  if(incomingTracks[i].kind === 'audio')
                  {
                     audioexists = true;
                    }
                  if(incomingTracks[i].kind === 'video')
                  {
                     videoexists = true;
                    }
                }
              for(let i =0;i<existingTracks.length;i++){
                if( (existingTracks[i].kind === 'audio' && audioexists) || (existingTracks[i].kind === 'video' && videoexists) ) istheone.stream.removeTrack(existingTracks[i])
              }
        
                istheone.stream = new MediaStream([ ...incomingTracks , ...existingTracks]);
  
            } else {
                istheone.stream = newstream;
            }
            allstreams.forEach((copy,index) => {
                if (copy.name === istheone.name) allstreams[index].stream = istheone.stream;
            });
            console.log(state)
            return allstreams;}
        
          }
      break;

        case REDUCER_ACTIONS.UPDATEVISIBILITY:
          {
            let newstate = [...state];

            const {data} = action.payload
            for(let i=0;i<newstate.length;i++){
              console.log(newstate[i].name,data.from)
              if(newstate[i].name === data.from ){
                newstate[i].mic = data.audio;
                newstate[i].cam = data.video;
              }
            }
            return newstate;
          }


        case REDUCER_ACTIONS.DELETE:
        {
          const {name,Id} = action.payload;
          if(name && state.length > 0 && Id){
            let copy = [...state];
            let index = -1 ;
            for(let i = 0;i<copy.length;i++){
             if(state[i].name === name && state[i].Id ===Id){
               index = i; 
               break;
             }
            }

            console.log(state)
            let newstate = [...state];
            newstate.splice(index,1);
            return newstate;
        }
      }
        break;

        case REDUCER_ACTIONS.CLEAR:
        {
          return Array.from([]);
        }

        default:
          return state;
      }

      console.log(state)
    };

  
  
    const [icecandidates,setice] = useState([]);
    const media = useRef({mic:true,cam:true});
    // const [remoteVideo,setremote] = useState([]); // [{name , stream,cam,mic}]
    const [remoteVideo,setremote] = useReducer(reducer,[]); // [{name , stream,cam,mic}]
    const {
      socket,
      videocallstatus,
      changestatus,
      myaudio,
      myvideo,
      setmyaudio,
      setmyvideo,
      pc,
      setpc,
      removepc,
      gonnaleave,
      leaving
    } = useSocket();
   
    const [medialoading,setmediaload] = useState(false);
    const remote_stream_list = useRef(new Map());//{username,streamId}
    const [joining_list,setlist] = useState([]);
    const [answer_list,setans] = useState([]);
    // const [remote_media_status,change_status] = useState([]);/* {name,cam,mic} */


    const Getmedia =useCallback(()=>{
      const {cam,mic} = media.current;
      setmediaload(true);
      return new Promise((resolve,reject)=>{
        let audioTracks = myaudio ? myaudio.getTracks() : [];
        let videoTracks = myvideo ? myvideo.getTracks() : [];
        let copy = new MediaStream([...audioTracks, ...videoTracks]);

        navigator.mediaDevices.getUserMedia({audio:mic,video:cam})
        .then((stream)=>{
          for(const track of  stream.getTracks()){
            if(track.kind === 'audio'){
              setmyaudio(new MediaStream([track]));
            }
            else{
              setmyvideo((new MediaStream([track])));
            }
          }
          // setmystreams(stream);
          resolve(stream);
        
        })
        .catch((err)=>{
          if(err.name === 'TypeError'){
              media.current.cam = false;
              media.current.mic = false;
              setmyaudio();
              setmyvideo();
              // setmystreams();
          }else{
              reject("Error while getting media in Getmedia : " + err);

          }
        
        })
        .finally(()=>{
          Mediacleanup(copy);
      setmediaload(false);
        })
       })
    },[media,myaudio,myvideo])


    const addTrackstoPeer = useCallback(async(peer)=>{
      return new Promise((resolve,reject)=>{
        getmystream()
        .then((stream)=>{
          let tracks = stream.getTracks()
          tracks = tracks.map(async(track)=>{
           const senders = peer.getSenders();
           const senderexists = senders.find((sender)=>sender.track === track);
           if(!senderexists){
             await peer.addTrack(track,stream);
            }else{
              await peer.removeTrack(senderexists);
              await peer.addTrack(track,stream)
            } 
        })

        Promise.all(tracks)
        .then(()=>{
          resolve();
        })
        .catch((err)=>{
          reject(err);
        })
        
      
        })
        .catch((err)=>{
          // reject(err);
          console.log(err);
        })
      })
     
    },[Getmedia])

  
/* adding new member to the video call --------------------------------------------------------------------------*/

    useEffect(()=>{
      if(joining_list.length > 0){
        let list = [...joining_list];

        list = list.map(async(data)=>{
          return new Promise((resolve,reject)=>{
            try{
              let peer = getPeer();
              const Id = Date.now().toString(36) + Math.random().toString(36).slice(2);
           
             addTrackstoPeer(peer)
             .then(()=>{
              getOffer(peer)
              .then((offer)=>{

               

                socket.send({
                  roomid:sessionStorage.getItem('room'),
                  from:sessionStorage.getItem('name'),
                   command:CALL_ACTIONS.OFFER,
                   type:'videocall',
                   des:offer,
                   to:data.name,
                   video:media.current.cam,
                   audio:media.current.mic,
                   Id
                 })
                 
               
               
                  let newremotestream = {
                    name:data.name,
                    stream:null,
                    cam:false,
                    mic:false,
                    Id
                  }
                  setremote({type:REDUCER_ACTIONS.CREATE,payload:{stream:newremotestream}})
              setpc({name:data.name,peer:peer,Id,incall:true})
                  resolve();
                 
              })
              .catch((err)=>{
                reject(err);
              })
             })
            .catch((err)=>{
              reject(err);
            })
            // .finally(()=>{
            // })
                
               
               
             
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
    
    },[joining_list,socket,setpc,addTrackstoPeer])

/* adding new member to the video call ------------------------------------------------------------------------------*/

    useEffect(()=>{
      if(answer_list.length > 0){
        let list = [...answer_list];

        list = list.map(async(data)=>{
          return new Promise((resolve,reject)=>{
            try{
           
              let peer = getPeer();
              const {Id} = data;

              let newremotestream = {
                name:data.from,
                stream:null,
                cam:data.video,
                mic:data.audio,
                Id
              } 
              setremote({type:REDUCER_ACTIONS.CREATE,payload:{stream:newremotestream}})
              console.log()
                  setpc({name:data.from,peer:peer,Id,incall:true});
              addTrackstoPeer(peer)
              .then(()=>{
              
                getAnswer(peer,data.des)
                .then((ans)=>{
                 
                 
    
                  socket.send({
                    roomid:sessionStorage.getItem('room'),
                    from:sessionStorage.getItem('name'),
                   command:CALL_ACTIONS.ANSWER,
                   type:'videocall',
                   des:ans,
                   to:data.from,
                   video:media.current.cam,
                   audio:media.current.mic,
                   Id
                   })   
                  
     
                 
     
                  // setremote(prevdata=>[ ...prevdata , newremotestream ]);6
               
                 
               resolve();
                })
                .catch((err)=>{
                  reject(err);
                })
              

              })
              .catch((err)=>{
                reject(err);
              })
      
              //console.log('got send fuck')
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
    
    },[answer_list,socket,addTrackstoPeer])

    //

    const goback =()=>{
      changestatus('not_in_call')
      Mediacleanup(myaudio);
      Mediacleanup(myvideo);
    }

    // useEffect(()=>{
    //   console.log(remoteVideo)
      
    // },[remoteVideo]);

    const getmystream =useCallback(()=>{
      return new Promise((resolve,reject)=>{
        try{
          let videotracks = myvideo ? myvideo.getTracks() : [];
          let audiotracks = myaudio ? myaudio.getTracks() : [];
          //console.log(videotracks,audiotracks)
          let stream = new MediaStream([...videotracks,...audiotracks]) 
          
          resolve(stream);
        }catch(err){
          reject('error while getting my stream -> ',err);
        }
      })
   
    },[myvideo,myaudio]);



    const findpeer =(name,Id)=>{
    
        if(pc){
          console.log(pc)
          return pc.find(p=>p.name === name && p.Id === Id).peer;
        }
      }


      useEffect(()=>{
        const handleice =async(data)=>{
          try{
            console.log(pc)
            let peer = findpeer(data.from,data.Id);
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
      },[icecandidates])


/*media department ------------------------------------------------------ */
/* 
control media = mediacontroller
*/
   /* it will create new media streams and will remove the previous media */




      
const Mediacontroller =useCallback(async(use)=>{

  if(socket){

          return new Promise((resolve,reject)=>{
            let peers = [...pc];
          switch(use){
            case "add_video":
              navigator.mediaDevices.getUserMedia({video:true})
              .then(async(stream)=>{
                let tracks = stream.getTracks();
                
                setmyvideo(new MediaStream([...tracks]))
                peers = peers.map(async({peer})=>{
                  return new Promise((resolve,reject)=>{
                    const senderexists =peer.getSenders().find((sender)=>sender.track && sender.track.kind === 'video')
                    try{
                      if(senderexists){
                        senderexists.replaceTrack(tracks[0])
                        resolve()
    
                      }else{
                        
                        let othertracks = myaudio ? [...myaudio.getTracks()] : [];
                      peer.addTrack(tracks[0],new MediaStream([...tracks,...othertracks]))
                      resolve()
                      
                      }
                    }catch(err){
                      reject(err);
                    }
                 
                  })
                  

                   
                 
                 
                
                })
                Promise.all(peers)
                .then(()=>{
                  //console.log('true video 1')
                    

                    socket.send({
                      type:'videocall',
                      roomid:sessionStorage.getItem('room'),
                      from:sessionStorage.getItem('name'),
                      command:CALL_ACTIONS.MEDIA,
                      video:true,
                      audio:media.current.mic
                    })

                    //console.log('true video')

                  resolve(true)           
                })
                .catch((err)=>{
                  reject(err)
                })
               
              })
              .catch((err)=>{
                if(err.name === 'NotFoundError'){
                  console.log(err)
                }else{
                    reject("Error while getting media in Getmedia : " + err);
    
                }
              
              })
              .finally(()=>{
                media.current.cam = true;
              })
            break;
  
            case "add_audio":
              
              navigator.mediaDevices.getUserMedia({audio:true})
              .then(async(stream)=>{
                let tracks = stream.getTracks();
                setmyaudio(new MediaStream([...tracks]))
                peers = peers.map(async({peer})=>{
                  return new Promise((resolve,reject)=>{
                    try{
                      const senderexists = peer.getSenders().find((sender)=>sender.track && sender.track.kind === 'audio');
                      if(senderexists){
                        senderexists.replaceTrack(tracks[0]);
                        resolve();
                      }else{
                        let othertracks = myvideo ? [...myvideo.getTracks()] : [];
                        peer.addTrack(tracks[0],new MediaStream([...tracks,...othertracks]))
                        resolve();
                      }
                    }catch(err){
                      reject(err);
                    }
                 
                  })
                

                  
                })
                Promise.all(peers)
                .then(()=>{

                  socket.send({
                    type:'videocall',
                    roomid:sessionStorage.getItem('room'),
                    from:sessionStorage.getItem('name'),
                    command:CALL_ACTIONS.MEDIA,
                    audio:true,
                    video:media.current.cam
                  })
                  resolve(true)           
                })
                .catch((err)=>{
                  reject(err)
                })
              })
              .catch((err)=>{
                if(err.name === 'TypeError'){
                    setmyaudio();
                }else{
                    reject("Error while getting media in Getmedia : " + err);
    
                }
              
              })
              .finally(async()=>{
                media.current.mic = true;
              await Mediacleanup(myaudio); 
              })
            
            break;
  
            case "remove_video":{
              media.current.cam = false;
              let tracks = myvideo.getTracks();
              tracks.forEach((track) => {
                if(track.kind === 'video'){
                  track.stop();
                }
              });
              setmyvideo(new MediaStream([]));
              peers = peers.map(async({peer})=>{
                return new Promise((resolve,reject)=>{
                  try{
                    const senders = peer.getSenders();
                    senders.map((sender)=>{
                      if(sender.track === null){
                         peer.removeTrack(sender);
                        resolve();
                        }
                      else{
                        if(sender.track.kind === 'video'){
                          peer.removeTrack(sender);
                          resolve();
                        }
                      }
                    })
                  }catch(err){
                    reject(err);
                  }
                 
                })
             
              
  
              })
              Promise.all(peers)
              .then(()=>{
                socket.send({
                  type:'videocall',
                  roomid:sessionStorage.getItem('room'),
                  from:sessionStorage.getItem('name'),
                  command:CALL_ACTIONS.MEDIA,
                  video:false,
                  audio:media.current.mic
                })
  
                resolve(true)           
              })
              .catch((err)=>{
                reject(err)
              })
           
            }
              break;
  
            case "remove_audio":
              {
                media.current.mic = false;
  
                  let tracks = myaudio.getTracks();
                  tracks.forEach((track) => {
                    try{
                      if(track.kind === 'audio'){
                        track.stop();
                      }
                    }
                   catch(err){
                    console.log(err);
                   }
                  });
                  setmyaudio(new MediaStream([]));
                  peers = peers.map(async({peer})=>{
                    return new Promise((resolve,reject)=>{
                      try{
                        const senders = peer.getSenders();
                        senders.map((sender)=>{
                          if(sender.track === null){
                             peer.removeTrack(sender);
                            resolve();
                            }
                          else{
                            if(sender.track.kind === 'audio'){
                              peer.removeTrack(sender)
                              resolve();
                            }
                          }
                        })
                      }catch(err){
                        reject(err)
                      }
                    

                    })
                   

                    
                })
                  Promise.all(peers)
                  .then(()=>{
                    socket.send({
                      type:'videocall',
                      roomid:sessionStorage.getItem('room'),
                      from:sessionStorage.getItem('name'),
                      command:CALL_ACTIONS.MEDIA,
                      audio:false,
                      video:media.current.cam
                    })
                    
                    resolve(true)           
                  })
                  .catch((err)=>{
                    console.log(err)
                    reject(err)
                  })
                
             
            }
            break;
  
            default:
              console.log('invalid use requested')
          }
           })

  }        
      },[ myvideo , myaudio , pc , socket ,media])



      
       useEffect(()=>{
        if(videocallstatus === 'preparing_to_join'){
          Getmedia();
        }
      },[videocallstatus]);
      

/*----------------------------------------------------------------------------------------------------------------*/

/*Leave video call */


const leavecall = useCallback(()=>{
  if(socket && videocallstatus === "in_video_call" && leaving === true ){
    console.log('entered')
    try{
      let copy = [...pc];
    copy =copy.map(({peer})=>{
        closePeer(peer);
      })
  Promise.all(copy)
  .then(()=>{
    socket.send({
      type:'videocall',
      command:CALL_ACTIONS.LEAVE,
      name:sessionStorage.getItem('name'),
      roomid:sessionStorage.getItem('room')
    })

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
    console.log(leaving)
    console.log('hmm why leave')
      Mediacleanup(myvideo)
      .then(()=>{
        Mediacleanup(myaudio);
      })
      .then(()=>{
        leavecall();
      })
      .then(()=>{
        setremote({type:REDUCER_ACTIONS.CLEAR});
        console.log('removing media');
        changestatus('not_in_call');
      })
      .catch((err)=>{
        console.log('error while leaving call : ',err);
      })
      .finally(()=>{
    gonnaleave(false);
      
      })
  }
},[leaving,changestatus,myvideo,myaudio,leavecall]);



useEffect(()=>{
  console.log(leaving)
},[leaving])

/* */


    //functions--------------------------------
    
useEffect(()=>{

    if(pc.length >0 && socket ){
       pc.forEach((p)=>{
         p.peer.onicecandidate =({candidate})=>{
           try{
             socket.send({
               roomid:sessionStorage.getItem('room'),
               from:sessionStorage.getItem('name'),
               command:CALL_ACTIONS.ICE,
               type:'videocall',
               des:candidate,
               to:p.name,
               Id:p.Id
             })
           }catch(err){
             console.log(err);
           }
         };
   
   
       
         p.peer.onnegotiationneeded = () => {
           try{
             let peer = findpeer(p.name,p.Id)
         
             if (peer.signalingState != 'stable') {
               //console.log('Negotiation needed but signaling state is not stable. Delaying...');
               return;
             }
             try {
               getOffer(peer)
             .then(()=>{
               socket.send({
                roomid:sessionStorage.getItem('room'),
                from:sessionStorage.getItem('name'),
                 command:CALL_ACTIONS.NEGO_INIT,
                 type:'videocall',
                 des:peer.localDescription,
                 to:p.name,
                 Id:p.Id
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
        
         p.peer.oniceconnectionstatechange = async({target}) => {
           const {iceConnectionState} = target;
           switch(iceConnectionState){
             case 'failed':
               target.restartIce();
             break;

             case "disconnected":
            try{
              console.log('disconnected')
              if(p.incall === false){
                console.log('hmm')
                const {peer,name,Id} = p
                await closePeer(peer);
                removepc(false,name,Id);
                setremote({type:REDUCER_ACTIONS.DELETE,payload:{name,Id}});
              }
            
             }catch(err){
               console.log(err);
             }
             break;
   
             default:
               console.log(iceConnectionState);
             break;
           }
         };
       
   
         p.peer.ontrack = async ({streams}) => {
          console.log(streams)
          setremote({
            type:REDUCER_ACTIONS.UPDATETRACK,
            payload:{
              newstream:streams[0],
              p
            }});
       
      }
      
 
     })
   
   
       
    
     }
   },[pc,socket,remoteVideo,setpc,findpeer,removepc])
   

/*------------------------------------------------------------*/

//console.log('video controller rerendering')
   
    

    useEffect(()=>{


        const handlecall =async(data)=>{
            try{
              //console.log(data,data.command)
                switch(data.command){

                    case CALL_ACTIONS.OFFER:
                      { 
                      setans(prevstate=>[...prevstate,data])
              console.log('me got offer yayyyyyyyyy',data,answer_list)

                       }
         break;
         
         
         case CALL_ACTIONS.NEW_JOIN:
           { 
             console.log('new member yayyyyyyyyy')
                        setlist(prevstate=>[...prevstate,data])

                    
                      }
         break;
         
         case CALL_ACTIONS.ANSWER:
                       {
                        try{
                          let peer = findpeer(data.from,data.Id);
                          if(peer){
                              await peer.setRemoteDescription(data.des);
                             
                              setremote({type:REDUCER_ACTIONS.UPDATEVISIBILITY,payload:{data}})
                              await addTrackstoPeer(peer);
                          }  
                      } catch(err){
                          console.log(err);
                      }
                      
                     }
         break;
         
        
                    case CALL_ACTIONS.NEGO_INIT:
                      {
                        try{
                        let peer = findpeer(data.from,data.Id);
                        if(peer.signalingState !== 'stable'){
                          // //console.log('can not insitiate not stable')
                          return;
                        }
        
                        getAnswer(peer,data.des)
                        .then(()=>{
                          socket.send({
                            roomid:sessionStorage.getItem('room'),
                            from:sessionStorage.getItem('name'),
                            type:'videocall',
                            command:CALL_ACTIONS.NEGO_DONE,
                            des:peer.localDescription,
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
        
                    case CALL_ACTIONS.NEGO_DONE:
                      {
                        try{
                          let peer = findpeer(data.from,data.Id);
                          await peer.setRemoteDescription(data.des)
                        }catch(err){
                          console.log(err);
                        }
                       
                      }
                    break;

                    case CALL_ACTIONS.LEFT:
                      {
                        console.log('left so ')
                        pc.forEach((p)=>{
                          if(p.name === data.name){
                            p.incall = false;
                          }
                        })
                          
                      }
                    break;
                   
                    case CALL_ACTIONS.ICE:
                     { 
                      // //console.log('candidate')
                     setice(prevstate=>[...prevstate,data])
                      }
                    break;

                    case CALL_ACTIONS.MEDIA:
                      {

                        setremote({type:REDUCER_ACTIONS.UPDATEVISIBILITY,payload:{data}})
                 
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
    },[socket,pc,addTrackstoPeer,remoteVideo,setpc,answer_list])

  

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
        <Videocontext.Provider value={{ goback, medialoading,gonnaleave,remote_stream_list, remoteVideo,media,Mediacontroller,joincall,leavecall,Getmedia}}>
        {children}
        </Videocontext.Provider>
    )
}

export function useVideo(){
    return useContext(Videocontext);
}
