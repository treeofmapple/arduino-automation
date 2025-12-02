import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { AlertCircle } from "lucide-react";

interface EventsPanelProps {
  events: string[];
}

export function EventsPanel({ events }: EventsPanelProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-300">
          <AlertCircle className="size-5 text-yellow-400" />
          Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No events recorded</p>
            ) : (
              events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
                >
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 shrink-0">
                    {new Date().toLocaleTimeString()}
                  </Badge>
                  <p className="text-slate-300">{event}</p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
