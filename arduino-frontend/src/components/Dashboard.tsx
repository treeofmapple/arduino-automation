import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Thermometer,
  Droplets,
  Battery,
  Cpu,
  Activity,
  FileText,
  ArrowLeft,
  History,
  Settings,
} from "lucide-react";
import { EventsPanel } from "./helper/EventsPanel";
import { LogsPanel } from "./helper/LogsPanel";
import { HistoricalLogsDialog } from "./HistoricalLogsDialog";
import { ArduinoSettingsDialog } from "./ArduinoSettingsDialog";
import { Arduino } from "../App";
import {
  connectArduinoSocket,
  disconnectArduinoSocket,
} from "../api/websocket";
import { ArduinoDataMessage } from "../api/endpointsDto";
import { MetricCard } from "./helper/MetricCard";
import { Chart } from "./helper/Chart";

interface HistoricalData {
  timestamp: string;
  temperature: number;
  humidity: number;
  voltage: number;
}

interface DashboardProps {
  arduino: Arduino;
  onBack: () => void;
}

export function Dashboard({ arduino: initialArduino, onBack }: DashboardProps) {
  const [arduino, setArduino] = useState(initialArduino);
  const [data, setData] = useState<ArduinoDataMessage>({
    firmware: arduino.firmware || "",
    temperature: 0,
    humidity: 0,
    voltage: 0,
    update: "",
    events: "",
    logs: "",
  });

  const [isConnected, setIsConnected] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [allEvents, setAllEvents] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<string[]>([]);
  const [showHistoricalLogs, setShowHistoricalLogs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const cleanup = connectArduinoSocket(
      arduino.deviceName,
      (incoming: ArduinoDataMessage) => {
        setData((prev) => ({
          ...prev,
          ...incoming,
          firmware: incoming.firmware || prev.firmware,
          logs: incoming.logs || prev.logs,
          events: incoming.events || prev.events,
        }));

        setHistoricalData((prev) => {
          const newData = [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              temperature: incoming.temperature,
              humidity: incoming.humidity,
              voltage: incoming.voltage,
            },
          ];
          return newData.slice(-20);
        });

        if (incoming.events) {
          setAllEvents((prev) => [incoming.events, ...prev].slice(0, 50));
        }

        if (incoming.logs) {
          setAllLogs((prev) => [incoming.logs, ...prev].slice(0, 100));
        }

        if (incoming.firmware && incoming.firmware !== arduino.firmware) {
          setArduino((prev) => ({ ...prev, firmware: incoming.firmware }));
        }
      },
      () => setIsConnected(true),
      () => setIsConnected(false),
    );

    return () => {
      cleanup && cleanup();
    };
  }, [arduino.deviceName]);

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { color: "bg-blue-500", status: "Cold" };
    if (temp < 25) return { color: "bg-green-500", status: "Normal" };
    if (temp < 30) return { color: "bg-yellow-500", status: "Warm" };
    return { color: "bg-red-500", status: "Hot" };
  };

  const getVoltageStatus = (voltage: number) => {
    if (voltage < 3.0) return { color: "bg-red-500", status: "Low" };
    if (voltage < 3.3) return { color: "bg-yellow-500", status: "Medium" };
    return { color: "bg-green-500", status: "Good" };
  };

  const handleArduinoUpdated = (updatedArduino: Arduino) => {
    setArduino(updatedArduino);
  };

  const handleArduinoDeleted = () => {
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-white text-3xl mb-1">{arduino.deviceName}</h1>
              <p className="text-slate-400 font-mono text-sm">
                {arduino.macAddress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowHistoricalLogs(true)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <History className="size-4 mr-2" />
              Historical Logs
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Settings className="size-4 mr-2" />
              Settings
            </Button>
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="h-8 px-4"
            >
              <Activity className="size-4 mr-2" />
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 flex items-center gap-3">
                <Cpu className="size-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Firmware</p>
                  <p className="text-white">{data.firmware}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Temperature"
            value={data.temperature.toFixed(1)}
            unit="°C"
            icon={Thermometer}
            color="text-orange-400"
            bgColor="bg-orange-500/10"
            status={getTemperatureStatus(data.temperature)}
          />
          <MetricCard
            title="Humidity"
            value={data.humidity.toFixed(1)}
            unit="%"
            icon={Droplets}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <MetricCard
            title="Voltage"
            value={data.voltage.toFixed(2)}
            unit="V"
            icon={Battery}
            color="text-green-400"
            bgColor="bg-green-500/10"
            status={getVoltageStatus(data.voltage)}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            title="Temperature & Humidity"
            data={historicalData}
            dataKeys={[
              {
                key: "temperature",
                color: "#fb923c",
                name: "Temperature (°C)",
              },
              {
                key: "humidity",
                color: "#60a5fa",
                name: "Humidity (%)",
              },
            ]}
          />
          <Chart
            title="Voltage"
            data={historicalData}
            dataKeys={[
              {
                key: "voltage",
                color: "#4ade80",
                name: "Voltage (V)",
              },
            ]}
          />
        </div>

        {/* Events and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventsPanel events={allEvents} />
          <LogsPanel logs={allLogs} />
        </div>

        {/* Last Update */}
        {data.update && (
          <div className="text-center text-slate-500 text-sm">
            Last update: {data.update}
          </div>
        )}
      </div>

      {/* Historical Logs Dialog */}
      <HistoricalLogsDialog
        open={showHistoricalLogs}
        onOpenChange={setShowHistoricalLogs}
        deviceName={arduino.deviceName}
      />

      {/* Settings Dialog */}
      <ArduinoSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        arduino={arduino}
        onArduinoUpdated={handleArduinoUpdated}
        onArduinoDeleted={handleArduinoDeleted}
      />
    </div>
  );
}
