import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getPeer, getAnswer , getOffer, closePeer } from "../services/peer";
import { useSocket } from "./SocketProvider";
import { Mediacleanup } from "../utils/mediahandler";


const Videocontext = createContext(null);

export function Videochatcontroller({ children }) {
    
    const [pc,setpc] = useState([]);//[{name of the other user,peer}]
    const [icecandidates,setice] = useState([]);
    // const [mystreams,setmystreams] = useState();
    const media = useRef({mic:true,cam:true});
    const [remoteVideo,setremote] = useState([]); // [{name , stream}]
    const {socket} = useSocket();
    const [videocallstatus , changestatus] = useState('not_in_call');/* [ not_in_call , preparing_to_join , in_video_call ] */
    const [myaudio,setmyaudio] = useState();
    const [myvideo,setmyvideo] = useState();
    // const [toggle,settoggle] = useState(true);
    const [ leaving , gonnaleave] = useState(false);
    const remote_stream_list = useRef(new Map());//{username,streamId}

    // const change_toggle =useCallback(()=>{
    //   settoggle(!toggle);
    // },[remoteVideo])


    const LeaveCall =()=>{
      gonnaleave(true);
    }

    const getmystream =useCallback(()=>{
      return new Promise((resolve,reject)=>{
        try{
          let videotracks = myvideo ? myvideo.getTracks() : [];
          let audiotracks = myaudio ? myaudio.getTracks() : [];
          console.log(videotracks,audiotracks)
          let stream = new MediaStream([...videotracks,...audiotracks]) 
          
          resolve(stream);
        }catch(err){
          reject('error while getting my stream -> ',err);
        }
      })
   
    },[myvideo,myaudio]);

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


/*media department ------------------------------------------------------ */
/* 
control media = mediacontroller
*/
   /* it will create new media streams and will remove the previous media */



      const Getmedia =useCallback(()=>{
        const {cam,mic} = media.current;
        
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
            Mediacleanup(copy)
          })
         })
      },[media,myaudio,myvideo])

const Mediacontroller =useCallback(async(use)=>{
        
        return new Promise((resolve,reject)=>{
          let peers = [...pc];
        switch(use){
          case "add_video":
            // peers.forEach(({peer})=>{
            //   addTrackstoPeer(peer)
            // })
            navigator.mediaDevices.getUserMedia({audio:false,video:true})
            .then(async(stream)=>{
              let tracks = stream.getTracks();
              
              setmyvideo(new MediaStream([...tracks]))
              peers = peers.map(async({peer})=>{
                const senderexists =await peer.getSenders().find((sender)=>sender.track && sender.track.kind === 'video');
                // console.log(peer,senderexists,tracks)
                  if(senderexists){
                    senderexists.replaceTrack(tracks[0]);

                  }else{
                    
                    let othertracks = myaudio ? [...myaudio.getTracks()] : [];
                    // console.log(tracks[0])
                   await peer.addTrack(tracks[0],new MediaStream([...tracks,...othertracks]))
                   //console.log(peer.getSenders())
                  }
              
              })
              Promise.all(peers)
              .then(()=>{
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
                const senderexists = peer.getSenders().find((sender)=>sender.track && sender.track.kind === 'audio');
                if(senderexists){
                  senderexists.replaceTrack(tracks[0]);
                }else{
                  let othertracks = myvideo ? [...myvideo.getTracks()] : [];
                  await peer.addTrack(tracks[0],new MediaStream([...tracks,...othertracks]))
                }
              })
              Promise.all(peers)
              .then(()=>{
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
              const senders = peer.getSenders();
              senders.map((sender)=>{
                if(sender.track === null) peer.removeTrack(sender);
                else{
                  if(sender.track.kind === 'video'){
                    peer.removeTrack(sender);

                  }
                }
              })


            })
            Promise.all(peers)
            .then(()=>{
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
                  const senders = peer.getSenders();
                  senders.map((sender)=>{
                    if(sender.track === null) peer.removeTrack(sender);
                    else{
                      if(sender.track.kind === 'audio'){
                        peer.removeTrack(sender)
    
                      }
                    }
                  })
              })
                Promise.all(peers)
                .then(()=>{
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
      },[myvideo,myaudio,pc])


      
      const addTrackstoPeer = useCallback(async(peer)=>{
        return new Promise((resolve,reject)=>{
          getmystream()
          .then((stream)=>{
            console.log(stream , "got from mystream");
            let tracks = stream.getTracks()
            tracks = tracks.map(async(track)=>{
             const senders = peer.getSenders();
             const senderexists = senders.find((sender)=>sender.track === track);
             console.log(peer,senderexists,'exists or not')
             if(!senderexists){
               await peer.addTrack(track,stream) 
               console.log(peer.getSenders())
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

    
      
       useEffect(()=>{
        if(videocallstatus === 'preparing_to_join'){
          Getmedia();
        }
      },[videocallstatus]);
      

/*----------------------------------------------------------------------------------------------------------------*/

/*Leave video call */

useEffect(()=>{
  if(leaving){
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
  }
},[leaving]);


useEffect(()=>{
  console.log("number of participants",pc)
 
},[pc])

useEffect(()=>{
  console.log('number of streams',remoteVideo)
},[remoteVideo])


const leavecall = ()=>{
  if(socket ){
    try{
      let copy = [...pc];
    copy =copy.map(({peer})=>{
        console.log('close',peer);
        closePeer(peer);
      })
  console.log('leaving');
  Promise.all(copy)
  .then(()=>{
    socket.send({
      type:'videocall',
      command:'leavecall',
      name:sessionStorage.getItem('name'),
      roomid:sessionStorage.getItem('room')
    })

    setpc([]);
    gonnaleave(false);
  })
  .catch((err)=>{
    console.log(err);
  })
      
     
    }catch(err){
      console.log(err);
    }
    

  }
 }



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
        
         p.peer.oniceconnectionstatechange = async({target}) => {
           const {iceConnectionState} = target;
           switch(iceConnectionState){
             case 'failed':
               target.restartIce();
             break;

             case "disconnected":
            try{
              console.log('disconnected')
              let copy =[...pc];
              await closePeer(p.peer);
               copy = copy.filter(c=>c.name != p.name);
               setpc(copy);
               let copymedia = [...remoteVideo];
               await Mediacleanup(copymedia.find(c=>c.name === p.name).stream);
               copymedia = copymedia.filter(c=>c.name !== p.name);
               remote_stream_list.current.delete(p.name)
               setremote(copymedia);
            console.log('list update',remote_stream_list,copy)
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
          //console.log(e.currentTarget.signalingState)
        
         }

         p.peer.onremovetrack = (event) => {
          console.log('Remote track removed:', event.track);
          // Handle the track removal here
        };
   
         p.peer.onconnectionstatechange =async(e)=>{
          console.log(e.currentTarget.signalingState)
          
         
         }
         /* 
    */
   
         p.peer.ontrack =async({streams})=>{
           console.log('triggered ontrack')
          let copystreams = [...remoteVideo];
          //  let found = false;
           streams = streams[0];

           let istheone = copystreams.find((copy)=>copy.name === p.name);
           console.log(istheone)

          if(istheone){
            let remotePerson = istheone.stream.getTracks();
            let existingvideo = remotePerson ? remotePerson.find((t)=> t.kind === 'video') : [];
            let existingaudio = remotePerson ? remotePerson.find((t)=>t.kind === 'audio') : [];

            streams.getTracks().forEach((track)=>{
              if(track.kind === 'audio'){
                if(existingvideo === undefined || track.id !== existingaudio.id) existingaudio = track;
              }
              if(track.kind === 'video'){
                if(existingvideo === undefined || track.id !== existingvideo.id) existingvideo = track;
              }
            })
            existingaudio = existingaudio ? [existingaudio ] : []
            existingvideo = existingvideo ? [existingvideo ] : []
            
            istheone.stream = new MediaStream([ ...existingaudio, ...existingvideo ])

            copystreams = copystreams.map((copy)=>{
              if(copy.name === istheone.name) copy.stream = istheone.stream;

              return copy;
            })

          }else{
            remote_stream_list.current.set(p.name,null);
            copystreams.push({name:p.name,stream:streams});

            console.log('list update',remote_stream_list)
          }
          console.log(copystreams)
          setremote(copystreams)
        
       }
 
     })
   
   
       
    
     }
   },[pc,socket,remoteVideo,findpeer])
   

/*------------------------------------------------------------*/

console.log('video controller rerendering')
   
    

    useEffect(()=>{


        const handlecall =async(data)=>{
            try{
                switch(data.command){

                    case "offer":
                      { 
                       try{
                       let peer = getPeer();
                       await addTrackstoPeer(peer);
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
                         let peer = getPeer();
                        
                         let offer = await getOffer(peer)
                           socket.send({
                            roomid:sessionStorage.getItem('room'),
                            from:sessionStorage.getItem('name'),
                             command:'offer',
                             type:'videocall',
                             des:offer,
                             to:data.name
                           })
                           setpc(prevstate=>[...prevstate,{name:data.name,peer:peer}]);
                 
                        
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
                             await addTrackstoPeer(peer);
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
                          // console.log('can not insitiate not stable')
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

                    case "leftcall":
                      {
                        console.log('hi')
                        // leavecall();
                          
                      }
                    break;
                   
                    case "icecandidate":
                     { 
                      // console.log('candidate')
                     setice(prevstate=>[...prevstate,data])
                      }
                    break;
        
                    // default:
                    //     console.log(data);
                    // break;
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
    },[socket,pc,addTrackstoPeer,findpeer])


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
        <Videocontext.Provider value={{LeaveCall,remote_stream_list, remoteVideo,media,Mediacontroller,joincall,leavecall,Getmedia,videocallstatus,change_videocall_status,myvideo,myaudio}}>
        {children}
        </Videocontext.Provider>
    )
}

export function useVideo(){
    return useContext(Videocontext);
}
