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
      LEFT:'left'
    }

    // const REDUCER_ACTIONS = {
    //   CREATE:"create",
    //   UPDATE:"update",
    //   DELETE:"delete"
    // }
    
    // const reducer = (state, action) => {
    //   switch (action.type) {
    //     case REDUCER_ACTIONS.CREATE:
        
    //     break;

    //     case REDUCER_ACTIONS.UPDATE:
        
    //     break;

    //     case REDUCER_ACTIONS.DELETE:
        
    //     break;

    //     default:
    //       return state;
    //   }
    // };
  
    const [icecandidates,setice] = useState([]);
    const media = useRef({mic:true,cam:true});
    const [remoteVideo,setremote] = useState([]); // [{name , stream,cam,mic}]
    // const [remoteVideo,setremote] = useReducer(reducer,[]); // [{name , stream,cam,mic}]
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
      removepc
    } = useSocket();
    const [ leaving , gonnaleave] = useState(false);
    const [medialoading,setmediaload] = useState(false);
    const remote_stream_list = useRef(new Map());//{username,streamId}
    const [joining_list,setlist] = useState([]);
    const [answer_list,setans] = useState([]);
    // const [remote_media_status,change_status] = useState([]);/* {name,cam,mic} */

    useEffect(()=>{
      console.log('answer_listttttttttttttttttttttttttttttttttttttttttttttt',answer_list)
    },[answer_list])

    const removemedia =(name,Id)=>{
      try{
        if(name && remoteVideo.length > 0 && Id){
          let copy = [...remoteVideo];
          let index = -1 ;
          console.log('hi removemedia here')
          for(let i = 0;i<copy.length;i++){
           if(copy[i].name === name && copy[i].Id ===Id){
             index = i; 
             break;
           }
          }
          if(index != -1){
            console.log(copy)
            copy.splice(index,1);
            setremote(copy);
            console.log(copy)
          }       

          remote_stream_list.current.delete(name)
        }
      }catch(err){
        console.log(err);
      }
     
      
    }

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
          //console.log(stream , "got from mystream");
          let tracks = stream.getTracks()
          tracks = tracks.map(async(track)=>{
           const senders = peer.getSenders();
           const senderexists = senders.find((sender)=>sender.track === track);
           //console.log(peer,senderexists,'exists or not')
           if(!senderexists){
             await peer.addTrack(track,stream) 
             //console.log(peer.getSenders())
            }else{
              await peer.removeTrack(senderexists);
              // await senderexists.replaceTrack(track);
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
             addTrackstoPeer(peer)
             .then(()=>{
              getOffer(peer)
              .then((offer)=>{

                const Id = Date.now().toString(36) + Math.random().toString(36).slice(2);

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
                 
               
                setpc({name:data.name,peer:peer,Id});
                  let newremotestream = {
                    name:data.name,
                    stream:null,
                    cam:false,
                    mic:false,
                    Id
                  }
                  // setremote(prevdata=>[ ...prevdata , newremotestream ]);
                  // setremote()
                  
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
    
    },[joining_list,socket,setpc,addTrackstoPeer])

/* adding new member to the video call ------------------------------------------------------------------------------*/

    useEffect(()=>{
      if(answer_list.length > 0){
        let list = [...answer_list];

        list = list.map(async(data)=>{
          return new Promise((resolve,reject)=>{
            try{
              let peer = getPeer();
              addTrackstoPeer(peer)
              .then(()=>{

                getAnswer(peer,data.des)
                .then((ans)=>{

                  const {Id} = data;
    
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
                  //  const Id = Date.now().toString(36) + Math.random().toString(36).slice(2);
                  //  change_status({cam:data.video,mic:data.audio});
     
                   let newremotestream = {
                    name:data.from,
                    stream:null,
                    cam:data.video,
                    mic:data.audio,
                    Id
                  }
     
                  setremote(prevdata=>[ ...prevdata , newremotestream ]);6
                  setpc({name:data.from,peer:peer,Id});
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

    useEffect(()=>{
      console.log(remoteVideo)
      
    },[remoteVideo]);

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
              navigator.mediaDevices.getUserMedia({audio:false,video:true})
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
                      video:true
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
              
              navigator.mediaDevices.getUserMedia({audio:true,video:false})
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
                    audio:true
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
                  video:false
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
                      audio:false
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
      },[ myvideo , myaudio , pc , socket ])


      // useEffect(()=>{
      //   //console.log(remote_media_status)
      // },[remote_media_status])


      
       useEffect(()=>{
        if(videocallstatus === 'preparing_to_join'){
          Getmedia();
        }
      },[videocallstatus]);
      

/*----------------------------------------------------------------------------------------------------------------*/

/*Leave video call */

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
        setremote([]);
        changestatus('not_in_call');
      })
      .catch((err)=>{
        console.log('error while leaving call : ',err);
      })
      .finally(()=>{
    gonnaleave(false);
      
      })
  }
},[leaving,changestatus,myvideo,myaudio]);



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
      command:CALL_ACTIONS.MEDIA,
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
              console.log('disconnected');
              await closePeer(p.peer);
              console.log('closed peer')
              removepc(false,p.name,p.Id);
              console.log('removed peer')
              removemedia(p.name,p.Id);
              console.log('removed media')
             }catch(err){
               console.log(err);
             }
             break;
   
             default:
               console.log(iceConnectionState);
             break;
           }
         };
   
         p.peer.onsignalingstatechange =async(e)=>{
          ////console.log(e.currentTarget.signalingState)
        
         }

         p.peer.onremovetrack = (event) => {
          //console.log('Remote track removed:', event.track);
          // Handle the track removal here
        };
   
         p.peer.onconnectionstatechange =async(e)=>{
          //console.log(e.currentTarget.signalingState)
          
         
         }
       
   
         p.peer.ontrack = async ({streams}) => {
          let copystreams = [...remoteVideo];
          let stream = streams[0];
          console.log("got streams",stream.getTracks())
          let istheone = copystreams.find((copy) => copy.name === p.name && copy.Id === p.Id);
          
          console.log(istheone,copystreams,p.Id,p.name)
          if (istheone.stream !== null) {
            let incomingTracks = stream.getTracks();

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
              istheone.stream = stream;
          }
          copystreams = copystreams.map((copy) => {
              if (copy.name === istheone.name) copy.stream = istheone.stream;
              return copy;
          });
      
          setremote(copystreams);
      }
      
 
     })
   
   
       
    
     }
   },[pc,socket,remoteVideo,setpc,findpeer,removemedia,removepc])
   

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
                              let remotecopy = [...remoteVideo];
                              console.log(remotecopy)
                              remotecopy = remotecopy.map(({name,stream,cam,mic,Id})=>{
                                  console.log(name);
                                  if(name === data.from){
                                      cam = data.video;
                                      mic = data.audio;
                                  }
                                  return {name,stream, cam, mic,Id}; // return updated object
                              })
                              setremote(remotecopy);
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
                        //console.log('hi')
                        // leavecall();
                          
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
                      //console.log(data,'fucking media asshooles')
                      let copy = [...remoteVideo];
                      console.log(data);
                      console.log(copy)
                      copy = copy.map((media)=>{
                        return new Promise((resolve,reject)=>{
                          try{
                            if(media.name === data.from ){
                              if(data.audio || data.audio === false){
                                media.mic = data.audio;
                                console.log('this')
                              }
        
                              if( data.video || data.video === false){
                                media.cam = data.video;
                                console.log('this2')
  
                              }
                              console.log('this3')
                              console.log(media)
                            }
                           
                            resolve(media)
                          }catch(err){
                            reject(err);
                          }
                        
                        })
                      })
                   
                    let resolveddata =  await Promise.all(copy)
                     
                      setremote(resolveddata);

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
