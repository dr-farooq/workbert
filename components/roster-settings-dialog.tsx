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
import { Label } from "@/components/ui/label";
import {
  X,
  Plus,
  AlertTriangle,
  Info,
  User,
  Search,
  Trash2,
  Users,
  Settings2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
export type RosterRule = {
  id: string;
  type: string;
  label: string;
  value: number;
  unit: string;
  severity: "error" | "warning";
  scope: "all" | string; // "all" or specific role like "Doctor"
};

export type RosterSettings = {
  name: string;
  startDate: string;
  endDate: string;
  durationType: string;
  rules: RosterRule[];
};

export interface ShiftType {
  id: string;
  code: string;
  name: string;
  color: string;
  startTime: string;
  endTime: string;
  allowedRoles: string[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  fte: number;
  maxShiftsPerWeek: number;
  tags: string[];
}

interface RosterSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: RosterSettings;
  onUpdate: (settings: RosterSettings) => void;
  // Shift Types Props
  shiftTypes: ShiftType[];
  onUpdateShiftTypes: (types: ShiftType[]) => void;
  // Members Props
  members: Member[];
  onUpdateMembers: (members: Member[]) => void;
  onDeleteRoster: () => void;
}

const RULE_TYPES = [
  { value: "max_hours_week", label: "Max Hours per Week", unit: "hours" },
  {
    value: "max_hours_fortnight",
    label: "Max Hours per Fortnight",
    unit: "hours",
  },
  { value: "min_rest_hours", label: "Min Rest Between Shifts", unit: "hours" },
  {
    value: "max_consecutive_nights",
    label: "Max Consecutive Night Shifts",
    unit: "shifts",
  },
  { value: "max_shifts_week", label: "Max Shifts per Week", unit: "shifts" },
  {
    value: "max_weekend_frequency",
    label: "Max Weekend Frequency",
    unit: "per month",
  },
];

const ROLES = ["Doctor", "Nurse", "Registrar", "Consultant", "Intern", "Admin"];

export function RosterSettingsDialog({
  open,
  onOpenChange,
  settings,
  onUpdate,
  shiftTypes,
  onUpdateShiftTypes,
  members,
  onUpdateMembers,
  onDeleteRoster,
}: RosterSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "rules" | "members" | "shift-types" | "ai" | "notifications"
  >("rules");

  // Rule State
  const [newRule, setNewRule] = useState<Partial<RosterRule>>({
    type: "max_hours_week",
    value: 50,
    severity: "error",
    scope: "all",
  });

  // Shift Type State
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShift, setNewShift] = useState<Partial<ShiftType>>({
    color: "#3b82f6",
    allowedRoles: [],
  });

  // Member State
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [newMember, setNewMember] = useState<Partial<Member>>({
    role: "Doctor",
    fte: 1.0,
    maxShiftsPerWeek: 5,
    tags: [],
  });

  // --- Handlers ---

  // Rules
  const handleAddRule = () => {
    if (!newRule.type || !newRule.value) return;

    const ruleType = RULE_TYPES.find((r) => r.value === newRule.type);
    if (!ruleType) return;

    const rule: RosterRule = {
      id: `rule-${Date.now()}`,
      type: newRule.type,
      label: ruleType.label,
      value: newRule.value,
      unit: ruleType.unit,
      severity: newRule.severity || "error",
      scope: newRule.scope || "all",
    };

    onUpdate({
      ...settings,
      rules: [...settings.rules, rule],
    });

    setNewRule({
      type: "max_hours_week",
      value: 50,
      severity: "error",
      scope: "all",
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    onUpdate({
      ...settings,
      rules: settings.rules.filter((r) => r.id !== ruleId),
    });
  };

  // Shift Types
  const handleAddShift = () => {
    if (
      !newShift.code ||
      !newShift.name ||
      !newShift.startTime ||
      !newShift.endTime
    ) {
      return;
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

    onUpdateShiftTypes([...shiftTypes, shift]);
    setIsAddingShift(false);
    setNewShift({ color: "#3b82f6", allowedRoles: [] });
  };

  const handleDeleteShift = (id: string) => {
    onUpdateShiftTypes(shiftTypes.filter((t) => t.id !== id));
  };

  const toggleShiftRole = (role: string) => {
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

  // Members
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;

    const member: Member = {
      id: Math.random().toString(36).substring(7),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role || "Doctor",
      fte: newMember.fte || 1.0,
      maxShiftsPerWeek: newMember.maxShiftsPerWeek || 5,
      tags: newMember.tags || [],
    };

    onUpdateMembers([...members, member]);
    setIsAddingMember(false);
    setNewMember({ role: "Doctor", fte: 1.0, maxShiftsPerWeek: 5, tags: [] });
  };

  const handleDeleteMember = (id: string) => {
    onUpdateMembers(members.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[900px] h-[700px] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 shrink-0">
          <DialogTitle>Roster Settings</DialogTitle>
          <DialogDescription>
            Configure configuration, rules, staff, and shift types.
          </DialogDescription>
        </DialogHeader>

        {/* Layout: Sidebar Tabs + Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 shrink-0 flex flex-col py-2">
            {[
              { id: "general", label: "General", icon: Settings2 },
              { id: "rules", label: "Compliance Rules", icon: AlertTriangle },
              { id: "members", label: "Members", icon: Users },
              { id: "shift-types", label: "Shift Types", icon: Clock },
              { id: "ai", label: "AI Preferences", icon: Settings2 }, // Using Settings2 as placeholder
              { id: "notifications", label: "Notifications", icon: Info },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors text-left w-full",
                  activeTab === tab.id
                    ? "bg-white text-blue-600 border-r-2 border-blue-600 -mr-px"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <ScrollArea className="flex-1 h-full">
              <div className="p-6">
                {/* --- General Tab --- */}
                {activeTab === "general" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Roster Details
                      </h3>
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                          Roster Name
                        </label>
                        <Input
                          value={settings.name}
                          onChange={(e) =>
                            onUpdate({ ...settings, name: e.target.value })
                          }
                          className="max-w-md"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                            Start Date
                          </label>
                          <Input
                            type="date"
                            value={settings.startDate}
                            onChange={(e) =>
                              onUpdate({
                                ...settings,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                            End Date
                          </label>
                          <Input
                            type="date"
                            value={settings.endDate}
                            onChange={(e) =>
                              onUpdate({ ...settings, endDate: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                          Duration Type
                        </label>
                        <Select
                          value={settings.durationType}
                          onValueChange={(value) =>
                            onUpdate({ ...settings, durationType: value })
                          }
                        >
                          <SelectTrigger className="max-w-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="FORTNIGHTLY">
                              Fortnightly
                            </SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-semibold text-red-600 mb-3">
                        Danger Zone
                      </h3>
                      <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            Delete this roster
                          </p>
                          <p className="text-xs text-red-700 mt-0.5">
                            Once you delete a roster, there is no going back.
                            Please be certain.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 border shadow-sm"
                          onClick={onDeleteRoster}
                        >
                          Delete Roster
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Rules Tab --- */}
                {activeTab === "rules" && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
                      <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Compliance Rules</p>
                        <p className="text-blue-700 text-xs">
                          These rules apply to all drafts in this roster.
                          Individual drafts can override specific rules when
                          needed.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Active Rules
                      </h3>
                      {settings.rules.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
                          No compliance rules configured yet
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {settings.rules.map((rule) => (
                            <div
                              key={rule.id}
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {rule.severity === "error" ? (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900">
                                      {rule.label}
                                    </p>
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "text-xs",
                                        rule.severity === "error"
                                          ? "bg-red-50 text-red-700 border-red-200"
                                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      )}
                                    >
                                      {rule.severity === "error"
                                        ? "Hard Block"
                                        : "Warning"}
                                    </Badge>
                                    {rule.scope !== "all" && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {rule.scope}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {rule.value} {rule.unit}
                                    {rule.scope === "all"
                                      ? " (all staff)"
                                      : ` (${rule.scope} only)`}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Add New Rule
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                              Rule Type
                            </label>
                            <Select
                              value={newRule.type}
                              onValueChange={(value) =>
                                setNewRule({ ...newRule, type: value })
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {RULE_TYPES.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                              Value
                            </label>
                            <Input
                              type="number"
                              value={newRule.value || ""}
                              onChange={(e) =>
                                setNewRule({
                                  ...newRule,
                                  value: parseInt(e.target.value) || 0,
                                })
                              }
                              placeholder="e.g. 50"
                              className="bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                              Severity
                            </label>
                            <Select
                              value={newRule.severity}
                              onValueChange={(value: "error" | "warning") =>
                                setNewRule({ ...newRule, severity: value })
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="error">
                                  Hard Block
                                </SelectItem>
                                <SelectItem value="warning">
                                  Warning Only
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                              Applies To
                            </label>
                            <Select
                              value={newRule.scope}
                              onValueChange={(value) =>
                                setNewRule({ ...newRule, scope: value })
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role === "all" ? "All Staff" : role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          onClick={handleAddRule}
                          className="w-full gap-2 mt-2"
                          disabled={!newRule.type || !newRule.value}
                        >
                          <Plus className="h-4 w-4" />
                          Add Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Members Tab --- */}
                {activeTab === "members" && (
                  <div className="space-y-4 h-full flex flex-col">
                    {!isAddingMember ? (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search staff..."
                              value={memberSearchQuery}
                              onChange={(e) =>
                                setMemberSearchQuery(e.target.value)
                              }
                              className="pl-9 h-9"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setIsAddingMember(true)}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add Member
                          </Button>
                        </div>

                        <div className="flex-1 border rounded-md overflow-hidden bg-white">
                          {filteredMembers.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">
                              {members.length === 0
                                ? "No members added yet."
                                : "No members match your search."}
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {filteredMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-900">
                                          {member.name}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] h-4 px-1 bg-gray-100 text-gray-600 border-0 font-normal"
                                        >
                                          {member.role}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs text-gray-400">
                                          {member.email}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                                        <span className="text-xs text-gray-400">
                                          {member.maxShiftsPerWeek} shifts/wk
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                    onClick={() =>
                                      handleDeleteMember(member.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4 border border-gray-200 p-4 rounded-lg bg-gray-50/50">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Add New Member
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              placeholder="e.g. Dr. Sarah Smith"
                              value={newMember.name || ""}
                              onChange={(e) =>
                                setNewMember({
                                  ...newMember,
                                  name: e.target.value,
                                })
                              }
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="sarah@hospital.com"
                              value={newMember.email || ""}
                              onChange={(e) =>
                                setNewMember({
                                  ...newMember,
                                  email: e.target.value,
                                })
                              }
                              className="bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              value={newMember.role}
                              onValueChange={(value) =>
                                setNewMember({ ...newMember, role: value })
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fte">Max Shifts / Week</Label>
                            <Input
                              id="fte"
                              type="number"
                              min="1"
                              max="14"
                              value={newMember.maxShiftsPerWeek}
                              onChange={(e) =>
                                setNewMember({
                                  ...newMember,
                                  maxShiftsPerWeek: parseInt(e.target.value),
                                })
                              }
                              className="bg-white"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleAddMember}
                            className="flex-1 bg-[#00C853] hover:bg-[#00b54b] text-white"
                          >
                            Add Member
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddingMember(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Shift Types Tab --- */}
                {activeTab === "shift-types" && (
                  <div className="space-y-4">
                    {!isAddingShift ? (
                      <>
                        <div className="flex justify-end mb-4">
                          <Button
                            onClick={() => setIsAddingShift(true)}
                            className="gap-2"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                            Add Shift Type
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {shiftTypes.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                              No shift types defined yet.
                            </p>
                          ) : (
                            <div className="grid gap-2">
                              {shiftTypes.map((type) => (
                                <div
                                  key={type.id}
                                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{ backgroundColor: type.color }}
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm text-gray-900">
                                          {type.code}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {type.startTime} - {type.endTime}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {type.name}
                                      </div>
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
                                    className="h-8 w-8 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                    onClick={() => handleDeleteShift(type.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4 border border-gray-200 p-4 rounded-lg bg-gray-50/50">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Add Shift Type
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                              id="code"
                              placeholder="e.g. D-AM"
                              value={newShift.code || ""}
                              onChange={(e) =>
                                setNewShift({
                                  ...newShift,
                                  code: e.target.value,
                                })
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
                                setNewShift({
                                  ...newShift,
                                  name: e.target.value,
                                })
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
                                  setNewShift({
                                    ...newShift,
                                    startTime: e.target.value,
                                  })
                                }
                                className="bg-white"
                              />
                              <span className="text-gray-400">-</span>
                              <Input
                                type="time"
                                value={newShift.endTime || ""}
                                onChange={(e) =>
                                  setNewShift({
                                    ...newShift,
                                    endTime: e.target.value,
                                  })
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
                                  setNewShift({
                                    ...newShift,
                                    color: e.target.value,
                                  })
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
                                  onClick={() => toggleShiftRole(role)}
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
                            onClick={handleAddShift}
                            className="flex-1 bg-[#00C853] hover:bg-[#00b54b] text-white"
                          >
                            Add Shift Type
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddingShift(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- Other Tabs --- */}
                {activeTab === "ai" && (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    AI preferences coming soon
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    Notification settings coming soon
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4 bg-white shrink-0 z-10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

