"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Upload,
  Trash2,
  AlertCircle,
  Search,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Calendar,
  UserCircle2,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MEDICAL_POSITIONS = [
  "DOCTOR",
  "NURSE",
  "NURSE_PRACTITIONER",
  "PHYSICIAN_ASSISTANT",
  "MEDICAL_ASSISTANT",
  "PARAMEDIC",
  "EMT",
  "TECHNICIAN",
  "OTHER",
];

// Mock Data
const MOCK_MEMBERS = [
  {
    id: "1",
    user: { firstName: "Sarah", lastName: "Jenkins", email: "sarah.j@example.com", emailVerified: true },
    position: "NURSE",
    rosterPhone: "0400 123 456",
    rosterStartDate: "2024-01-15",
  },
  {
    id: "2",
    user: { firstName: "Mike", lastName: "Thompson", email: "mike.t@example.com", emailVerified: true },
    position: "DOCTOR",
    rosterPhone: "0400 987 654",
    rosterStartDate: "2023-11-01",
  },
  {
    id: "3",
    user: { firstName: "Emma", lastName: "Wilson", email: "emma.w@example.com", emailVerified: false },
    position: "PARAMEDIC",
    rosterPhone: "0400 555 555",
    rosterStartDate: "2024-02-20",
  },
];

type ViewMode = "list" | "grid";

export default function UsersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(MOCK_MEMBERS);

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!searchQuery.trim()) return members;

    const query = searchQuery.toLowerCase();
    return members.filter(
      (member: any) =>
        `${member.user.firstName} ${member.user.lastName}`.toLowerCase().includes(query) ||
        member.user.email.toLowerCase().includes(query) ||
        member.position?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const handleBulkSubmit = () => {
    toast.info("Bulk add functionality will be connected to backend");
    setShowBulkInput(false);
    setBulkText("");
  };

  const handleDelete = (id: string) => {
     toast.info(`Deleting member ${id}`);
     setMembers(members.filter(m => m.id !== id));
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title + Search */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <h1 className="text-xl font-semibold text-foreground whitespace-nowrap">
                Members
              </h1>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-muted/50 border-input focus:border-primary text-sm"
                />
              </div>
            </div>

            {/* Right: View Toggle + Add Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-input rounded-md bg-muted/50">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-l-md transition-colors",
                    viewMode === "list"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
                <div className="w-[1px] h-4 bg-border" />
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-r-md transition-colors",
                    viewMode === "grid"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              <Button
                size="sm"
                className="gap-2 h-9 bg-[#00C853] hover:bg-[#00b54b] text-white"
                onClick={() => setShowBulkInput(!showBulkInput)}
              >
                <PlusCircle className="h-4 w-4" />
                Add Members
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        {/* Bulk Input */}
        {showBulkInput && (
          <Card className="p-5 bg-muted/30 border-border mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-0.5">Bulk Paste Format</p>
                  <p className="text-xs text-blue-600/80">
                    Paste one member per line in this format:
                  </p>
                  <code className="text-xs bg-white px-2 py-0.5 rounded mt-1.5 block border border-blue-200">
                    Name, Position, Email, Phone, StartDate, EndDate, Hours
                  </code>
                  <p className="text-xs text-blue-600/80 mt-1.5">
                    Example: John Doe, DOCTOR, john@example.com, 0412345678,
                    2025-01-01, 2025-12-31, 38
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="Paste member data here..."
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="bg-background border-input min-h-40 font-mono text-xs"
              />

              <div className="flex gap-2.5">
                <Button
                  size="sm"
                  onClick={handleBulkSubmit}
                  disabled={!bulkText}
                  className="text-xs bg-[#00C853] hover:bg-[#00b54b] text-white"
                >
                  Add Members
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowBulkInput(false);
                    setBulkText("");
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32 ml-auto" />
                <Skeleton className="h-5 w-28" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && members.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No roster members yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Add staff members to include them in roster scheduling
            </p>
            <Button
              className="gap-2 bg-[#00C853] hover:bg-[#00b54b] text-white"
              onClick={() => setShowBulkInput(true)}
            >
              <Upload className="h-4 w-4" />
              Add Your First Members
            </Button>
          </div>
        )}

        {/* List View */}
        {!isLoading && filteredMembers.length > 0 && viewMode === "list" && (
          <div className="space-y-2">
            {filteredMembers.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all group"
              >
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                  <UserCircle2 className="h-6 w-6" />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#313578] transition-colors truncate">
                    {member.user.firstName} {member.user.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {member.position || "No position set"}
                  </p>
                </div>

                {/* Email */}
                <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 min-w-[200px]">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{member.user.email}</span>
                </div>

                {/* Phone */}
                <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 min-w-[130px]">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{member.rosterPhone || "-"}</span>
                </div>

                {/* Status */}
                <Badge
                  variant={member.user.emailVerified ? "default" : "secondary"}
                  className="text-xs min-w-[80px] justify-center"
                >
                  {member.user.emailVerified ? "Verified" : "Pending"}
                </Badge>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(member.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Grid View */}
        {!isLoading && filteredMembers.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member: any) => (
              <div
                key={member.id}
                className="p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                        <UserCircle2 className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#313578] transition-colors line-clamp-1">
                          {member.user.firstName} {member.user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {member.position || "No position"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{member.user.email}</span>
                    </div>
                    {member.rosterPhone && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{member.rosterPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
