#include <Arduino.h>
#include <ArduinoJson.h>

const char* DEVICE_NAME = "sensor-01";
const char* API_KEY     = "393eef0da91c0cf3e66cf218f91f5e7a";
const char* SECRET      = "905087b4af7636aa3833cbf74f7f2c4b567495154fc603e5b7148358b28d94ab";
const char* MQTT_BROKER = "mqtt-broker"; 

// put the broker access to be able to be
// accessed via external port 

const char* WIFI_SSID     = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

String getTopic() {
  return String("arduino/") + DEVICE_NAME + "/" + API_KEY + "/" + SECRET;
}

#ifdef EPOXY_DUINO
  #include <cstdlib>

  void sendMqtt(String topic, String payload) {
      payload.replace("\"", "\\\"");
      String command = "mosquitto_pub -h " + String(MQTT_BROKER) +
                       " -t " + topic +
                       " -m \"" + payload + "\"";
      Serial.print("[SIMULATION] Executing: ");
      Serial.println(command);

      int result = system(command.c_str());

      if (result != 0) {
        Serial.println("[ERROR] Failed to publish. Is 'mosquitto-clients' installed?");
      }
  }

#else
  #include <Wifi.h>
  #include <ESP8266WiFi.h>
  #include <PubSubClient.h>

  WifiClient wifiClient;
  PubSubClient client(wifiClient)!
  byte mac[6];

  void setupHardware() {
    Serial.println("Connecting to Wifi...");
    Wifi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (Wifi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
    Serial.println("\nWifi connected!");
    Serial.print("Ip Address: ");
    Serial.println(Wifi.localIP());
    Wifi.macAddress(mac);
    Serial.print("MAC Address: ");
    for (int i = 0; i < 6; i++) {
        Serial.printf("%02X", mac[i]);
        if (i < 5) Serial.print(":");
}
Serial.println();
    client.setServer(MQTT_BROKER, 1883);
  }

  void sendMqtt(String topic, String payload) {
      if (!client.connected()) {
        client.connect(DEVICE_NAME);
      }
      client.publish(topic.c_str(), payload.c_str());
  }
#endif

void setup() {
    Serial.begin(9600);
    Serial.println("System Initialized");

    #ifndef EPOXY_DUINO
      setupHardware();
    #endif
}

void loop() {
    double temp = 25.0 + (rand() % 100) / 10.0;
    double hum  = 50.0 + (rand() % 50) / 10.0;
    double volt = 3.3  + (rand() % 10) / 100.0;

    StaticJsonDocument<256> doc;

char macStr[18];
sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X",
        mac[0], mac[1], mac[2],
        mac[3], mac[4], mac[5]);

    doc["mac"]         = macStr;
    doc["firmware"]    = "1.0.0";
    doc["temperature"] = temp;
    doc["humidity"]    = hum;
    doc["voltage"]     = volt;
    doc["update"]      = "none";
    doc["events"]      = "status_ok";
    doc["logs"]        = "loop_cycle_complete";

    String jsonString;
    serializeJson(doc, jsonString);

    sendMqtt(getTopic(), jsonString);

    delay(2000);
}
