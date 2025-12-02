import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, Thermometer, Droplets, Battery, Calendar, Loader2 } from "lucide-react";

interface ArduinoDataMessage {
  firmware: string;
  temperature: number;
  humidity: number;
  voltage: number;
  update: string;
  events: string;
  logs: string;
}

interface PageArduinoData {
  content: ArduinoDataMessage[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface HistoricalLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
}

export function HistoricalLogsDialog({ open, onOpenChange, deviceName }: HistoricalLogsDialogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<PageArduinoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistoricalLogs = async (page: number) => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`/api/logs/${page}?device=${encodeURIComponent(deviceName)}`);
      // const data: PageArduinoData = await response.json();

      // Mock API response
      const mockData: PageArduinoData = {
        content: Array.from({ length: 10 }, (_, i) => ({
          firmware: "v2.3.1",
          temperature: 20 + Math.random() * 10,
          humidity: 40 + Math.random() * 20,
          voltage: 3.3 + (Math.random() * 0.4 - 0.2),
          update: new Date(Date.now() - (page * 10 + i) * 60000).toISOString(),
          events: Math.random() > 0.7 ? "Temperature threshold exceeded" : "",
          logs: `System check ${page * 10 + i + 1}`
        })),
        page: page,
        size: 10,
        totalPages: 25,
        totalElements: 250
      };

      setData(mockData);
    } catch (error) {
      console.error("Error fetching historical logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchHistoricalLogs(currentPage);
    }
  }, [open, currentPage, deviceName]);

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return "text-blue-400";
    if (temp < 25) return "text-green-400";
    if (temp < 30) return "text-yellow-400";
    return "text-red-400";
  };

  const getVoltageColor = (voltage: number) => {
    if (voltage < 3.0) return "text-red-400";
    if (voltage < 3.3) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-blue-400" />
            Historical Logs - {deviceName}
          </DialogTitle>
          {data && (
            <p className="text-slate-400 text-sm">
              Showing {data.content.length} of {data.totalElements} total records
            </p>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {data?.content.map((record, index) => (
                  <Card key={index} className="bg-slate-900/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                            {formatDateTime(record.update)}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {record.firmware}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-500/10 p-2 rounded">
                            <Thermometer className="size-4 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Temperature</p>
                            <p className={`${getTemperatureColor(record.temperature)}`}>
                              {record.temperature.toFixed(1)}°C
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-blue-500/10 p-2 rounded">
                            <Droplets className="size-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Humidity</p>
                            <p className="text-blue-400">
                              {record.humidity.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="bg-green-500/10 p-2 rounded">
                            <Battery className="size-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Voltage</p>
                            <p className={getVoltageColor(record.voltage)}>
                              {record.voltage.toFixed(2)}V
                            </p>
                          </div>
                        </div>
                      </div>

                      {(record.events || record.logs) && (
                        <div className="pt-3 border-t border-slate-700 space-y-2">
                          {record.events && (
                            <div className="flex items-start gap-2">
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shrink-0">
                                Event
                              </Badge>
                              <p className="text-sm text-slate-300">{record.events}</p>
                            </div>
                          )}
                          {record.logs && (
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="border-slate-600 text-slate-400 shrink-0">
                                Log
                              </Badge>
                              <p className="text-sm text-slate-400 font-mono">{record.logs}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {data?.content.length === 0 && (
                  <div className="text-center text-slate-500 py-12">
                    No historical logs found
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="text-sm text-slate-400">
                  Page {data.page + 1} of {data.totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0 || isLoading}
                  >
                    <ChevronLeft className="size-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300"
                    onClick={() => setCurrentPage(prev => Math.min(data.totalPages - 1, prev + 1))}
                    disabled={currentPage >= data.totalPages - 1 || isLoading}
                  >
                    Next
                    <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
