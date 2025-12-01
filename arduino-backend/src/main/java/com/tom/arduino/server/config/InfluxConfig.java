package com.tom.arduino.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;

@Configuration
public class InfluxConfig {

	@Value("${influx.url}")
	private String url;

	@Value("${influx.token}")
	private String token;

	@Value("${influx.org}")
	private String organization;

	@Value("${influx.bucket}")
	private String bucket;

	@Bean
	InfluxDBClient influxDBClient() {
		return InfluxDBClientFactory.create(url, token.toCharArray(), organization, bucket);
	}

}
