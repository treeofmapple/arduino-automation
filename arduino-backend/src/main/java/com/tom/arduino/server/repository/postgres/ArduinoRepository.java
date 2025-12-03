package com.tom.arduino.server.repository.postgres;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tom.arduino.server.model.postgres.Arduino;

@Repository
public interface ArduinoRepository extends JpaRepository<Arduino, Long> {

	Optional<Arduino> findByDeviceName(String deviceName);

}
