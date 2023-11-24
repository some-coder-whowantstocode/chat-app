const { Createroom } = require('../wsmethods/createroom'); 
const {
    rooms_id,
    users_in_rooms,
    roomAdmin,
    requesters,
    clearmaps
} = require('./testmaps.js')

let sentData;

const mws = {
    send:jest.fn((data) => { sentData = data })
}


describe('Createroom', () => {
    test('should create a new room when room id does not exist', () => {
        const data = { name: 'test', roomid: '123' };
        Createroom(data, mws, rooms_id, users_in_rooms, roomAdmin, requesters);
        expect(rooms_id.has(data.roomid)).toBeTruthy();
        expect(users_in_rooms.get(data.roomid)).toEqual([data.name]);
        expect(roomAdmin.get(data.roomid)).toBe(mws);
        expect(requesters.get(data.roomid)).toEqual([]);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toStrictEqual({
            type:'create',
            response:true,
            name:data.name,
            roomid:data.roomid
});
        expect(mws.send).toHaveBeenCalled();
        clearmaps();
    });
    test('should send an error when empty roomid or name is provided',()=>{
        const data = {name:'',roomid:''};
        Createroom(data,mws, rooms_id, users_in_rooms, roomAdmin, requesters);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData.type).toBe('error');
        expect(sentData.msg).toBe(`please provide valid roomid and name.`)
        expect(rooms_id.size).toEqual(0);
        expect(users_in_rooms.size).toEqual(0);
        expect(roomAdmin.size).toEqual(0);
        expect(requesters.size).toEqual(0);
        clearmaps();

    });
    test('should send an error when room id already exists', () => {
        const data = { name: 'test', roomid: '123' };
        rooms_id.set(data.roomid, [mws]);
        users_in_rooms.set(data.roomid,[data.name]);
        roomAdmin.set(data.name,mws);
        requesters.set(data.roomid,[]);
        Createroom(data, mws, rooms_id, users_in_rooms, roomAdmin, requesters);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData.type).toBe('error');
        expect(sentData.msg).toBe(`${data.roomid} already exists.`);
        expect(rooms_id.size).toEqual(1);
        expect(users_in_rooms.size).toEqual(1);
        expect(roomAdmin.size).toEqual(1);
        expect(requesters.size).toEqual(1);
        clearmaps();

    });
})