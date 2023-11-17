const {permission,sendtoall} = require('../wsmethods/index.js')

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

describe('permission',()=>{
    test('If admin declines the requeset.',()=>{
        const data = {response:'Dec',name:'rohit',roomid:'123'};
        requesters.set(data.roomid,[{name:data.name,ws:mws}]);
        users_in_rooms.set(data.roomid,['hi']);
        permission(data,rooms_id,users_in_rooms,requesters);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type:'response',
            permission:'Dec',
            roomid:data.roomid,
            name:data.name
        })
        expect(requesters.get(data.roomid).length).toEqual(0);
        expect(users_in_rooms.get(data.roomid).length).toEqual(1);
        clearmaps();
    });

    test('User joins room and announcement is sent', () => {
        const data = { name: 'testUser', roomid: '123' };
        rooms_id.set(data.roomid,[mws])
        users_in_rooms.set(data.roomid,[mws])
        requesters.set(data.roomid, [{ name: data.name, ws: mws }]);
        permission(data,rooms_id,users_in_rooms,requesters);
        expect(users_in_rooms.get(data.roomid)).toContain(data.name);
        expect(rooms_id.get(data.roomid)).toContain(mws);
        expect(requesters.get(data.roomid)).toHaveLength(0);
        expect(mws.send).toHaveBeenCalledWith(JSON.stringify({
            type:'response',
            permission:'Acc',
            roomid:data.roomid,
            name:data.name
        }));
        clearmaps()
    });
});