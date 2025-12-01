package com.tom.arduino.server.dto;

public record ArduinoAuthentication(
		
		String deviceName,
		String apiKey,
		String secret
		
		) {

}
