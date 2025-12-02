#include <Arduino.h>
#include <ArduinoJson.h>

const char* DEVICE_NAME = "sensor-01";
const char* API_KEY     = "393eef0da91c0cf3e66cf218f91f5e7a";
const char* SECRET      = "905087b4af7636aa3833cbf74f7f2c4b567495154fc603e5b7148358b28d94ab";
const char* MQTT_BROKER = "mqtt-broker";

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
  #include <SPI.h>
  #include <Ethernet.h>
  #include <PubSubClient.h>

  byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED }; 
// Make it get the mac address via web connection.
// connect it via wifi the get ip and mac
  IPAddress ip(192, 168, 1, 177);
  EthernetClient ethClient;
  PubSubClient client(ethClient);

  void setupHardware() {
    Ethernet.begin(mac, ip);
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

    doc["mac"]	       = mac;
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
