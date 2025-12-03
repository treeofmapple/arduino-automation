package com.tom.arduino.server.processes;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

import com.tom.arduino.server.dto.ArduinoAuthentication;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import tools.jackson.databind.ObjectMapper;

@Log4j2
@Service
@RequiredArgsConstructor
public class MqttListener implements MqttCallback {

	private final ArduinoProcessor processes;
	private final ObjectMapper mapper = new ObjectMapper();

	@Override
	public void connectionLost(Throwable cause) {
		log.error("MQTT Connection Lost", cause.getMessage());
	}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		try {
			String payload = new String(message.getPayload());
			log.info("Received MQTT -> {}", topic);

			// The topic could be: arduino/{deviceName}/{apiKey}/{secret}
			String[] parts = topic.split("/");
			if (parts.length < 4) {
				log.error("Invalid topic format: {}", topic);
				return;
			}
			String deviceName = parts[1];
			String apiKey = parts[2];
			String secret = parts[3];

			ArduinoDataMessage data;
			try {
				data = mapper.readValue(payload, ArduinoDataMessage.class);
			} catch (Exception e) {
				log.error("Failed to parse JSON payload from device {}: {}", deviceName, e.getMessage());
				return;
			}

			processes.process(new ArduinoAuthentication(deviceName, apiKey, secret), data);
		} catch (Exception e) {
			log.error("Error processing MQTT message: {}", e.getMessage());
		}
	}

	@Override
	public void deliveryComplete(IMqttDeliveryToken token) {}

}
