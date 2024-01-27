import styled from 'styled-components'
import logo from '/chat.png'

const min = 750

const Navbox = styled.div`
color: white;
width: 100vw;
height: 45px;
display: flex;
align-items: center;
box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
background: linear-gradient(to right, rgb(200, 190, 210), rgb(190, 200, 210)); 
z-index: 10;
${
  innerWidth>min ?
`
position: fixed;
`
  :
`
position:sticky;
`
}

background-color: white;
span{
    font-size: 27px;
    font-family: 'Noto Sans', sans-serif;
}
img{
    height: 30px;
    margin: 0 10px;
}
`

const Nav = () => {
  return (
    <Navbox>
        <img src={logo} alt="" />
      <span>Instant group</span>
    </Navbox>
  )
}

export default Nav
