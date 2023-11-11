const {WebSocket,WebSocketServer} = require('ws');

const wss = new WebSocketServer({
    port: process.env.SOCKET_PORT,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      clientNoContextTakeover: true, 
      serverNoContextTakeover: true, 
      serverMaxWindowBits: 10, 
      concurrencyLimit: 10, 
      threshold: 1024 
    }
  });


module.exports = wss;
