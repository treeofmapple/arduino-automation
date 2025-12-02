import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Loader2, Copy, AlertTriangle } from "lucide-react";
import { Arduino } from "../App";
import { toast } from "sonner@2.0.3";

interface ArduinoResponseToken extends Arduino {
  apiKey: string;
  secret: string;
}

interface RegenerateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
}

export function RegenerateTokenDialog({ open, onOpenChange, deviceName }: RegenerateTokenDialogProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newTokens, setNewTokens] = useState<ArduinoResponseToken | null>(null);

  const handleRegenerate = async () => {
    setIsRegenerating(true);

    try {
      // Replace with your actual API endpoint
      // const response = await fetch(`/api/arduinos/token/${encodeURIComponent(deviceName)}`, {
      //   method: 'PUT'
      // });
      // const data: ArduinoResponseToken = await response.json();

      // Mock API response
      const mockResponse: ArduinoResponseToken = {
        id: Date.now(),
        deviceName: deviceName,
        macAddress: "00:1B:44:11:3A:B7",
        firmware: "v2.3.1",
        active: true,
        apiKey: `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        secret: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString()
      };

      setNewTokens(mockResponse);
      toast.success("Tokens regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating tokens:", error);
      toast.error("Failed to regenerate tokens");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleClose = () => {
    setNewTokens(null);
    onOpenChange(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        {!newTokens ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-400" />
                Regenerate API Tokens
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                This will invalidate the current API key and secret for <strong>{deviceName}</strong>. 
                Any devices using the old credentials will stop working.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
              <p className="text-amber-400 text-sm">
                <strong>Warning:</strong> Make sure you update your Arduino device with the new credentials immediately after regenerating.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-slate-700 text-slate-300"
                disabled={isRegenerating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRegenerate}
                className="bg-amber-600 hover:bg-amber-700"
                disabled={isRegenerating}
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  "Regenerate Tokens"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>New Tokens Generated</DialogTitle>
              <DialogDescription className="text-slate-400">
                Save these credentials securely. You won't be able to see the secret again.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-amber-400 text-xs">API Key</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-amber-400 hover:text-amber-300"
                    onClick={() => copyToClipboard(newTokens.apiKey!, "API Key")}
                  >
                    <Copy className="size-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-white font-mono text-sm break-all">{newTokens.apiKey}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-amber-400 text-xs">Secret</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-amber-400 hover:text-amber-300"
                    onClick={() => copyToClipboard(newTokens.secret!, "Secret")}
                  >
                    <Copy className="size-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-white font-mono text-sm break-all">{newTokens.secret}</p>
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
