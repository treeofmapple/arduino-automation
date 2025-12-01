package com.tom.arduino.server.exception;

import org.springframework.http.HttpStatus;

import com.tom.arduino.server.exception.global.CustomGlobalException;

import lombok.EqualsAndHashCode;

@SuppressWarnings("serial")
@EqualsAndHashCode(callSuper = true)
public class UnauthorizedException extends CustomGlobalException {
	public UnauthorizedException(String message) {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}
