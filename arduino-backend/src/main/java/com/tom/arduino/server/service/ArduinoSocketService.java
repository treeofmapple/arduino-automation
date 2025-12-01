package com.tom.arduino.server.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.tom.arduino.server.dto.ArduinoAuthentication;
import com.tom.arduino.server.mapper.ArduinoSocketMapper;
import com.tom.arduino.server.processes.ArduinoDataMessage;
import com.tom.arduino.server.processes.PageArduinoData;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ArduinoSocketService {

	private final SimpMessagingTemplate template;
    private final ArduinoUtils arduinoUtils;
    private final ArduinoSocketMapper mapper;
    private final InfluxDBClient influx;
    
	@Value("${influx.org}")
	private String organization;

	@Value("${influx.bucket}")
	private String bucket;
	
	@Value("${application.page.size:10}")
	private int PAGE_SIZE;
    
    public void process(ArduinoAuthentication auth, ArduinoDataMessage data) {
    	var arduino = arduinoUtils.authenticateArduino(auth);

        log.info("Arduino {} validated", arduino.getDeviceName());

        try {
            Point point = Point.measurement("arduino_data")
                    .addTag("deviceName", arduino.getDeviceName())
                    .addTag("mac", arduino.getMacAddress())
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

    // update range later
    public PageArduinoData getHistoricalLogs(String deviceName, int page) {
    	Duration duration = Duration.ofHours(24);
    	String query = String.format(
    		    "from(bucket: \"%s\") "
    		    + "|> range(start: %s) "
    		    + "|> filter(fn: (r) => r._measurement == \"arduino_data\") "
    		    + "|> filter(fn: (r) => r.deviceName == \"%s\") "
    		    + "|> pivot(rowKey:[\"_time\"], columnKey:[\"_field\"], valueColumn:\"_value\") "
    		    + "|> sort(columns:[\"_time\"], desc:true)",
    		    bucket, arduinoUtils.toFluxRange(duration), deviceName
    		);

		List<FluxTable> tables = influx.getQueryApi().query(query, organization);
		List<ArduinoDataMessage> allLogs = new ArrayList<>();

		for (FluxTable table : tables) {
			for (FluxRecord record : table.getRecords()) {
				allLogs.add(mapper.toResponse(record));
			}
		}

		int from = page * PAGE_SIZE;
		int to = Math.min(from + PAGE_SIZE, allLogs.size());

		if (from >= allLogs.size()) {
			return new PageArduinoData(List.of(), page, PAGE_SIZE, allLogs.size(),
					(int) Math.ceil((double) allLogs.size() / PAGE_SIZE));
		}

		List<ArduinoDataMessage> pageContent = allLogs.subList(from, to);

		return new PageArduinoData(pageContent, page, PAGE_SIZE, allLogs.size(),
				(int) Math.ceil((double) allLogs.size() / PAGE_SIZE));
	}
    
    @PostConstruct
    public void testInfluxConnection() {
        try {
            boolean alive = influx.ping();
            if (alive) {
                log.info("✓ InfluxDB connection is OK!");
            } else {
                log.error("✗ InfluxDB ping returned false! Check token/org/bucket.");
            }

            log.info("Using Org: {}", influx.getOrganizationsApi());
            log.info("Using Bucket: {}", influx.getBucketsApi().findBucketByName(bucket));

        } catch (Exception e) {
            log.error("InfluxDB connection FAILED:", e);
        }
    }
    
}
