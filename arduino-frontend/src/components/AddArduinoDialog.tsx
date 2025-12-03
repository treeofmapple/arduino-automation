import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, CheckCircle, Copy } from "lucide-react";
import { Arduino } from "../App";
import { toast } from "sonner@2.0.3";
import { createArduino } from "../api/mainEndpoints";
import { ArduinoRequest } from "../api/endpointsDto";

interface ArduinoResponseToken extends Arduino {
  apiKey: string;
  secret: string;
}

interface AddArduinoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArduinoCreated: (arduino: Arduino) => void;
}

export function AddArduinoDialog({ open, onOpenChange, onArduinoCreated }: AddArduinoDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createdArduino, setCreatedArduino] = useState<ArduinoResponseToken | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!deviceName.trim()) {
      newErrors.deviceName = "Please set a name for the device";
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
    setErrors({});

    try {
      const requestBody: ArduinoRequest = {
        deviceName: deviceName,
        description: description
      };

      const data = await createArduino(requestBody);

      setCreatedArduino(data);
      toast.success("Arduino device created successfully!");

    } catch (error) {
      console.error("Error creating Arduino:", error);
      toast.error("Failed to create Arduino device. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (createdArduino) {
      onArduinoCreated(createdArduino as unknown as Arduino);
    }

    setDeviceName("");
    setDescription("");
    setErrors({});
    setCreatedArduino(null);
    onOpenChange(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        {!createdArduino ? (
          <>
            <DialogHeader>
              <DialogTitle>Add New Arduino Device</DialogTitle>
              <DialogDescription className="text-slate-400">
                Register a new Arduino device to start monitoring
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
                      Creating...
                    </>
                  ) : (
                    "Create Device"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="size-6" />
                <DialogTitle>Device Created Successfully!</DialogTitle>
              </div>
              <DialogDescription className="text-slate-400">
                Save these credentials securely. You won't be able to see the
                secret again.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-slate-900 p-4 rounded-lg space-y-3">
                <div>
                  <Label className="text-slate-400 text-xs">Device ID</Label>
                  <p className="text-white">{createdArduino.id}</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Device Name</Label>
                  <p className="text-white">{createdArduino.deviceName}</p>
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">MAC Address</Label>
                  <p className="text-white font-mono">
                    {createdArduino.macAddress}
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-amber-400 text-xs">API Key</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-amber-400 hover:text-amber-300"
                      onClick={() =>
                        copyToClipboard(createdArduino.apiKey!, "API Key")
                      }
                    >
                      <Copy className="size-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-white font-mono text-sm break-all">
                    {createdArduino.apiKey}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-amber-400 text-xs">Secret</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-amber-400 hover:text-amber-300"
                      onClick={() =>
                        copyToClipboard(createdArduino.secret!, "Secret")
                      }
                    >
                      <Copy className="size-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-white font-mono text-sm break-all">
                    {createdArduino.secret}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
