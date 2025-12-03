package com.tom.arduino.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.influxdb.client.InfluxDBClient;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class SystemStart {

	@Value("${influx.bucket}")
	private String bucket;

	private final InfluxDBClient influx;
	
    @PostConstruct
    public void testInfluxConnection() {
        try {
            boolean alive = influx.ping();
            if (alive) {
                log.info("InfluxDB connection is OK!");
            }
            log.info("Using Bucket: {}", influx.getBucketsApi().findBucketByName(bucket));
        
        } catch (Exception e) {
            log.error("InfluxDB connection FAILED:", e);
        }
    }
	
}
