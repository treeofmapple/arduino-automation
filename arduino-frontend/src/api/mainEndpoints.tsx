import { ArduinoRequest, ArduinoResponse, ArduinoResponseToken, ArduinoUpdate } from "./endpointsDto";

const BASE_API_URL = "http://localhost:8000/v1/arduino";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_API_URL}${url}`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(
            `Request failed for ${url} → ${response.status}: ${response.statusText}`,
        );
    }

    if (response.status === 204) return null as T;
    return response.json();
}

export const createArduino = (body: ArduinoRequest) =>
    fetchJson<ArduinoResponseToken>("", {
        method: "POST",
        body: JSON.stringify(body),
    });

export const toggleArduino = (device: string) =>
    fetchJson<ArduinoResponse>(`/toggle/${encodeURIComponent(device)}`, {
        method: "POST",
    });

export const updateArduino = (device: string, body: ArduinoUpdate) =>
  fetchJson<ArduinoResponse>(`/${encodeURIComponent(device)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const updateTokens = (device: string) =>
  fetchJson<ArduinoResponseToken>(`/token/${encodeURIComponent(device)}`, {
    method: "PUT",
  });

export const deleteArduinoById = (id: number) =>
  fetchJson<void>(`/${id}`, {
    method: "DELETE",
  });
