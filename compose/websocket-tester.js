const { Client } = require('@stomp/stompjs');
const SockJS = require('sockjs-client');

const socket = new SockJS('http://localhost:8000/arduino');

const client = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 3000,
  debug: (msg) => console.log(msg),
});

client.onConnect = () => {
  console.log('Connected to WebSocket!');

  client.subscribe('/topic/data', (message) => {
    const json = JSON.parse(message.body);
    console.log('Arduino Data:', json);
  });
};

client.onStompError = (frame) => {
  console.error('Broker error:', frame.headers['message']);
};

client.activate();

// npm install @stomp/stompjs ws
