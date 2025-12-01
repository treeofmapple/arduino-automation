package com.tom.arduino.server.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.data.domain.Page;

import com.tom.arduino.server.dto.ArduinoRequest;
import com.tom.arduino.server.dto.ArduinoResponse;
import com.tom.arduino.server.dto.ArduinoResponseToken;
import com.tom.arduino.server.dto.ArduinoUpdate;
import com.tom.arduino.server.dto.PageArduinoResponse;
import com.tom.arduino.server.model.Arduino;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArduinoMapper {

	@Mapping(target = "id", ignore = true)
	Arduino build(ArduinoRequest request);
	
	ArduinoResponse toResponse(Arduino arduino);
	
    @Mapping(target = "apiKey", source = "originApiKey")
    @Mapping(target = "secret", source = "originSecret")
	ArduinoResponseToken toResponseToken(Arduino arduino, String originApiKey, String originSecret);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
	@Mapping(target = "id", ignore = true)
	Arduino mergeData(@MappingTarget Arduino arduino, ArduinoUpdate request);
	
	List<ArduinoResponse> toResponseList(List<Arduino> arduino);
	
	default PageArduinoResponse toResponse(Page<Arduino> page) {
		if (page == null) {
			return null;
		}
		List<ArduinoResponse> content = toResponseList(page.getContent());
		return new PageArduinoResponse(
				content,
				page.getNumber(),
				page.getSize(),
				page.getTotalPages(),
				page.getTotalElements()
			);
    }
	
}
