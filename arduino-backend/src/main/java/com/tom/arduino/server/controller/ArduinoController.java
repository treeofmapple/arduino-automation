package com.tom.arduino.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tom.arduino.server.dto.ArduinoRequest;
import com.tom.arduino.server.dto.ArduinoResponse;
import com.tom.arduino.server.dto.ArduinoResponseToken;
import com.tom.arduino.server.dto.ArduinoUpdate;
import com.tom.arduino.server.dto.PageArduinoResponse;
import com.tom.arduino.server.processes.PageArduinoData;
import com.tom.arduino.server.service.ArduinoService;
import com.tom.arduino.server.service.ArduinoSocketService;

import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/v1/arduino")
@RequiredArgsConstructor
public class ArduinoController {

	private final ArduinoService service;
	private final ArduinoSocketService socketService;

	@GetMapping(value = "/{query}")
	public ResponseEntity<PageArduinoResponse> findByPage(@PathVariable int query) {
		var response = service.findByPage(query);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@GetMapping(value = "/logs/{query}")
	public ResponseEntity<PageArduinoData> findInfluxLogs(@RequestParam(value = "device") String deviceName,
			@PathVariable(value = "query") int page) {
		var response = socketService.getHistoricalLogs(deviceName, page);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@GetMapping(params = "id")
	public ResponseEntity<ArduinoResponse> findById(@RequestParam(value = "id") long query) {
		var response = service.findById(query);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@GetMapping(params = "device")
	public ResponseEntity<ArduinoResponse> findByDeviceName(@RequestParam(value = "device") String query) {
		var response = service.findByDeviceName(query);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ArduinoResponseToken> addNewDevice(@RequestBody(required = true) ArduinoRequest request) {
		var response = service.createArduino(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping(value = "/toggle/{device}")
	public ResponseEntity<ArduinoResponse> toggleArduino(
			@PathVariable(value = "device", required = true) String query) {
		var response = service.toggleArduino(query);
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
	}

	@PutMapping(value = "/{device}")
	public ResponseEntity<ArduinoResponse> updateArduino(
			@PathVariable(value = "device", required = true) String deviceName,
			@RequestBody(required = true) ArduinoUpdate request) {
		var response = service.updateArduino(deviceName, request);
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
	}

	@PutMapping(value = "/token/{device}")
	public ResponseEntity<ArduinoResponseToken> updateTokens(
			@PathVariable(value = "device", required = true) String deviceName) {
		var response = service.updateTokens(deviceName);
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
	}

	@DeleteMapping(value = "/{query}")
	public ResponseEntity<Void> deleteArduinoById(@PathVariable long query) {
		service.deleteArduinoById(query);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
