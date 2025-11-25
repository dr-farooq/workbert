import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock roles for now
const ROLES = [
  "Doctor",
  "Nurse",
  "Registrar",
  "Consultant",
  "Intern",
  "Admin",
];

export interface ShiftType {
  id: string;
  code: string; // e.g. "D-AM"
  name: string; // e.g. "Day Morning"
  color: string;
  startTime: string;
  endTime: string;
  allowedRoles: string[];
}

interface ShiftTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftTypes: ShiftType[];
  onUpdate: (types: ShiftType[]) => void;
}

export function ShiftTypesDialog({
  open,
  onOpenChange,
  shiftTypes,
  onUpdate,
}: ShiftTypesDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newShift, setNewShift] = useState<Partial<ShiftType>>({
    color: "#3b82f6",
    allowedRoles: [],
  });

  const handleAdd = () => {
    if (
      !newShift.code ||
      !newShift.name ||
      !newShift.startTime ||
      !newShift.endTime
    ) {
      return; // Validation
    }

    const shift: ShiftType = {
      id: Math.random().toString(36).substring(7),
      code: newShift.code,
      name: newShift.name,
      color: newShift.color || "#3b82f6",
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      allowedRoles: newShift.allowedRoles || [],
    };

    onUpdate([...shiftTypes, shift]);
    setIsAdding(false);
    setNewShift({ color: "#3b82f6", allowedRoles: [] });
  };

  const handleDelete = (id: string) => {
    onUpdate(shiftTypes.filter((t) => t.id !== id));
  };

  const toggleRole = (role: string) => {
    const current = newShift.allowedRoles || [];
    if (current.includes(role)) {
      setNewShift({
        ...newShift,
        allowedRoles: current.filter((r) => r !== role),
      });
    } else {
      setNewShift({ ...newShift, allowedRoles: [...current, role] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle>Manage Shift Types</DialogTitle>
          <DialogDescription>
            Define the shift resources available in your roster and who can work
            them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* List of existing types */}
          {!isAdding && (
            <div className="space-y-2">
              {shiftTypes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No shift types defined yet.
                </p>
              )}
              <div className="grid gap-2">
                {shiftTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {type.code}
                          </span>
                          <span className="text-xs text-gray-500">
                            {type.startTime} - {type.endTime}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{type.name}</div>
                        <div className="flex gap-1 mt-1">
                          {type.allowedRoles.map((role) => (
                            <span
                              key={role}
                              className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-600 border border-gray-200"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(type.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setIsAdding(true)}
                className="w-full mt-2 gap-2 border-dashed border-2 bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-gray-300 shadow-none"
              >
                <Plus className="h-4 w-4" />
                Add New Shift Type
              </Button>
            </div>
          )}

          {/* Add New Form */}
          {isAdding && (
            <div className="space-y-4 border border-gray-200 p-4 rounded-lg bg-gray-50/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g. D-AM"
                    value={newShift.code || ""}
                    onChange={(e) =>
                      setNewShift({ ...newShift, code: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Day Morning"
                    value={newShift.name || ""}
                    onChange={(e) =>
                      setNewShift({ ...newShift, name: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={newShift.startTime || ""}
                      onChange={(e) =>
                        setNewShift({ ...newShift, startTime: e.target.value })
                      }
                      className="bg-white"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="time"
                      value={newShift.endTime || ""}
                      onChange={(e) =>
                        setNewShift({ ...newShift, endTime: e.target.value })
                      }
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={newShift.color}
                      onChange={(e) =>
                        setNewShift({ ...newShift, color: e.target.value })
                      }
                      className="w-12 p-1 h-10 bg-white cursor-pointer"
                    />
                    <div
                      className="flex-1 h-10 rounded-md border border-gray-200"
                      style={{ backgroundColor: newShift.color }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allowed Roles</Label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((role) => {
                    const isSelected =
                      newShift.allowedRoles?.includes(role) || false;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                          isSelected
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleAdd}
                  className="flex-1 bg-[#00C853] hover:bg-[#00b54b] text-white"
                >
                  Add Shift Type
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          {!isAdding && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

