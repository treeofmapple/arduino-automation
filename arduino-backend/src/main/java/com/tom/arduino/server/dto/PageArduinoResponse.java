package com.tom.arduino.server.dto;

import java.util.List;

public record PageArduinoResponse(
		
		List<ArduinoResponse> content,
		int page,
		int size,
		long totalPages,
		long totalElements
		
		) {

}
