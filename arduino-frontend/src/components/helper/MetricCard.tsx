import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  status?: {
    color: string;
    status: string;
  };
}

export function MetricCard({ title, value, unit, icon: Icon, color, bgColor, status }: MetricCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-slate-300">{title}</span>
          <div className={`${bgColor} p-2 rounded-lg`}>
            <Icon className={`size-5 ${color}`} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl text-white">{value}</span>
              <span className="text-xl text-slate-400">{unit}</span>
            </div>
          </div>
          {status && (
            <Badge className={`${status.color} border-0`}>
              {status.status}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
