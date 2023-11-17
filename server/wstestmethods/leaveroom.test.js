const { leaveroom,sendtoall} = require('../wsmethods/index.js'); 

const {
    rooms_id,
    users_in_rooms,
    roomAdmin,
    requesters,
    clearmaps
} = require('./testmaps.js')

let sentData;

const mws = {
    send:jest.fn((data) => { sentData = JSON.parse(data); })
}
const adws ={
    send:jest.fn((data) => { sentData = JSON.parse(data); })
} 

describe('leaveroom', () => {
    test('if room has one member remove him and close the room and decline if any requests are made.',()=>{
        const data = {name:'rohit',roomid:'123'}
        rooms_id.set(data.roomid,[mws]);
        users_in_rooms.set(data.roomid,[data.name]);
        roomAdmin.set(data.roomid,mws);
        requesters.set(data.roomid,[{name:'hi',ws:mws}]);
        let reqline = requesters.size;
        let reqs = requesters.get(data.roomid);
        leaveroom(data,mws,rooms_id,users_in_rooms,roomAdmin);
        expect(sentData).toEqual({
                type:'Announcement',
                msg:`You left the room ${data.roomid}`
        })
        expect(rooms_id.size).toBe(0);
        expect(users_in_rooms.size).toBe(0);
        expect(roomAdmin.size).toBe(0);
        expect(requesters.size).toBe(0);
        expect(mws.send).toBeCalledTimes(reqline+1);
       

    });
    test('if room has more than one member and not the admin remove the member',()=>{
        const data = {name:'rohit',roomid:'123'}
        rooms_id.set(data.roomid,[mws,mws]);
        users_in_rooms.set(data.roomid,[data.name,'vicky']);
        roomAdmin.set(data.roomid,adws);
        leaveroom(data,mws,rooms_id,users_in_rooms,roomAdmin);
        expect(sentData).toEqual({
            type:'Announcement',
            msg:`${data.name} Left the room.`
        })
        expect(rooms_id.get(data.roomid).length).toBe(1);
        expect(users_in_rooms.get(data.roomid).length).toBe(1);
        expect(roomAdmin.size).toBe(1);
       
    });

    test('if room has more than one member and is the admin remove the member and appoint a random person as admin.',()=>{
        const data = {name:'rohit',roomid:'123'}
        rooms_id.set(data.roomid,[mws,adws]);
        users_in_rooms.set(data.roomid,[data.name,'vicky']);
        roomAdmin.set(data.roomid,mws);
        leaveroom(data,mws,rooms_id,users_in_rooms,roomAdmin);
        expect(sentData).toEqual({
            type:'Announcement',
            msg:`vicky is now the new Admin.`
        })
        expect(rooms_id.get(data.roomid).length).toBe(1);
        expect(users_in_rooms.get(data.roomid).length).toBe(1);
        expect(roomAdmin.get(data.roomid)).toEqual(adws);

       
    });
});
