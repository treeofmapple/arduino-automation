package com.tom.arduino.server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tom.arduino.server.model.Arduino;

@Repository
public interface ArduinoRepository extends JpaRepository<Arduino, Long> {

	Optional<Arduino> findByDeviceName(String deviceName);

	Optional<Arduino> findByMacAddress(String macAddress);
	
}
