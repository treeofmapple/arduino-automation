package com.tom.arduino.server.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ArduinoInflux {

	private String macAddress;
	private String firmware;
	private Double temperature;
	private Double humidity;
	private Double voltage;
	private String update;
	private String events;
	private String logs;

}
