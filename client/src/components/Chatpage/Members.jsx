import React, { useEffect , useState } from 'react'
import styled from 'styled-components'
import { GiHamburgerMenu } from "react-icons/gi";
import { useSocket } from '../../context/SocketProvider';
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from 'react-router-dom';


const Alter = styled(BsThreeDotsVertical)`
  cursor: pointer;
`

const Mems = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: all;
  transition-duration: 0.5s;
  /* width:${props=>props.isclicked ? `36.5vw` : `100px`}; */
  ${props=>props.min ?
  `
  align-items:center;
  `
  :
  `
  width:${props.isclicked ? `36.5vw` : `90px`};
  `
  }

  overflow-y: scroll;
  ::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
 
`

const Mem = styled.div`
  
  margin-top: 20px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  /* box-sizing: border-box; */
  ${
    props=>props.admin ?
    `
      color:gold;
    `
    :

    `
      color:white;
    `
  }
  &:hover{
    div{
      ${props=>props.isclicked !==false  && `display:block; `}
    }
  }
  div{
    display:none;
    position:absolute;
    right:2px;
    top:15px;
  }
  transition-duration: 0.5s;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover{
    box-shadow: rgba(20, 20, 20, 0.2) 0px 12px 8px 0px;
    
  }

  
  ${props=>props.isclicked ? `
  width: 20vw;
  margin: 10px;
  padding-left:5px;
  
  ` 
  : 
  `
  width:45px;
  height:25px;
  border-radius:50%;
  margin:10px;
  `};
  

${props=>props.mobile ? `
    width:95vw;
    border-radius:5%;
  box-sizing:border-box;
  padding-left:19px;
  margin:5px;
    height:30px;
    font-size:13px;

  `
  :
  `
  height: 50px;
    
  `
}
  
`

const MemBox = styled.div`
 max-height: 100vh;
 overflow: scroll;
 /* background-color: #2D2D2D; */
 background: linear-gradient(to right, rgb(50, 30, 70), rgb(30, 50, 70)); /* Deep Purple to Deep Blue */

 ::-webkit-scrollbar{
  display: none;
}

-ms-overflow-style: none;
scrollbar-width: none;
`

const Menu = styled(GiHamburgerMenu)`
  margin-right: 10px;
  cursor: pointer;
  transition: all;
  transition-duration: 0.6s;
 
`

const ActiveMenu = styled(RxCross2)`
  margin-right: 10px;
  cursor: pointer;
  transition: all;
  transition-duration: 0.6s;
  color: white !important;
`

const Head = styled.div`
  width: 100%;
  /* background-color: #444444; */
  background: linear-gradient(to right, rgb(50, 30, 70), rgb(30, 50, 70)); /* Deep Purple to Deep Blue */
  color: white;
  height: 40px;
  display: flex;
  align-items: center;
  transition: all;
  transition-delay: 0.2s;
  transition-duration: 1s;
  ${props=>props.isclicked ? `justify-content: end` : `justify-content: center`} ;
  justify-content:end;
  
  
  div{
    cursor: pointer;
    
  }
`

const Members = ({mems}) => {
  const {adminname,Admin,kickout, viewport,DEVICE_CHART} = useSocket();
  const [mem,setmem] = useState([]);
  const [isclicked,setisclicked] = useState(false);

  const location = useLocation();

  useEffect(()=>{
    console.log(location.state)
    if(location.state){
      setmem(location.state)

    }
  },[location])
  useEffect(()=>{
    if(mems){
      console.log(mems)
      setmem(mems)
    }
  
  },[mems])


  return (
    <MemBox
    >
      <Head
        isclicked={isclicked}
      
      >
       
        {
          viewport === DEVICE_CHART.PC 
          ?
          isclicked === false ?
          <Menu
          size={30}
          onClick={()=>{
            setisclicked(!isclicked)
          }}
          />
          :
          <ActiveMenu
          size={30}
          onClick={()=>{
            setisclicked(!isclicked)
          }}
          />

          :
          <Link to={"/chat"} >
            <ActiveMenu
          size={30}
          />
          </Link>
        

        }
       
      </Head>
      
    {
       viewport === DEVICE_CHART.MOBILE ? 

      <Mems min={ viewport === DEVICE_CHART.MOBILE}>
        {
          mem.map((me,i)=>(
            <React.Fragment
            
            key={i}
            >
            {
              me === adminname 

              ?
              <Mem 
              admin
              mobile={ true}
              >
                {me}
                </Mem>

                :
                <Mem 
                mobile={true}
    
                >
                  {me}
               <div> <Alter onClick={()=>{
                  kickout(me);
                }}/>
                </div>
                </Mem>
            }
            </React.Fragment>
          ))
        }
      </Mems>

      :

      <Mems
      isclicked={isclicked}
      >
        {
          mem.map((me,i)=>(
            <React.Fragment
            key={`${i}th mem`}
            
            >
            {
              me === adminname 
              
              ?
              <Mem 
              admin
              isclicked={isclicked}
              >
                {me}
                </Mem>
              :
             <>
             {
              Admin 
              
              ?
              <Mem 
              isclicked={isclicked}
  
              >
                {me}
             <div> <Alter onClick={()=>{
                kickout(me);
              }}/></div>
              </Mem>
              :
  
              <Mem 
              isclicked={isclicked}
              >{me}</Mem>
             }
           
             </>
            
            }
            </React.Fragment>
           
          ))
        }
      </Mems>

    }

   
    </MemBox>
  )
}

export default Members
