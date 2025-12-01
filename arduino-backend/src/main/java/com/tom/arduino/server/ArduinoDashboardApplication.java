package com.tom.arduino.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.tom.arduino.server.config.CustomBanner;

@SpringBootApplication
public class ArduinoDashboardApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(ArduinoDashboardApplication.class);
		app.setBanner(new CustomBanner());
		app.run(args);
	}

}
