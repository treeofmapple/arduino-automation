package com.tom.arduino.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tom.arduino.server.mapper.ArduinoSocketMapper;
import com.tom.arduino.server.model.timescale.ArduinoLogs;
import com.tom.arduino.server.processes.PageArduinoData;
import com.tom.arduino.server.repository.timescale.ArduinoLogsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ArduinoSocketService {

	@Value("${application.page.size:10}")
	private int PAGE_SIZE;
	
    private final ArduinoLogsRepository repository;
    private final ArduinoSocketMapper mapper;
    
    // update range later
    public PageArduinoData getHistoricalLogs(String deviceName, int page) {
    	Pageable pageable = PageRequest.of(page, PAGE_SIZE);
    	Page<ArduinoLogs> arduinoLogs = repository.findByDevice(deviceName, pageable);
    	return mapper.toResponse(arduinoLogs);
    }
    
    
}
