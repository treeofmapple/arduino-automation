package com.tom.arduino.server.mapper;

import java.time.Instant;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.data.domain.Page;

import com.tom.arduino.server.model.postgres.Arduino;
import com.tom.arduino.server.model.timescale.ArduinoLogs;
import com.tom.arduino.server.processes.ArduinoDataMessage;
import com.tom.arduino.server.processes.PageArduinoData;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArduinoSocketMapper {

	@Mapping(target = "id", ignore = true)
	ArduinoLogs build(Arduino arduino, Instant time, String deviceName, Double temperature, Double humidity, Double voltage,
			String macAddress, String firmware, String logs, String events);
	
	ArduinoDataMessage toMessage(ArduinoLogs logs);
	
	default PageArduinoData toResponse(Page<ArduinoLogs> page) {
		if (page == null) {
			return null;
		}
		List<ArduinoDataMessage> content = page.getContent()
				.stream()
				.map(this::toMessage)
				.toList();
		
		return new PageArduinoData(
				content,
				page.getNumber(),
				page.getSize(),
				page.getTotalPages(),
				page.getTotalElements()
			);
    }

}
