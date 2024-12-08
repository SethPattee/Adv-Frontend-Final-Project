import React, { useState, useEffect } from 'react';

function Websocket() {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const websocketUrls = ['ws://localhost:5009/ws', 'wss://sethapi.duckdns.org/wss'];

  useEffect(() => {
    let socketInstance: WebSocket | undefined;
    let currentUrlIndex = 0;

    const connectToWebSocket = () => {
      if (currentUrlIndex >= websocketUrls.length) {
        console.error('All WebSocket connection attempts failed.');
        return;
      }

      const url = websocketUrls[currentUrlIndex];
      console.log(`Attempting to connect to WebSocket at ${url}`);
      socketInstance = new WebSocket(url);

      socketInstance.addEventListener('open', () => {
        console.log('WebSocket connection opened');
        socketInstance?.send('Hello, server!');
        setSocket(socketInstance);
      });

      socketInstance.addEventListener('message', (event) => {
        setMessages((prevMessages) => [...prevMessages, `Server: ${event.data}`]);
      });

      socketInstance.addEventListener('close', () => {
        console.warn(`WebSocket connection closed. Trying next URL...`);
        currentUrlIndex += 1;
        connectToWebSocket();
      });

      socketInstance.addEventListener('error', (err) => {
        console.error(`WebSocket error: ${err}`);
        socketInstance?.close();
      });
    };

    connectToWebSocket();

    return () => {
      socketInstance?.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage) {
      socket.send(inputMessage);
      setMessages((prevMessages) => [...prevMessages, `You: ${inputMessage}`]);
      setInputMessage('');
    }
  };

  return (
    <div>
      <h1>Welcome to the Space Chat!</h1>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Websocket;
