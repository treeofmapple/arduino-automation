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
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { deleteArduinoById } from "../api/mainEndpoints";

interface DeleteArduinoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arduinoId: number;
  deviceName: string;
  onArduinoDeleted: () => void;
}

export function DeleteArduinoDialog({
  open,
  onOpenChange,
  arduinoId,
  deviceName,
  onArduinoDeleted,
}: DeleteArduinoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteArduinoById(arduinoId);

      toast.success(`${deviceName} has been deleted`);
      onArduinoDeleted();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting Arduino:", error);
      toast.error("Failed to delete Arduino");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-400" />
            Delete Arduino Device
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Are you sure you want to delete <strong>{deviceName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 text-sm">
            <strong>Warning:</strong> All historical data and configurations for
            this device will be permanently deleted.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-700 text-slate-300"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Device"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
