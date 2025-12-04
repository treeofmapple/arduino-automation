package com.tom.arduino.server.model.timescale;

import java.time.Instant;

import com.tom.arduino.server.model.postgres.Arduino;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "arduino_logs")
public class ArduinoLogs {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Instant time;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "arduino_id", nullable = true)
    private Arduino arduino;
	
	private String deviceName;
	private Double temperature;
	private Double humidity;
	private Double voltage;
	private String macAddress;
	private String firmware;
	
	@Column(columnDefinition = "TEXT")
	private String logs;
	
	@Column(columnDefinition = "TEXT")
	private String events;

}
