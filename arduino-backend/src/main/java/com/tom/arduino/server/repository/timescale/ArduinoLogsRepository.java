package com.tom.arduino.server.repository.timescale;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tom.arduino.server.model.postgres.Arduino;
import com.tom.arduino.server.model.timescale.ArduinoLogs;

@Repository
public interface ArduinoLogsRepository extends JpaRepository<ArduinoLogs, Long> {

	@Query("""
			    SELECT l FROM ArduinoLogs l
			    WHERE l.deviceName = :deviceName
			    ORDER BY l.time DESC
			""")
	Page<ArduinoLogs> findByDevice(String deviceName, Pageable pageable);

	
	List<ArduinoLogs> findAllByArduino(Arduino arduino);
}
