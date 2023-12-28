import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import RequestBox from "../components/Chatpage/RequestBox";
import Chat from "../components/Chatpage/Chat";
import notification from "../assets/notification.wav";
import { MdCall , MdCallEnd } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import {
  Option,
  Chathead,
  Chatbox,
  Send,
  CustomInput,
  Chatroom,
  Room,
  Messagebox
} from "../components/Chatpage/customstyles";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Members from "../components/Chatpage/Members";
import Waitingroom from "./Waitingroom";
import { useVideo } from "../context/Videochatcontroller";
import VideochatPage from "./VideochatPage";

const Chatpage = () => {
  const { socket, state, wanttoleave, Admin, creation, entry , members } =
    useSocket();
  const { videocallstatus , change_videocall_status , LeaveCall } = useVideo();

  const [username, setname] = useState();
  const [roomid, setroomid] = useState();
  const [msgs, setmsgs] = useState([]);
  const msg = useRef('');
  const [reqdata, setreqdata] = useState([]);
  const [notificationsound] = useState(new Audio(notification));
  const [mem, setmem] = useState([]);
  

  const inputref = useRef(null);

  

  useEffect(() => {
    setname(sessionStorage.getItem("name"));
    setroomid(sessionStorage.getItem("room"));
    setmem(members);

    return ()=>{
    }
  }, []);
  const navigate = useNavigate();



  useEffect(() => {
    const handleMessage = (jsondata) => {
      switch(jsondata.type){


        case 'message':
          setmsgs((prevmsg) => [...prevmsg,jsondata]);
        break;

        case 'request':
          notificationsound.play();
          setreqdata((prevreqdata) => [jsondata, ...prevreqdata]);
        break;

        case 'removereq':
          console.log('recieved',jsondata)
          setreqdata((prevreqdata) => {
            let arr = prevreqdata.filter((r) => r.name != jsondata.name);
            return arr;
          });
        break;

        case 'cancelrequest':
          setreqdata((prevreqdata) => {
            let arr = prevreqdata.filter((r) => r.name != jsondata.name);
            return arr;
          });
        break;

        case 'Announcement':
       
          if(jsondata.joined){
            setmem(prevdata=>[...prevdata,jsondata.name]);
          }
          if(jsondata.left){
  
            setmem(prevdata=> prevdata.filter((d)=>d !== jsondata.name));
            
          }
          setmsgs((prevmsg) => [...prevmsg, jsondata]);
        
        
        break;

        case 'Alert':
          if(jsondata.action_required) wanttoleave(true);
          navigate("/rejoin");
        break;


      }
    }


    if (socket) {
      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket,notificationsound,navigate,wanttoleave]);


  useEffect(() => {
    if (creation !== true && entry !== true) {
      navigate("/landingpage");
    }
  }, [creation, entry,navigate]);

  useEffect(() => {
    const handler = async () => {
      await LeaveCall();
      await wanttoleave(false);

    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, []);
  

  const sendmsg = async () => {
    try {
      if (msg.current != "") {
        socket.send({
          create: false,
          msg: msg.current,
          Admin: Admin,
          name: sessionStorage.getItem("name"),
          roomid: sessionStorage.getItem("room"),
        });
        msg.current = '';
        inputref.current.value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (state == "Authfailed" || state == "ConnectionLost") {
      navigate('/landingpage')
    }
  }, [state,navigate]);

  return (
    <Room>
     <Members mems={mem}/>
    <Chatroom>
     
      
      <Chathead>{roomid}

      <Option pos={{top:0,right:40}}colorschema={{col:'black',bac: 'green'}}
      
      onClick={async () => {
        if(videocallstatus === "not_in_call"){
          change_videocall_status('preparing_to_join');

        }
      
      }}
    >
     
        
        <MdCall/>
    </Option>
      
      <Option pos={{top:0,right:10}} colorschema={{col:'#b10e0e',bac:'#b10e0e'}}
      
        onClick={async () => {
          await LeaveCall();
          await wanttoleave(true);
          navigate("/rejoin");
        }}
      >
        <FaPowerOff/>
      </Option>
      
      </Chathead>
      <Loading />

      
      {reqdata.map((rd) => (
        <RequestBox key={rd.name} data={rd} />
      ))}
      <Chatbox>
        {msgs.map((msg,i) => (
          <Chat key={`${i}th message`} m={msg} me={username == msg.name} />
        ))}
      </Chatbox>
      <Messagebox>
      <CustomInput
        placeholder="write here.."
        ref={inputref}
        defaultValue={msg.current}
        onChange={(e) => msg.current = e.target.value}
        onKeyUp={(e) => e.key === "Enter" && sendmsg()}
      />
      <Send onClick={() => sendmsg()} />
      </Messagebox>
    
    </Chatroom>
    {
      videocallstatus === 'preparing_to_join' &&  <Waitingroom/>
    }

    {
      videocallstatus === 'in_video_call' && <VideochatPage/>
    }
    
    </Room>
  );
};

export default Chatpage;
