import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, User, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock roles consistent with Shift Types
const ROLES = [
  "Doctor",
  "Nurse",
  "Registrar",
  "Consultant",
  "Intern",
  "Admin",
];

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  fte: number; // Full Time Equivalent (0.1 - 1.0)
  maxShiftsPerWeek: number;
  tags: string[]; // e.g. "No Nights", "Prefer Mon/Tue"
}

interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  onUpdate: (members: Member[]) => void;
}

export function MembersDialog({
  open,
  onOpenChange,
  members,
  onUpdate,
}: MembersDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMember, setNewMember] = useState<Partial<Member>>({
    role: "Doctor",
    fte: 1.0,
    maxShiftsPerWeek: 5,
    tags: [],
  });

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
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

    onUpdate([...members, member]);
    setIsAdding(false);
    setNewMember({ role: "Doctor", fte: 1.0, maxShiftsPerWeek: 5, tags: [] });
  };

  const handleDelete = (id: string) => {
    onUpdate(members.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white text-gray-900 border-gray-200 p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 border-b border-gray-100 pb-4">
          <DialogTitle>Manage Roster Members</DialogTitle>
          <DialogDescription>
            Staff available for this roster period.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* List View */}
          {!isAdding && (
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-100 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {filteredMembers.length === 0 && (
                    <div className="text-center py-12 text-gray-500 text-sm">
                      {members.length === 0
                        ? "No members added yet."
                        : "No members match your search."}
                    </div>
                  )}
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-100 transition-all"
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
                              className="text-[10px] h-4 px-1 bg-gray-100 text-gray-600 hover:bg-gray-200 border-0 font-normal"
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
                        className="h-8 w-8 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Add Form */}
          {isAdding && (
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Dr. Sarah Smith"
                    value={newMember.name || ""}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
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
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember({ ...newMember, role: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
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

              <div className="pt-4 flex gap-2">
                <Button
                  onClick={handleAdd}
                  className="flex-1 bg-[#00C853] hover:bg-[#00b54b] text-white"
                >
                  Add Member
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

        <DialogFooter className="p-4 border-t border-gray-100 bg-gray-50/50 sm:justify-between items-center">
            <div className="text-xs text-gray-500">
                {members.length} total members
            </div>
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

