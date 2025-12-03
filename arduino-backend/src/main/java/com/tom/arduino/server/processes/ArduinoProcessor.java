package com.tom.arduino.server.processes;

import java.time.Instant;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.tom.arduino.server.dto.ArduinoAuthentication;
import com.tom.arduino.server.service.ArduinoUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ArduinoProcessor {

	private final SimpMessagingTemplate template;
    private final ArduinoUtils arduinoUtils;
    private final InfluxDBClient influx;
	
    public void process(ArduinoAuthentication auth, ArduinoDataMessage data) {
    	var arduino = arduinoUtils.authenticateArduino(auth);

        log.info("Arduino {} validated", arduino.getDeviceName());

        try {
            Point point = Point.measurement("arduino_data")
                    .addTag("deviceName", arduino.getDeviceName())
                    .addTag("mac", data.macAddress() != null ? data.macAddress() : "unknown")
                    .addField("firmware", data.firmware() != null ? data.firmware() : "unknown")
                    .addField("temperature", data.temperature())
                    .addField("humidity", data.humidity())
                    .addField("voltage", data.voltage())
                    .addField("logs", data.logs() != null ? data.logs() : "") 
                    .addField("events", data.events() != null ? data.events() : "")
                    .time(Instant.now(), WritePrecision.MS);

            influx.getWriteApiBlocking().writePoint(point);
        } catch (Exception e) {
            log.error("Failed to write to InfluxDB", e);
        }
        
        template.convertAndSend("/topic/data", data); // websocket
    }
	
}
