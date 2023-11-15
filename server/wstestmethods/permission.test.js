const {permission} = require('../wsmethods/permission.js')

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
    });

    test('User joins room and announcement is sent', () => {
        data = { name: 'testUser', roomid: '123' };
        let sendMock = jest.spyOn({ sendtoall }, 'sendtoall');
        requesters.set(data.roomid, [{ name: data.name, ws: wsMock }]);

        expect(users_in_rooms.get(data.roomid)).toContain(data.name);
        expect(rooms_id.get(data.roomid)).toContain(wsMock);
        expect(requesters.get(data.roomid)).toHaveLength(0);
        expect(wsMock.send).toHaveBeenCalledWith(JSON.stringify({
            type:'response',
            permission:'Acc',
            roomid:data.roomid,
            name:data.name
        }));
        expect(sendMock).toHaveBeenCalledWith(rooms_id.get(data.roomid), {
            type:'Announcement',
            msg:`${data.name} joined the room.`
        });
    });
});