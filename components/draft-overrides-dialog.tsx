"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, AlertTriangle, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { RosterRule, Member } from "./roster-settings-dialog";

export type RuleOverride = {
  id: string;
  ruleId: string;
  ruleName: string;
  staffId: string;
  staffName: string;
  originalValue: number;
  overrideValue: number;
  unit: string;
  reason: string;
  createdBy: "user" | "ai";
};

interface DraftOverridesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftName: string;
  rosterRules: RosterRule[];
  overrides: RuleOverride[];
  members: Member[];
  onUpdate: (overrides: RuleOverride[]) => void;
}

export function DraftOverridesDialog({
  open,
  onOpenChange,
  draftName,
  rosterRules,
  overrides,
  members,
  onUpdate,
}: DraftOverridesDialogProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOverride, setNewOverride] = useState<Partial<RuleOverride>>({
    createdBy: "user",
  });

  const handleAddOverride = () => {
    if (
      !newOverride.ruleId ||
      !newOverride.staffId ||
      !newOverride.overrideValue ||
      !newOverride.reason
    ) {
      return;
    }

    const rule = rosterRules.find((r) => r.id === newOverride.ruleId);
    const staff = members.find((m) => m.id === newOverride.staffId);

    if (!rule || !staff) return;

    const override: RuleOverride = {
      id: `override-${Date.now()}`,
      ruleId: rule.id,
      ruleName: rule.label,
      staffId: staff.id,
      staffName: staff.name,
      originalValue: rule.value,
      overrideValue: newOverride.overrideValue,
      unit: rule.unit,
      reason: newOverride.reason,
      createdBy: newOverride.createdBy || "user",
    };

    onUpdate([...overrides, override]);

    // Reset form
    setNewOverride({ createdBy: "user" });
    setShowAddForm(false);
  };

  const handleDeleteOverride = (overrideId: string) => {
    onUpdate(overrides.filter((o) => o.id !== overrideId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Draft Overrides - {draftName}</DialogTitle>
          <DialogDescription>
            Manage rule overrides specific to this draft version
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-6">
          {/* Roster Rules Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Roster Rules (from Settings)
            </h3>
            {rosterRules.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
                No roster rules configured
              </div>
            ) : (
              <div className="space-y-1">
                {rosterRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center gap-2 text-sm text-gray-700 py-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    <span className="font-medium">{rule.label}:</span>
                    <span>
                      {rule.value} {rule.unit}
                    </span>
                    {rule.scope !== "all" && (
                      <Badge variant="outline" className="text-xs">
                        {rule.scope}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200" />

          {/* Overrides for This Draft */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Overrides for This Draft
              </h3>
              {!showAddForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="gap-1.5 h-8"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Override
                </Button>
              )}
            </div>

            {overrides.length === 0 && !showAddForm ? (
              <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
                No overrides for this draft
              </div>
            ) : (
              <div className="space-y-2">
                {overrides.map((override) => (
                  <div
                    key={override.id}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3.5 w-3.5 text-gray-600" />
                          <p className="text-sm font-medium text-gray-900">
                            {override.staffName}
                          </p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              override.createdBy === "ai"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {override.createdBy === "ai"
                              ? "AI Suggested"
                              : "Manual Override"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                          <span className="font-medium">
                            {override.ruleName}:
                          </span>
                          <span className="line-through text-gray-500">
                            {override.originalValue} {override.unit}
                          </span>
                          <span>→</span>
                          <span className="font-semibold text-yellow-700">
                            {override.overrideValue} {override.unit}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Reason:</span>{" "}
                          {override.reason}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 shrink-0"
                        onClick={() => handleDeleteOverride(override.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Override Form */}
            {showAddForm && (
              <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Add New Override
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewOverride({ createdBy: "user" });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                      Staff Member
                    </label>
                    <Select
                      value={newOverride.staffId}
                      onValueChange={(value) =>
                        setNewOverride({ ...newOverride, staffId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff..." />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                      Rule to Override
                    </label>
                    <Select
                      value={newOverride.ruleId}
                      onValueChange={(value) =>
                        setNewOverride({ ...newOverride, ruleId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rule..." />
                      </SelectTrigger>
                      <SelectContent>
                        {rosterRules.map((rule) => (
                          <SelectItem key={rule.id} value={rule.id}>
                            {rule.label} ({rule.value} {rule.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                    New Value
                  </label>
                  <Input
                    type="number"
                    value={newOverride.overrideValue || ""}
                    onChange={(e) =>
                      setNewOverride({
                        ...newOverride,
                        overrideValue: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 55"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                    Reason for Override
                  </label>
                  <Input
                    value={newOverride.reason || ""}
                    onChange={(e) =>
                      setNewOverride({ ...newOverride, reason: e.target.value })
                    }
                    placeholder="e.g. Short-staffed, approved by HOD"
                  />
                </div>

                <Button
                  onClick={handleAddOverride}
                  className="w-full"
                  disabled={
                    !newOverride.ruleId ||
                    !newOverride.staffId ||
                    !newOverride.overrideValue ||
                    !newOverride.reason
                  }
                >
                  Add Override
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 -mx-6 px-6 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
