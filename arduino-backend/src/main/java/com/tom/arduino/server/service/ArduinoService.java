package com.tom.arduino.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tom.arduino.server.dto.ArduinoRequest;
import com.tom.arduino.server.dto.ArduinoResponse;
import com.tom.arduino.server.dto.ArduinoResponseToken;
import com.tom.arduino.server.dto.ArduinoUpdate;
import com.tom.arduino.server.dto.PageArduinoResponse;
import com.tom.arduino.server.exception.AlreadyExistsException;
import com.tom.arduino.server.exception.NotFoundException;
import com.tom.arduino.server.logic.KeyGenerator;
import com.tom.arduino.server.mapper.ArduinoMapper;
import com.tom.arduino.server.model.postgres.Arduino;
import com.tom.arduino.server.model.timescale.ArduinoLogs;
import com.tom.arduino.server.repository.postgres.ArduinoRepository;
import com.tom.arduino.server.repository.timescale.ArduinoLogsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ArduinoService {

	@Value("${application.page.size:10}")
	private int PAGE_SIZE;

	private final PasswordEncoder passwordEncoder;
	private final ArduinoRepository arduinoRepository;
	private final ArduinoLogsRepository logsRepository;
	private final ArduinoMapper mapper;
	private final KeyGenerator tokensGenerator;

	@Transactional(readOnly = true)
	public PageArduinoResponse findByPage(int page) {
		Pageable pageable = PageRequest.of(page, PAGE_SIZE);
		Page<Arduino> vehicle = arduinoRepository.findAll(pageable);
		return mapper.toResponse(vehicle);
	}

	@Transactional(readOnly = true)
	public ArduinoResponse findById(long query) {
		return arduinoRepository.findById(query).map(mapper::toResponse).orElseThrow(() -> {
			return new NotFoundException(String.format("Arduino with id: %s was not found. ", query));
		});
	}

	@Transactional(readOnly = true)
	public ArduinoResponse findByDeviceName(String deviceName) {
		return arduinoRepository.findByDeviceName(deviceName).map(mapper::toResponse).orElseThrow(() -> {
			return new NotFoundException(String.format("Arduino with name: %s was not found.", deviceName));
		});
	}

	@Transactional
	public ArduinoResponseToken createArduino(ArduinoRequest request) {
		arduinoRepository.findByDeviceName(request.deviceName()).ifPresent(existing -> {
			throw new AlreadyExistsException("Device with that name already exists.");
		});

		var arduino = mapper.build(request);
		var tokens = tokensGenerator.generateKeyPair();
		arduino.setApiKey(passwordEncoder.encode(tokens.apiKey()));
		arduino.setSecret(passwordEncoder.encode(tokens.secret()));
		arduinoRepository.save(arduino);
		return mapper.toResponseToken(arduino, tokens.apiKey(), tokens.secret());
	}

	@Transactional
	public ArduinoResponse updateArduino(String deviceName, ArduinoUpdate request) {
		var device = arduinoRepository.findByDeviceName(deviceName)
				.orElseThrow(() -> new NotFoundException(String.format("Device not found: %s", request.deviceName())));
		var arduino = mapper.mergeData(device, request);
		arduinoRepository.save(arduino);
		return mapper.toResponse(arduino);
	}

	@Transactional
	public ArduinoResponse toggleArduino(String request) {
		var device = arduinoRepository.findByDeviceName(request)
				.orElseThrow(() -> new NotFoundException(String.format("Device not found: %s", request)));
		if (device.getActive() == null) {
			device.setActive(true);
		} else {
			device.setActive(!device.getActive());
		}
		arduinoRepository.save(device);
		return mapper.toResponse(device);
	}

	@Transactional
	public ArduinoResponseToken updateTokens(String deviceName) {
		var arduino = arduinoRepository.findByDeviceName(deviceName)
				.orElseThrow(() -> new NotFoundException("Device not found"));
		var tokens = tokensGenerator.generateKeyPair();
		arduino.setApiKey(passwordEncoder.encode(tokens.apiKey()));
		arduino.setSecret(passwordEncoder.encode(tokens.secret()));
		arduinoRepository.save(arduino);
		return mapper.toResponseToken(arduino, tokens.apiKey(), tokens.secret());
	}

	@Transactional
	public void deleteArduinoById(Long query) {
		var arduino = arduinoRepository.findById(query).orElseThrow(
				() -> new NotFoundException(String.format("No arduino was found with the id: %s.", query)));

		List<ArduinoLogs> logs = logsRepository.findAllByArduino(arduino);
		for (ArduinoLogs log : logs) {
			log.setArduino(null);
		}
		logsRepository.saveAll(logs);
		arduinoRepository.delete(arduino);
	}

}
