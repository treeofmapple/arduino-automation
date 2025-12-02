import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { FileText } from "lucide-react";

interface LogsPanelProps {
  logs: string[];
}

export function LogsPanel({ logs }: LogsPanelProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-300">
          <FileText className="size-5 text-blue-400" />
          System Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No logs available</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 hover:bg-slate-900/30 rounded"
                >
                  <span className="text-slate-600 shrink-0">
                    [{new Date().toLocaleTimeString()}]
                  </span>
                  <span className="text-slate-400">{log}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
