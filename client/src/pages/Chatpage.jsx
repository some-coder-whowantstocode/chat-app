import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import RequestBox from "../components/Chatpage/RequestBox";
import Chat from "../components/Chatpage/Chat";
import notification from "../assets/notification.wav";
import { MdCall  } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import {
  Option,
  Chathead,
  Chatbox,
  Send,
  CustomInput,
  Chatroom,
  Room,
  Messagebox,
  Options
} from "../components/Chatpage/customstyles";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Members from "../components/Chatpage/Members";
import Waitingroom from "./Waitingroom";
import { useVideo } from "../context/Videochatcontroller";
import VideochatPage from "./VideochatPage";

const Chatpage = () => {
  const { socket, state,room_status, setleave, Admin , members,changestatus,videocallstatus } =
    useSocket();
  const { gonnaleave } = useVideo();

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
    setmem([...members]);
    return ()=>{
    }
  }, []);

  useEffect(()=>{
    console.log(mem)
  },[mem])
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
          if(jsondata.leftroom){
            console.log('leftroom',jsondata)
            let copymems = [...mem];
            console.log(copymems,mem)
            copymems = copymems.filter((m)=>jsondata.name !== m)
            console.log(copymems)
            setmem(copymems)
          }
          setmsgs((prevmsg) => [...prevmsg, jsondata]);
        
        
        break;

        case 'Alert':
          if(jsondata.action_required) setleave(true);
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
  }, [socket,notificationsound,navigate,setleave,mem]);


  useEffect(() => {
    if (room_status=== "not in room") {
      navigate("/landingpage");
    }
  }, [navigate,room_status]);

  useEffect(() => {
    const handler = async () => {
      console.log('hmm')
      await gonnaleave(true);
      console.log('leavecall')
      await setleave(true);
      console.log('leaveroom')

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

      <Options>
      <Option colorschema={{col:'black',bac: 'green'}}
      
      onClick={async () => {
        if(videocallstatus === "not_in_call"){
          changestatus('preparing_to_join');

        }
      
      }}
    >
     
        
        <MdCall/>
    </Option>
      
      <Option colorschema={{col:'#b10e0e',bac:'#b10e0e'}}
      
        onClick={async () => {
          console.log('hmm')
          await gonnaleave(true);
          console.log('leavecall')
          await setleave(true);
          console.log('leaveroom')
          navigate("/rejoin");
        }}
      >
        <FaPowerOff/>
      </Option>
      </Options>
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
