package com.tom.arduino.server.processes;

public record ArduinoDataMessage(
		
		String macAddress,
		String firmware,
		Double temperature,
		Double humidity,
		Double voltage,
		String update,
		String events,
		String logs
		
		) {

}
