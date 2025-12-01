package com.tom.arduino.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArduinoRequest(
		
		@NotBlank(message = "Please set a name for the device")
		String deviceName,
		
		@NotBlank(message = "Please set the mac address for connection")
		String macAddress,
		
		@Size(max = 2048, message = "Description cannot exceed 2048 characters")
		String description
		
		) {

}
