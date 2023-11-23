const { message } = require('../wsmethods/index.js');
const {sendtoall} = require('../wsmethods/senttoall.js');
const { clearmaps } = require('./testmaps.js');
jest.mock('../wsmethods/senttoall.js');


const mws = {
  send:jest.fn((data) => { sentData = data })
}

describe('message',()=>{

  test('A message without badword should not be censored.', () => {
    const mockData = {
      msg: 'Hello, this is a test message',
      name: 'Test User',
      Admin: false,
      roomid: '123'
    };
    const mockRoomsId = new Map();
    mockRoomsId.set('123', [mws, mws]);
  
    
    message(mockData, mockRoomsId);
  
    expect(sendtoall).toHaveBeenCalledWith(
      Array.from(mockRoomsId.get(mockData.roomid)),
      {
        type: 'message',
        msg: 'Hello, this is a test message',
        name: 'Test User',
        Admin: false
      }
      );
      clearmaps()
  });

  
  test('A message with badword should be censored.', () => {
    const mockData = {
      msg: 'Hello, this is a test message with badword fuck',
      name: 'Test User',
      Admin: false,
      roomid: '123'
    };
    const mockRoomsId = new Map();
    mockRoomsId.set('123', [mws, mws]);
  
    
    message(mockData, mockRoomsId);
  
    expect(sendtoall).toHaveBeenCalledWith(
      mockRoomsId.get(mockData.roomid),
      {
        type: 'message',
        msg: 'Hello, this is a test message with badword f**k',
        name: 'Test User',
        Admin: false
      }
    );
    clearmaps()
  });
  
})
