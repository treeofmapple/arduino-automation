package com.tom.arduino.server.exception.global;

import java.util.Map;

public record ErrorResponse(Map<String, String> errorResponse) {

}
