import { useState } from "react";
import { ArduinoList } from "./components/ArduinoList";
import { Dashboard } from "./components/Dashboard";

export interface Arduino {
    id: number;
    deviceName: string;
    macAddress: string;
    description: string;
    firmware: string;
    active: boolean;
    apiKey?: string;
    secret?: string;
    createdDate: string;
    lastModifiedDate: string;
}

export default function App() {
    const [selectedArduino, setSelectedArduino] = useState<Arduino | null>(
        null,
    );

    return (
        <div>
            {selectedArduino ? (
                <Dashboard
                    arduino={selectedArduino}
                    onBack={() => setSelectedArduino(null)}
                />
            ) : (
                <ArduinoList onSelectArduino={setSelectedArduino} />
            )}
        </div>
    );
}
