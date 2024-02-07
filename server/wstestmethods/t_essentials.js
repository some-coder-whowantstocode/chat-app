const ROOM = new Map();


const clearmaps =()=>{
  ROOM.clear();
}

USER_LIMIT = 3;

module.exports ={
    ROOM,
    USER_LIMIT,
    clearmaps
}