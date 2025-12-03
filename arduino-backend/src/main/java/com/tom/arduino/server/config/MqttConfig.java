package com.tom.arduino.server.config;

import java.util.UUID;

import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.tom.arduino.server.processes.MqttListener;

@Configuration
public class MqttConfig {

	@Value("${mqtt.url:tcp://localhost:1883}")
	private String brokerUrl;
	
	@Value("${mqtt.username")
	private String brokerUsername;
	
	@Value("${mqtt.password")
	private String brokerPassword;

	@Bean
	IMqttClient mqttClient(MqttListener listener) throws MqttException {
		String publisherId = UUID.randomUUID().toString();
		IMqttClient client = new MqttClient(brokerUrl, publisherId, new MemoryPersistence());

		MqttConnectOptions options = new MqttConnectOptions();
		options.setAutomaticReconnect(true);
		options.setCleanSession(true);
		options.setConnectionTimeout(10);

	    options.setUserName(brokerUsername);
	    options.setPassword(brokerPassword.toCharArray());
		
		if (!client.isConnected()) {
			client.connect(options);
		}

		client.setCallback(listener);
		client.subscribe("arduino/+/+/+");

		return client;
	}

}
