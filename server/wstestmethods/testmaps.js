const rooms_id = new Map();
const users_in_rooms = new Map();
const roomAdmin = new Map();
const requesters = new Map();

const clearmaps =()=>{
    rooms_id.clear();
    users_in_rooms.clear();
    roomAdmin.clear();
    requesters.clear();
}

module.exports ={
    rooms_id,
    users_in_rooms,
    roomAdmin,
    requesters,
    clearmaps
}