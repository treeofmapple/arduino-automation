package com.tom.arduino.server.exception;

import org.springframework.http.HttpStatus;

import com.tom.arduino.server.exception.global.CustomGlobalException;

import lombok.EqualsAndHashCode;

@SuppressWarnings("serial")
@EqualsAndHashCode(callSuper = true)
public class NotFoundException extends CustomGlobalException {
	public NotFoundException(String message) {
		super(message, HttpStatus.NOT_FOUND);
	}
}
