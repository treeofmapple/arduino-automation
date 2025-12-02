import {
    ArduinoResponse,
    PageArduinoData,
    PageArduinoResponse,
} from "./endpointsDto";

const BASE_API_URL = "http://localhost:8000/v1/arduino";

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(`${BASE_API_URL}${url}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    return response.json();
}

export const fetchArduinosByPage = (page: number) =>
    fetchJson<PageArduinoResponse>(`/${page}`);

export const fetchInfluxLogs = (device: string, page: number) =>
    fetchJson<PageArduinoData>(
        `/logs/${page}?device=${encodeURIComponent(device)}`,
    );

export const fetchArduinoById = (id: number) =>
    fetchJson<ArduinoResponse>(`?id=${id}`);

export const fetchArduinoByDevice = (device: string) =>
    fetchJson<ArduinoResponse>(`?device=${encodeURIComponent(device)}`);
