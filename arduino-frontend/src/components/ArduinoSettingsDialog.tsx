import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Edit, Key, Power, Trash2, Settings as SettingsIcon } from "lucide-react";
import { Arduino } from "../App";
import { EditArduinoDialog } from "./EditArduinoDialog";
import { RegenerateTokenDialog } from "./RegenerateTokenDialog";
import { DeleteArduinoDialog } from "./DeleteArduinoDialog";
import { toast } from "sonner@2.0.3";

interface ArduinoSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arduino: Arduino;
  onArduinoUpdated: (arduino: Arduino) => void;
  onArduinoDeleted: () => void;
}

export function ArduinoSettingsDialog({
  open,
  onOpenChange,
  arduino,
  onArduinoUpdated,
  onArduinoDeleted,
}: ArduinoSettingsDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleActive = async () => {
    setIsToggling(true);

    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`/api/arduinos/toggle/${encodeURIComponent(arduino.deviceName)}`, {
      //   method: 'POST'
      // });
      // const data: Arduino = await response.json();

      // Mock toggle
      const updatedArduino = { ...arduino, active: !arduino.active };
      onArduinoUpdated(updatedArduino);

      toast.success(
        `${arduino.deviceName} has been ${updatedArduino.active ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Error toggling Arduino:", error);
      toast.error("Failed to toggle Arduino");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SettingsIcon className="size-5 text-blue-400" />
              Device Settings
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Manage settings for {arduino.deviceName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Toggle Active/Inactive */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Power className="size-4 text-yellow-400" />
                  Device Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-400">
                  Current status: <span className={arduino.active ? "text-green-400" : "text-slate-500"}>
                    {arduino.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <Button
                  onClick={handleToggleActive}
                  disabled={isToggling}
                  className={arduino.active 
                    ? "w-full bg-yellow-600 hover:bg-yellow-700" 
                    : "w-full bg-green-600 hover:bg-green-700"
                  }
                >
                  <Power className="size-4 mr-2" />
                  {isToggling ? "Processing..." : arduino.active ? "Deactivate Device" : "Activate Device"}
                </Button>
              </CardContent>
            </Card>

            {/* Edit Device */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Edit className="size-4 text-blue-400" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-400">
                  Update device name, MAC address, and description
                </p>
                <Button
                  onClick={() => setEditDialogOpen(true)}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Edit className="size-4 mr-2" />
                  Edit Details
                </Button>
              </CardContent>
            </Card>

            {/* Regenerate Tokens */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Key className="size-4 text-amber-400" />
                  API Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-400">
                  Generate new API key and secret for this device
                </p>
                <Button
                  onClick={() => setTokenDialogOpen(true)}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Key className="size-4 mr-2" />
                  Regenerate Tokens
                </Button>
              </CardContent>
            </Card>

            {/* Delete Device */}
            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                  <Trash2 className="size-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-400">
                  Permanently delete this device and all its data
                </p>
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="size-4 mr-2" />
                  Delete Device
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-dialogs */}
      <EditArduinoDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        arduino={arduino}
        onArduinoUpdated={onArduinoUpdated}
      />

      <RegenerateTokenDialog
        open={tokenDialogOpen}
        onOpenChange={setTokenDialogOpen}
        deviceName={arduino.deviceName}
      />

      <DeleteArduinoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        arduinoId={arduino.id}
        deviceName={arduino.deviceName}
        onArduinoDeleted={onArduinoDeleted}
      />
    </>
  );
}
