"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, UserPlus, Trash2, Clipboard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NewMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  isAdmin: boolean;
}

// Mock existing staff
const EXISTING_STAFF = [
  {
    id: "staff-1",
    user: { firstName: "Sarah", lastName: "Connor", email: "sarah@example.com" },
    position: "NURSE_PRACTITIONER",
  },
  {
    id: "staff-2",
    user: { firstName: "Kyle", lastName: "Reese", email: "kyle@example.com" },
    position: "DOCTOR",
  },
];

export default function NewRosterPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.orgId as string;

  const [rosterName, setRosterName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [newMembers, setNewMembers] = useState<NewMember[]>([]);

  const [selectedStaff, setSelectedStaff] = useState<
    Record<string, { selected: boolean; isAdmin: boolean }>
  >({});

  // Parse pasted text into members
  const handleParsePaste = () => {
    const lines = pasteText.trim().split("\n");
    const parsed: NewMember[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      // Simple CSV parsing: Name, Email, Phone
      const parts = line.split(",").map((p) => p.trim());
      
      if (parts.length >= 2) {
        // Simplified parsing logic for demo
        const [name, email, phone] = parts;
        const [firstName, ...lastNameParts] = name.split(" ");
        const lastName = lastNameParts.join(" ");

        if (firstName && email) {
          parsed.push({
            id: Math.random().toString(36).substring(7),
            firstName,
            lastName: lastName || "",
            email,
            phone: phone || "",
            position: "DOCTOR",
            isAdmin: false,
          });
        }
      }
    }

    if (parsed.length > 0) {
      setNewMembers([...newMembers, ...parsed]);
      setPasteText("");
      setPasteMode(false);
      alert(`Parsed ${parsed.length} member(s)`);
    } else {
      alert("Could not parse any members from the text");
    }
  };

  const addEmptyMember = () => {
    setNewMembers([
      ...newMembers,
      {
        id: Math.random().toString(36).substring(7),
        firstName: "",
        lastName: "",
        email: "",
        phone: "+61",
        position: "DOCTOR",
        isAdmin: false,
      },
    ]);
  };

  const updateNewMember = (id: string, field: keyof NewMember, value: any) => {
    setNewMembers(
      newMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeNewMember = (id: string) => {
    setNewMembers(newMembers.filter((m) => m.id !== id));
  };

  const toggleExistingStaff = (staffId: string) => {
    setSelectedStaff({
      ...selectedStaff,
      [staffId]: {
        selected: !selectedStaff[staffId]?.selected,
        isAdmin: selectedStaff[staffId]?.isAdmin || false,
      },
    });
  };

  const toggleStaffAdmin = (staffId: string) => {
    if (selectedStaff[staffId]?.selected) {
      setSelectedStaff({
        ...selectedStaff,
        [staffId]: {
          ...selectedStaff[staffId],
          isAdmin: !selectedStaff[staffId]?.isAdmin,
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rosterName || !startDate) {
      alert("Please fill in roster name and start date");
      return;
    }

    // Mock creation
    console.log("Creating roster:", { rosterName, startDate, selectedStaff, newMembers });
    alert("Roster created successfully! (Mock)");
    
    // Navigate to the roster detail (mock ID)
    router.push(`/dashboard/${orgId}/rosters/new-roster-123`);
  };

  const selectedCount =
    Object.values(selectedStaff).filter((s) => s.selected).length +
    newMembers.filter((m) => m.firstName && m.lastName && m.email).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/${orgId}/rosters`}>
            <Button variant="ghost" size="icon" className="shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-200">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Roster
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Set up a recurring roster and add team members
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Roster Details */}
            <Card className="p-6 bg-white border-gray-200 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Roster Details
                  </h2>
                  <div className="space-y-4">
                    {/* Roster Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Roster Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        placeholder="e.g., Emergency Department - Q1 2025"
                        value={rosterName}
                        onChange={(e) => setRosterName(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Recurring roster - no end date required
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Panel - Team Members */}
            <Card className="p-6 bg-white border-gray-200 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Team Members
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {selectedCount} member{selectedCount !== 1 ? "s" : ""}{" "}
                      selected
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPasteMode(!pasteMode)}
                      className={cn(
                        "gap-2 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                        pasteMode && "bg-gray-100 border-gray-400"
                      )}
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                      Quick Paste
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEmptyMember}
                      className="gap-2 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add New
                    </Button>
                  </div>
                </div>

                {/* Quick Paste Mode */}
                {pasteMode && (
                  <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <label className="text-gray-900 text-sm font-medium">
                        Paste member details (one per line)
                      </label>
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        Format: Name, email, phone
                        <br />
                        Example: John Doe, john@example.com, 0400 000 000
                      </p>
                      <Textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder="John Doe, john@example.com, 0400123456"
                        className="bg-white border-gray-300 text-gray-900 font-mono text-sm min-h-24 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleParsePaste}
                        disabled={!pasteText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Parse & Add
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPasteMode(false);
                          setPasteText("");
                        }}
                        className="text-gray-500 hover:text-gray-900"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <Separator className="bg-gray-200" />

                {/* Scrollable Members List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Existing Staff Members */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Existing Staff
                    </p>
                    {EXISTING_STAFF.map((staff: any) => (
                      <div
                        key={staff.id}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStaff[staff.id]?.selected || false}
                          onChange={() => toggleExistingStaff(staff.id)}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {staff.user.firstName} {staff.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {staff.user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`admin-${staff.id}`}
                            className="text-xs text-gray-500 cursor-pointer hover:text-gray-700"
                          >
                            Admin
                          </label>
                          <input
                            type="checkbox"
                            id={`admin-${staff.id}`}
                            checked={selectedStaff[staff.id]?.isAdmin || false}
                            onChange={() => toggleStaffAdmin(staff.id)}
                            disabled={!selectedStaff[staff.id]?.selected}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* New Members Being Added */}
                  {newMembers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        New Members
                      </p>
                      {newMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-blue-700">
                              New Member
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNewMember(member.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="First name"
                              value={member.firstName}
                              onChange={(e) =>
                                updateNewMember(
                                  member.id,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              className="bg-white border-gray-300 text-gray-900 text-sm h-8 focus:border-green-500 focus:ring-green-500"
                            />
                            <Input
                              placeholder="Last name"
                              value={member.lastName}
                              onChange={(e) =>
                                updateNewMember(
                                  member.id,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              className="bg-white border-gray-300 text-gray-900 text-sm h-8 focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={member.email}
                            onChange={(e) =>
                              updateNewMember(
                                member.id,
                                "email",
                                e.target.value
                              )
                            }
                            className="bg-white border-gray-300 text-gray-900 text-sm h-8 focus:border-green-500 focus:ring-green-500"
                          />
                          <Input
                            placeholder="+61 400 000 000"
                            value={member.phone}
                            onChange={(e) =>
                              updateNewMember(member.id, "phone", e.target.value)
                            }
                            className="bg-white border-gray-300 text-gray-900 text-sm h-8 focus:border-green-500 focus:ring-green-500"
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={member.position}
                              onChange={(e) =>
                                updateNewMember(member.id, "position", e.target.value)
                              }
                              className="flex h-8 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="DOCTOR">Doctor</option>
                              <option value="NURSE">Nurse</option>
                              <option value="NURSE_PRACTITIONER">
                                Nurse Practitioner
                              </option>
                              <option value="PHYSICIAN_ASSISTANT">
                                Physician Assistant
                              </option>
                              <option value="PARAMEDIC">
                                Paramedic
                              </option>
                              <option value="EMT">EMT</option>
                              <option value="OTHER">Other</option>
                            </select>
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`new-admin-${member.id}`}
                                className="text-xs text-gray-500 whitespace-nowrap cursor-pointer hover:text-gray-700"
                              >
                                Admin
                              </label>
                              <input
                                type="checkbox"
                                id={`new-admin-${member.id}`}
                                checked={member.isAdmin}
                                onChange={(e) =>
                                  updateNewMember(
                                    member.id,
                                    "isAdmin",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {EXISTING_STAFF.length === 0 && newMembers.length === 0 && (
                    <div className="text-center py-8">
                      <UserPlus className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        No members added yet
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click "Add New" or "Quick Paste" to add team members
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              className="min-w-32 bg-[#00C853] hover:bg-[#00b54b] text-white"
            >
              Create Roster
            </Button>
            <Link href={`/dashboard/${orgId}/rosters`}>
              <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

