import React, { createContext, useContext } from 'react';

// Create a context
const SocketContext = createContext();

// Create a provider component
export function SocketProvider({ children }) {
  const socket = new WebSocket('ws://localhost:9827');

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

// Create a custom hook to use the socket
export function useSocket() {
  return useContext(SocketContext);
}
