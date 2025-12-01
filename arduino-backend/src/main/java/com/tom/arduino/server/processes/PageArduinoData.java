package com.tom.arduino.server.processes;

import java.util.List;

public record PageArduinoData(
		
		List<ArduinoDataMessage> content,
		int page,
		int size,
		long totalPages,
		long totalElements
		
		) {

}
