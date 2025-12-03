import { Client } from "@stomp/stompjs";

const SOCKET_URL = "ws://localhost:8000/arduino";

let stompClient: Client | null = null;

export const connectArduinoSocket = (
  deviceName: string,
  onMessage: (data: any) => void,
  onConnected?: () => void,
  onError?: (error: any) => void,
) => {

  const client = new Client({
    brokerURL: SOCKET_URL,
    reconnectDelay: 5000,
    debug: (str) => {
      if (str.includes("Connected") || str.includes("Error")) {
          console.log(`[STOMP] ${str}`);
      }
    },
    onConnect: () => {
      console.log(`[STOMP] Connected to /topic/data/${deviceName}`);

      client.subscribe(`/topic/data/${deviceName}`, (message) => {
        try {
          const body = JSON.parse(message.body);
          onMessage(body);
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      });

      onConnected?.();
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
      onError?.(frame);
    },
    onWebSocketClose: (event) => {
      if (!event.wasClean) {
        console.warn("WebSocket closed unexpectedly:", event);
      }
    },
  });

  stompClient = client;
  client.activate();

  return () => {
    if (stompClient === client) {
      console.log("Deactivating STOMP client...");
      client.deactivate();
      stompClient = null;
    }
  };
};

export const sendToBackend = (path: string, body: any) => {
  if (stompClient?.connected) {
    stompClient.publish({
        destination: `/app/${path}`,
        body: JSON.stringify(body),
    });
  } else {
      console.warn("Cannot send message: STOMP client is not connected");
  }
};

export const disconnectArduinoSocket = () => {
  stompClient?.deactivate();
  stompClient = null;
};
