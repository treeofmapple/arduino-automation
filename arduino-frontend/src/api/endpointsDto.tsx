export interface PageArduinoResponse {
    content: ArduinoResponse[];
    page: number;
    totalPages: number;
    totalElements: number;
}

export interface ArduinoResponse {
    id: number;
    deviceName: string;
    macAddress: string;
    firmware: string;
    active: boolean;
    createdDate: string;
    lastModifiedDate: string;
}

export interface ArduinoResponseToken {
    id: number;
    deviceName: string;
    macAddress: string;
    firmware: string;
    active: boolean;
    apiKey: string;
    secret: string;
    createdDate: string;
    lastModifiedDate: string;
}

export interface PageArduinoData {
    content: ArduinoDataMessage[];
    page: number;
    totalPages: number;
    totalElements: number;
}

export interface ArduinoDataMessage {
    firmware: string;
    temperature: number;
    humidity: number;
    voltage: number;
    update: string;
    events: string;
    logs: string;
}

export interface ArduinoRequest {
    deviceName: string;
    description: string;
}

export interface ArduinoUpdate {
    deviceName?: string;
    macAddress?: string;
    description?: string;
}
