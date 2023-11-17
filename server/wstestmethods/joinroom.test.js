const {joinroom} = require('../wsmethods/index.js');
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


describe('joinroom',()=>{
    test('If room does not exist send error.',()=>{
        const data = {name:'rohit',roomid:'123'};
        joinroom(data,mws,rooms_id,users_in_rooms,roomAdmin,requesters);
        expect(rooms_id.size).toEqual(0);
        expect(users_in_rooms.size).toEqual(0);
        expect(roomAdmin.size).toEqual(0);
        expect(requesters.size).toEqual(0);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type:`error`,
            msg:`${data.roomid} does not exist.`
    });
    clearmaps()
    });
    test('If room exists but a member with same name exists send error.',()=>{
        const data = {name:'rohit',roomid:'123'};
        rooms_id.set(data.roomid,[mws]);
        users_in_rooms.set(data.roomid,[data.name]);
        roomAdmin.set(data.roomid,mws);
        requesters.set(data.roomid,[]);
        joinroom(data,mws,rooms_id,users_in_rooms,roomAdmin,requesters);
        expect(rooms_id.size).toEqual(1);
        expect(users_in_rooms.size).toEqual(1);
        expect(users_in_rooms.get(data.roomid).length).toEqual(1);
        expect(roomAdmin.size).toEqual(1);
        expect(requesters.size).toEqual(1);
        expect(requesters.get(data.roomid).length).toEqual(0);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type:'error',
            msg:`${data.name} already exists in this room please choose another name.`
        });
        clearmaps();
    });
    test('If room exists but a requestor with same name exists send error.',()=>{
        const data = {name:'rohit',roomid:'123'};
        rooms_id.set(data.roomid,[mws]);
        users_in_rooms.set(data.roomid,['someone']);
        roomAdmin.set(data.roomid,mws);
        requesters.set(data.roomid,[{name:data.name,ws:mws}]);
        joinroom(data,mws,rooms_id,users_in_rooms,roomAdmin,requesters);
        expect(rooms_id.size).toEqual(1);
        expect(users_in_rooms.size).toEqual(1);
        expect(users_in_rooms.get(data.roomid).length).toEqual(1);
        expect(roomAdmin.size).toEqual(1);
        expect(requesters.size).toEqual(1);
        expect(requesters.get(data.roomid).length).toEqual(1);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type:'error',
            msg:`${data.name} already exists in this room please choose another name.`
        });
        clearmaps();
    });
    test('If room exists and no requestor or member with same name exists send request to admin.',()=>{
        const data = {name:'rohit',roomid:'123'};
        rooms_id.set(data.roomid,[mws]);
        users_in_rooms.set(data.roomid,['someone']);
        roomAdmin.set(data.roomid,mws);
        requesters.set(data.roomid,[]);
        joinroom(data,mws,rooms_id,users_in_rooms,roomAdmin,requesters);
        expect(rooms_id.size).toEqual(1);
        expect(users_in_rooms.size).toEqual(1);
        expect(users_in_rooms.get(data.roomid).length).toEqual(1);
        expect(roomAdmin.size).toEqual(1);
        expect(requesters.size).toEqual(1);
        expect(requesters.get(data.roomid).length).toEqual(1);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type:'request',
            name:data.name,
            roomid:data.roomid
        });
        clearmaps();
    });
    
})