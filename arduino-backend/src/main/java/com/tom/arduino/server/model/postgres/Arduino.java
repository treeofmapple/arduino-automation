package com.tom.arduino.server.model.postgres;

import com.tom.arduino.server.model.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "arduino")
public class Arduino extends Auditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "device_name", unique = true)
	private String deviceName;

	@Column(name = "description", length = 2048)
	private String description;

	@Column(name = "active", nullable = false)
	private Boolean active = true;

	@Column(name = "api_key", length = 128)
	private String apiKey;

	@Column(name = "secret", length = 128)
	private String secret;

}
