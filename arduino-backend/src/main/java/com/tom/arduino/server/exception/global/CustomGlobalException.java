package com.tom.arduino.server.exception.global;

import org.springframework.http.HttpStatus;

@SuppressWarnings("serial")
public abstract class CustomGlobalException extends RuntimeException {

	private final HttpStatus status;

	protected CustomGlobalException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}

}
