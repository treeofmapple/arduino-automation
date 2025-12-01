package com.tom.arduino.server.service;

import java.time.Duration;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tom.arduino.server.dto.ArduinoAuthentication;
import com.tom.arduino.server.exception.NotFoundException;
import com.tom.arduino.server.exception.UnauthorizedException;
import com.tom.arduino.server.model.Arduino;
import com.tom.arduino.server.repository.ArduinoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class ArduinoUtils {

	private final ArduinoRepository repository;
	private final PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public Arduino authenticateArduino(ArduinoAuthentication auth) {
		var arduino = repository.findByDeviceName(auth.deviceName())
				.orElseThrow(() -> new NotFoundException(String.format("Device not found: %s", auth.deviceName())));

		if (!Boolean.TRUE.equals(arduino.getActive())) {
			throw new UnauthorizedException(String.format("Device is disabled: %s", auth.deviceName()));
		}

		boolean keyMatch = passwordEncoder.matches(auth.apiKey(), arduino.getApiKey());
		boolean secretMatch = passwordEncoder.matches(auth.secret(), arduino.getSecret());
		if (!keyMatch || !secretMatch) {
			throw new UnauthorizedException("Invalid Credentials");
		}

		return arduino;
	}

	
    public String toFluxRange(Duration duration) {
        long hours = duration.toHours();
        return "-" + hours + "h";
    }
}
