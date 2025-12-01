package com.tom.arduino.server.logic;

import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Component;

@Component
public class KeyGenerator {

	public String generateKey(Integer keySize) {
		int finalSize = (keySize != null && keySize > 0) ? keySize : 16;
		byte[] bytes = KeyGenerators.secureRandom(finalSize).generateKey();
		StringBuilder sb = new StringBuilder(bytes.length * 2);
		for (byte b : bytes) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}

	public KeyPair generateKeyPair() {
		return new KeyPair(generateKey(null), generateKey(32));
	}

}
