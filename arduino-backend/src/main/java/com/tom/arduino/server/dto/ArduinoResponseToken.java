package com.tom.arduino.server.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ArduinoResponseToken (
		
		Long id,
		String deviceName,
		String macAddress,
		String firmware,
		Boolean active,
		String apiKey,
		String secret,
		LocalDateTime createdDate,
		LocalDateTime lastModifiedDate
		
		) {

}
