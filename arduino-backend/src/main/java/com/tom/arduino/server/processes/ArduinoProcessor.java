package com.tom.arduino.server.processes;

import java.time.Instant;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.tom.arduino.server.dto.ArduinoAuthentication;
import com.tom.arduino.server.mapper.ArduinoSocketMapper;
import com.tom.arduino.server.repository.timescale.ArduinoLogsRepository;
import com.tom.arduino.server.service.ArduinoUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ArduinoProcessor {

	private final SimpMessagingTemplate template;
	private final ArduinoLogsRepository repository;
	private final ArduinoSocketMapper mapper;
	private final ArduinoUtils arduinoUtils;

	public void process(ArduinoAuthentication auth, ArduinoDataMessage data) {
		var arduino = arduinoUtils.authenticateArduino(auth);

		log.info("Arduino {} validated", arduino.getDeviceName());

		var arduinoLogs = mapper.build(arduino, Instant.now(), arduino.getDeviceName(), data.temperature(),
				data.humidity(), data.voltage(), data.macAddress(), data.firmware(), data.logs(), data.events());

		repository.save(arduinoLogs);

		template.convertAndSend("/topic/data/" + arduino.getDeviceName(), data); // websocket
	}

}
