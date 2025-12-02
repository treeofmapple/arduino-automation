import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Cpu, Wifi, WifiOff, ChevronLeft, ChevronRight, MoreVertical, Edit, Key, Trash2, Power } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AddArduinoDialog } from "./AddArduinoDialog";
import { Arduino } from "../App";
import { toast } from "sonner";
import { fetchArduinosByPage } from "../api/searchEndpoints";

interface PageArduinoResponse {
  content: Arduino[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface ArduinoListProps {
  onSelectArduino: (arduino: Arduino) => void;
}

export function ArduinoList({ onSelectArduino }: ArduinoListProps) {
  const [arduinos, setArduinos] = useState<Arduino[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArduino, setSelectedArduino] = useState<Arduino | null>(null);

  const fetchArduinos = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetchArduinosByPage(page);
      setArduinos(data.content);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching Arduinos:", error);
      toast.error("Failed to load Arduino devices.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArduinos(currentPage);
  }, [currentPage]);

  const handleArduinoCreated = (newArduino: Arduino) => {
    setArduinos(prev => [newArduino, ...prev]);
    setTotalElements(prev => prev + 1);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl mb-2">Arduino Devices</h1>
            <p className="text-slate-400">
              Manage and monitor your Arduino devices ({totalElements} total)
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="size-4 mr-2" />
            Add Arduino
          </Button>
        </div>

        {/* Arduino Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-slate-400 py-12">
              Loading devices...
            </div>
          ) : arduinos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Cpu className="size-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No Arduino devices found</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="size-4 mr-2" />
                Add Your First Arduino
              </Button>
            </div>
          ) : (
            arduinos.map((arduino) => (
              <Card
                key={arduino.id}
                className="bg-slate-800/50 border-slate-700 backdrop-blur hover:border-slate-600 transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="bg-blue-500/10 p-3 rounded-lg group-hover:bg-blue-500/20 transition-colors cursor-pointer"
                      onClick={() => onSelectArduino(arduino)}
                    >
                      <Cpu className="size-6 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={arduino.active ? "default" : "secondary"}
                        className={arduino.active ? "bg-green-500" : "bg-slate-600"}
                      >
                        {arduino.active ? (
                          <>
                            <Wifi className="size-3 mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <WifiOff className="size-3 mr-1" />
                            Offline
                          </>
                        )}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                          >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(arduino, {} as React.MouseEvent)}
                            className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
                          >
                            <Power className="size-4 mr-2" />
                            {arduino.active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(arduino, {} as React.MouseEvent)}
                            className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
                          >
                            <Edit className="size-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRegenerateToken(arduino.deviceName, {} as React.MouseEvent)}
                            className="cursor-pointer hover:bg-slate-700 focus:bg-slate-700"
                          >
                            <Key className="size-4 mr-2" />
                            Regenerate Tokens
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(arduino, {} as React.MouseEvent)}
                            className="cursor-pointer hover:bg-red-600 focus:bg-red-600 text-red-400"
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardTitle
                    className="text-white cursor-pointer"
                    onClick={() => onSelectArduino(arduino)}
                  >
                    {arduino.deviceName}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {arduino.macAddress}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Firmware</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {arduino.firmware}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      Last updated: {formatDate(arduino.lastModifiedDate)}
                    </p>
                  </div>
                  <Button
                    className="w-full bg-slate-700 hover:bg-slate-600"
                    onClick={() => onSelectArduino(arduino)}
                  >
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="size-4 mr-1" />
              Previous
            </Button>
            <div className="text-slate-400 px-4">
              Page {currentPage + 1} of {totalPages}
            </div>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Add Arduino Dialog */}
      <AddArduinoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onArduinoCreated={handleArduinoCreated}
      />
    </div>
  );
}
