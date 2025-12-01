package com.tom.arduino.server.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@MappedSuperclass
public abstract class Auditable {

	@Column(updatable = false)
	private LocalDateTime createdDate;

	private LocalDateTime lastModifiedDate;

	@PrePersist
	private void onCreate() {
		LocalDateTime now = LocalDateTime.now();
		this.createdDate = now;
		this.lastModifiedDate = now;
	}

	@PreUpdate
	private void onUpdate() {
		this.lastModifiedDate = LocalDateTime.now();
	}
}