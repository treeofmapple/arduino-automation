package com.tom.arduino.server.processes;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ArduinoDataMessage(
		
	    @JsonProperty("macAddress")
	    String macAddress,

	    @JsonProperty("firmware")
	    String firmware,
	    
		Double temperature,
		Double humidity,
		Double voltage,
		String update,
		String events,
		String logs
		
		) {

}
