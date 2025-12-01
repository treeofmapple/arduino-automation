package com.tom.arduino.server.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ArduinoResponse(
		
		Long id,
		String deviceName,
		String description,
		String macAddress,
		String firmware,
		Boolean active,
		LocalDateTime createdDate,
		LocalDateTime lastModifiedDate
		
		) {

}
