import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { Arduino } from "../App";
import { toast } from "sonner@2.0.3";

interface ArduinoUpdate {
  deviceName: string;
  macAddress: string;
  description: string;
}

interface EditArduinoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arduino: Arduino;
  onArduinoUpdated: (arduino: Arduino) => void;
}

export function EditArduinoDialog({ open, onOpenChange, arduino, onArduinoUpdated }: EditArduinoDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && arduino) {
      setDeviceName(arduino.deviceName);
      setMacAddress(arduino.macAddress);
      setDescription("");
    }
  }, [open, arduino]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!deviceName.trim()) {
      newErrors.deviceName = "Please set a name for the device";
    }

    if (!macAddress.trim()) {
      newErrors.macAddress = "Please set the mac address for connection";
    } else if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macAddress)) {
      newErrors.macAddress = "Please enter a valid MAC address (e.g., 00:1B:44:11:3A:B7)";
    }

    if (description.length > 2048) {
      newErrors.description = "Description cannot exceed 2048 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`/api/arduinos/${arduino.deviceName}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ deviceName, macAddress, description })
      // });
      // const data: Arduino = await response.json();

      // Mock API response
      const updatedArduino: Arduino = {
        ...arduino,
        deviceName,
        macAddress,
        lastModifiedDate: new Date().toISOString()
      };

      onArduinoUpdated(updatedArduino);
      toast.success("Arduino updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating Arduino:", error);
      toast.error("Failed to update Arduino");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Arduino Device</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update the device information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">Device Name *</Label>
            <Input
              id="deviceName"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g., Living Room Sensor"
              className="bg-slate-900 border-slate-700 text-white"
            />
            {errors.deviceName && (
              <p className="text-red-400 text-sm">{errors.deviceName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="macAddress">MAC Address *</Label>
            <Input
              id="macAddress"
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
              placeholder="00:1B:44:11:3A:B7"
              className="bg-slate-900 border-slate-700 text-white font-mono"
            />
            {errors.macAddress && (
              <p className="text-red-400 text-sm">{errors.macAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description 
              <span className="text-slate-500 text-sm ml-2">
                ({description.length}/2048)
              </span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this device"
              className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
              maxLength={2048}
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-slate-700 text-slate-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Device"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
