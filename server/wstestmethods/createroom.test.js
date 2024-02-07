const { CUSTOM_RESPONSE } = require('../responses.js');
const { Createroom } = require('../wsmethods/createroom'); 
const {
    ROOM,
    clearmaps
} = require('./t_essentials.js')

let sentData;

const mws = {
    send:jest.fn((data) => { sentData = data })
}




describe('Createroom', () => {

    beforeEach(() => {
        clearmaps();
    });

    test('should create a new room when room id does not exist', () => {
        const data = { name: 'test', roomid: '123' };
        Createroom(data, mws, ROOM);
        expect(ROOM.has(data.roomid)).toBeTruthy();
        expect(ROOM.get(data.roomid)).toEqual({
            key:expect.anything(),
            users:1,
            members:[
                {
                    name:data.name,
                    incall:false,
                    active:true,
                    ws:mws
                }
            ],
            admin:{
                name:data.name,
                ws:mws
            },
            call:[],       
            requesters:[]
        })
        let sample = CUSTOM_RESPONSE.CREATE_ROOM.ACCEPT;
        sample.name = data.name;
        sample.roomid = data.roomid;
        sample.key = expect.anything();
        expect(sentData).toEqual(sample);
        expect(mws.send).toHaveBeenCalled();
    });

    test('should send an error when empty roomid or name is provided',()=>{
        const data = {name:'',roomid:''};
        Createroom(data,mws,ROOM );
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual(CUSTOM_RESPONSE.CREATE_ROOM.REJECT.INVALID_CREDINTIALS);
        expect(ROOM.size).toEqual(0);

    });

    test('should send an error when room id already exists', () => {
        const data = { name: 'test', roomid: '123' };
       ROOM.set("123",{});
        Createroom(data, mws, ROOM);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual(CUSTOM_RESPONSE.CREATE_ROOM.REJECT.ROOM_EXISTS);
        expect(ROOM.size).toEqual(1);
    });

})