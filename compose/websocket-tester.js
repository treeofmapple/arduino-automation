const { Client } = require('@stomp/stompjs');
const WebSocket = require('ws');

const client = new Client({
  brokerURL: 'ws://localhost:8000/arduino',
  reconnectDelay: 3000,
  debug: (msg) => console.log('[STOMP]', msg),
  webSocketFactory: () => new WebSocket('ws://localhost:8000/arduino'),
});

client.onConnect = () => {
  console.log('Connected to WebSocket!');

  client.subscribe('/topic/data/sensor-001', (message) => {
    const json = JSON.parse(message.body);
    console.log('Arduino Data:', json);
  });
};

client.onStompError = (frame) => {
  console.error('Broker error:', frame.headers['message']);
};

client.activate();

// npm install @stomp/stompjs ws
