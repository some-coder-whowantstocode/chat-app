const {WebSocket,WebSocketServer} = require('ws');
require('dotenv').config()

// Use port 80 for HTTP or 443 for HTTPS
const PORT = process.env.SOCKET_PORT || 443;

const wss = new WebSocketServer({
    port: PORT,
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

wss.on('error', function error(err) {
  console.log('WebSocket error:', err);
});

module.exports = wss;
