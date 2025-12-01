package com.tom.arduino.server.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Component;

@Component
public class SystemUtils {

	public String getLocalMachineIp() throws Exception {
		return InetAddress.getLocalHost().getHostAddress();	
	}
	
	@SuppressWarnings("deprecation")
	public String getMachinePublicIp() throws IOException, Exception {
		URL url = new URL("https://api.ipify.org");
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.setRequestProperty("User-Agent", "spring-boot-application");
		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
			return reader.readLine();
		}
	}

}
