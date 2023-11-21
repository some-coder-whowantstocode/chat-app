const { cancelrequest } = require('../wsmethods/index.js'); 

const {
    roomAdmin,
    requesters,
    clearmaps
} = require('./testmaps.js')

let sentData;

const mws = {
    send:jest.fn((data) => { sentData = data })
}

describe('cancelrequest',()=>{
    test('when a requests wants to cancel request remove him from waiting list.',()=>{
        const data ={name:'rohit',roomid:'123'};
        roomAdmin.set(data.roomid,mws);
        requesters.set(data.roomid,[{name:data.name,ws:mws}]);
        cancelrequest(data,roomAdmin,requesters);
        expect(requesters.get(data.roomid).length).toBe(0);
        expect(mws.send).toHaveBeenCalled();
        expect(sentData).toEqual({
            type:'cancelrequest',
            name:data.name
        })
        clearmaps();
    });
    test('If room does not exist do nothing and do not through any error.',()=>{
        const data ={name:'rohit',roomid:'123'};
        cancelrequest(data,roomAdmin,requesters);
    });
})