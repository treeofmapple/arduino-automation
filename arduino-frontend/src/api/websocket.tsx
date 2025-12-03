import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8000/v1/arduino";

let stompClient: Client | null = null;

export const connectArduinoSocket = (
  deviceName: string,
  onMessage: (data: any) => void,
  onConnected?: () => void,
  onError?: (error: any) => void,
) => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }

  const socket = new SockJS(SOCKET_URL);

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: () => {},
    reconnectDelay: 5000,

    onConnect: () => {
      stompClient?.subscribe(`/topic/${deviceName}`, (message) => {
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
      if (event.code !== 1000) {
          console.warn("WebSocket closed unexpectedly:", event);
          onError?.(event);
      }
    },

    onWebSocketError: (event) => {
      console.error("WebSocket error:", event);
      onError?.(event);
    },
  });

  stompClient.activate();

  return () => {
    stompClient?.deactivate();
    stompClient = null;
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
