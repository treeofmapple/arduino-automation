package com.tom.arduino.server.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringBootVersion;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;

public class CustomBanner implements Banner {

	private final SystemUtils utils;

	public CustomBanner() {
		this.utils = new SystemUtils();
	}

	@Override
	public void printBanner(Environment environment, Class<?> sourceClass, PrintStream out) {
		getBannerPathResource(out);
		try {
			Package springPackage = SpringBootVersion.class.getPackage();
			String version = (springPackage != null) ? springPackage.getImplementationVersion() : "unknown";
            String appName = environment.getProperty("spring.application.name", "Unnamed App");
            boolean sslEnabled = Boolean.parseBoolean(environment.getProperty("server.ssl.enabled", "false"));
            String serverPort = environment.getProperty("server.port", "8080");
            String profiles = String.join(", ", environment.getActiveProfiles());
            String protocol = sslEnabled ? "https" : "http";

            String machineIp = utils.getLocalMachineIp();
            String publicIp = utils.getMachinePublicIp();

            out.println();
            out.println("Powered by Spring Boot: " + version);
            out.println("APP: " + appName);
            out.println("Active Profile: " + profiles);
            out.println("====================================================================================");
            out.printf("Running at private IP: %s://%s:%s%n", protocol, machineIp, serverPort);
            out.printf("Running at public IP: %s://%s:%s%n", protocol, publicIp, serverPort);
            out.println("====================================================================================");
        } catch (Exception e) {
            out.println("Failed to print custom banner: " + e.getMessage());
        }
    }

	private void getBannerPathResource(PrintStream out) {
		ClassPathResource resource = new ClassPathResource("banners.txt");
		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
			String line;
			while ((line = reader.readLine()) != null) {
				out.println(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
