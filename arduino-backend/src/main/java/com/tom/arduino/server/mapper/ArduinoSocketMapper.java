package com.tom.arduino.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.influxdb.query.FluxRecord;
import com.tom.arduino.server.processes.ArduinoDataMessage;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ArduinoSocketMapper {

    default ArduinoDataMessage toResponse(FluxRecord record) {
        if (record == null) {
            return null;
        }

        return new ArduinoDataMessage(
            getString(record, "firmware"),
	    getString(record, "mac"),
            getDouble(record, "temperature"),
            getDouble(record, "humidity"),
            getDouble(record, "voltage"),
            getString(record, "update"),
            getString(record, "events"),
            getString(record, "logs")
        );
    }

    default String getString(FluxRecord record, String field) {
        Object val = record.getValueByKey(field);
        return val != null ? String.valueOf(val) : null;
    }

    default Double getDouble(FluxRecord record, String field) {
        Object val = record.getValueByKey(field);
        if (val == null) {
            return null;
        }
        if (val instanceof Number) {
            return ((Number) val).doubleValue();
        }
        try {
            return Double.parseDouble(val.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
