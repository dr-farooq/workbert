"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Send,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Check,
  Settings2,
  Users,
  Zap,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResourceCalendar,
  ResourceCalendarEvent,
  ResourceCalendarResource,
} from "@/components/resource-calendar";

import { ShiftType, ShiftTypesDialog } from "@/components/shift-types-dialog";

import { Member, MembersDialog } from "@/components/members-dialog";

// Mock Data
const MOCK_DRAFTS = [
  {
    id: "1",
    name: "Initial Draft",
    createdAt: new Date(2025, 0, 10, 14, 30),
    isActive: false,
  },
  {
    id: "2",
    name: "After constraint edits",
    createdAt: new Date(2025, 0, 12, 9, 15),
    isActive: false,
  },
  {
    id: "3",
    name: "Current version",
    createdAt: new Date(2025, 0, 15, 16, 45),
    isActive: true,
  },
];

const MOCK_ROSTER = {
  id: "123",
  name: "Emergency Department - Q1 2025",
  status: "DRAFT",
  startDate: "2025-01-01",
  endDate: "2025-03-31",
  durationType: "QUARTERLY",
};

const MOCK_VARIANTS = [
  { id: "v1", name: "Week 1", dateRange: "Jan 1 - Jan 7", isActive: true },
  { id: "v2", name: "Week 2", dateRange: "Jan 8 - Jan 14", isActive: false },
  { id: "v3", name: "Week 3", dateRange: "Jan 15 - Jan 21", isActive: false },
  { id: "v4", name: "Week 4", dateRange: "Jan 22 - Jan 28", isActive: false },
];

const MOCK_RESOURCES: ResourceCalendarResource[] = [
  { id: "t1", title: "D-AM", subtitle: "07:00 - 15:00", color: "#3b82f6" },
  { id: "t2", title: "D-PM", subtitle: "14:00 - 22:00", color: "#10b981" },
  { id: "t3", title: "D-ND", subtitle: "21:00 - 08:00", color: "#8b5cf6" },
];

const INITIAL_SHIFT_TYPES: ShiftType[] = [
  {
    id: "t1",
    code: "D-AM",
    name: "Day Morning",
    color: "#3b82f6",
    startTime: "07:00",
    endTime: "15:00",
    allowedRoles: ["Doctor", "Registrar"],
  },
  {
    id: "t2",
    code: "D-PM",
    name: "Day Afternoon",
    color: "#10b981",
    startTime: "14:00",
    endTime: "22:00",
    allowedRoles: ["Doctor", "Registrar"],
  },
  {
    id: "t3",
    code: "D-ND",
    name: "Day Night",
    color: "#8b5cf6",
    startTime: "21:00",
    endTime: "08:00",
    allowedRoles: ["Doctor"],
  },
];

const MOCK_EVENTS: ResourceCalendarEvent[] = [
  {
    id: "e1",
    resourceId: "t1",
    title: "Sarah Connor",
    date: new Date(), // Today
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
  },
  {
    id: "e2",
    resourceId: "t2",
    title: "Kyle Reese",
    date: new Date(), // Today
    backgroundColor: "#10b981",
    textColor: "#ffffff",
  },
];

export default function RosterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.orgId as string;

  const [activeDraftId, setActiveDraftId] = useState<string>("3");
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("v1");
  const [showShiftTypes, setShowShiftTypes] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [shiftTypes, setShiftTypes] =
    useState<ShiftType[]>(INITIAL_SHIFT_TYPES);
  const [members, setMembers] = useState<Member[]>([
    {
      id: "m1",
      name: "Dr. Sarah Connor",
      email: "sarah@hospital.com",
      role: "Doctor",
      fte: 1.0,
      maxShiftsPerWeek: 5,
      tags: ["No Nights"],
    },
    {
      id: "m2",
      name: "Dr. Kyle Reese",
      email: "kyle@hospital.com",
      role: "Registrar",
      fte: 0.8,
      maxShiftsPerWeek: 4,
      tags: [],
    },
  ]);

  // Convert shift types to calendar resources
  const calendarResources: ResourceCalendarResource[] = shiftTypes.map((t) => ({
    id: t.id,
    title: t.code,
    subtitle: `${t.startTime} - ${t.endTime}`,
    color: t.color,
  }));

  const currentVariant = MOCK_VARIANTS.find((v) => v.id === selectedVariantId);
  const currentIndex = MOCK_VARIANTS.findIndex(
    (v) => v.id === selectedVariantId
  );

  const handlePrevVariant = () => {
    if (currentIndex > 0) {
      setSelectedVariantId(MOCK_VARIANTS[currentIndex - 1].id);
    }
  };

  const handleNextVariant = () => {
    if (currentIndex < MOCK_VARIANTS.length - 1) {
      setSelectedVariantId(MOCK_VARIANTS[currentIndex + 1].id);
    }
  };

  // Cmd+I keyboard shortcut to toggle AI chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setShowAiChat((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEventClick = (event: ResourceCalendarEvent) => {
    alert(`Clicked event: ${event.title}`);
  };

  const handleCellClick = (date: Date, resourceId: string) => {
    alert(
      `Clicked cell for resource ${resourceId} on ${date.toLocaleDateString()}`
    );
  };

  const handlePublish = () => {
    if (confirm("Publish this roster? Staff will be notified.")) {
      alert("Roster published!");
    }
  };

  const handleDelete = () => {
    if (confirm("Delete this roster? This cannot be undone.")) {
      router.push(`/dashboard/${orgId}/rosters`);
    }
  };

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 text-gray-900">
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="shrink-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/${orgId}/rosters`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-semibold text-gray-900">
                      {MOCK_ROSTER.name}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      {MOCK_ROSTER.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {MOCK_ROSTER.durationType} • {MOCK_ROSTER.startDate}
                  </p>
                </div>

                {/* Period Navigator */}
                <div className="flex items-center gap-1 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center bg-white rounded-md border border-gray-200 shadow-sm h-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full w-8 rounded-l-md rounded-r-none border-r border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      onClick={handlePrevVariant}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-full px-3 flex items-center gap-2 hover:bg-gray-50 transition-colors focus:outline-none">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <div className="flex flex-col items-start justify-center leading-none">
                            <span className="text-xs font-medium text-gray-900">
                              {currentVariant?.name}
                            </span>
                          </div>
                          <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-48">
                        {MOCK_VARIANTS.map((variant) => (
                          <DropdownMenuItem
                            key={variant.id}
                            onClick={() => setSelectedVariantId(variant.id)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {variant.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {variant.dateRange}
                              </span>
                            </div>
                            {variant.id === selectedVariantId && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full w-8 rounded-r-md rounded-l-none border-l border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      onClick={handleNextVariant}
                      disabled={currentIndex === MOCK_VARIANTS.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="ml-2 text-xs text-gray-500">
                    {currentVariant?.dateRange}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setShowMembers(true)}
              >
                <Users className="h-3.5 w-3.5" />
                Members
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setShowShiftTypes(true)}
              >
                <Settings2 className="h-3.5 w-3.5" />
                Shift Types
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <Button
                size="sm"
                className="gap-1.5 h-8 bg-[#00C853] hover:bg-[#00b54b] text-white"
                onClick={handlePublish}
              >
                <Send className="h-3.5 w-3.5" />
                Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Three-column layout: Draft History | Calendar | AI Chat */}
        <div
          className="flex-1 grid overflow-hidden min-h-0 transition-[grid-template-columns] duration-300"
          style={{
            gridTemplateColumns: showAiChat
              ? "14rem minmax(0, 1fr) 20rem"
              : "14rem minmax(0, 1fr)",
          }}
        >
          {/* Draft History - Left Sidebar */}
          <div className="border-r border-gray-200 bg-white flex flex-col">
            <div className="px-3 py-2.5 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare className="h-3 w-3 text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Drafts
                </h3>
              </div>
              <p className="text-xs text-gray-500">Version history</p>
            </div>

            <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                {MOCK_DRAFTS.map((draft, index) => {
                  const isActive = draft.id === activeDraftId;
                  const daysDiff = Math.floor(
                    (new Date().getTime() - draft.createdAt.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <button
                      key={draft.id}
                      onClick={() => setActiveDraftId(draft.id)}
                      className={cn(
                        "w-full p-2 rounded-md text-left transition-all group relative",
                        isActive
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-transparent hover:bg-gray-50 hover:border-gray-200"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r" />
                      )}

                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p
                              className={cn(
                                "text-xs font-medium truncate",
                                isActive ? "text-blue-700" : "text-gray-900"
                              )}
                            >
                              {draft.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-2.5 w-2.5" />
                            <span className="text-xs">
                              {daysDiff === 0
                                ? "Today"
                                : daysDiff === 1
                                  ? "Yesterday"
                                  : `${daysDiff}d ago`}
                            </span>
                          </div>
                        </div>

                        {/* Draft number badge */}
                        <div
                          className={cn(
                            "shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold",
                            isActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          )}
                        >
                          {MOCK_DRAFTS.length - index}
                        </div>
                      </div>

                      {isActive && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 text-[10px] h-4 px-1.5 py-0 leading-none tracking-wide uppercase bg-blue-100 text-blue-600 border-0"
                        >
                          Active
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* New Draft Button */}
            <div className="p-2 border-t border-gray-200 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 h-8 text-xs border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => alert("New draft creation coming soon!")}
              >
                <PlusCircle className="h-3 w-3" />
                <span>New Draft</span>
              </Button>
            </div>
          </div>

          {/* Calendar - Center */}
          <div className="overflow-hidden flex flex-col min-w-0 min-h-0 bg-gray-50">
            <div className="flex-1 min-h-0 p-4 overflow-hidden">
              <ResourceCalendar
                resources={calendarResources}
                events={MOCK_EVENTS}
                view="week"
                onEventClick={handleEventClick}
                onCellClick={handleCellClick}
              />
            </div>
          </div>

          <ShiftTypesDialog
            open={showShiftTypes}
            onOpenChange={setShowShiftTypes}
            shiftTypes={shiftTypes}
            onUpdate={setShiftTypes}
          />

          <MembersDialog
            open={showMembers}
            onOpenChange={setShowMembers}
            members={members}
            onUpdate={setMembers}
          />

          {/* AI Chat - Right Sidebar */}
          {showAiChat && (
            <div className="w-80 border-l border-gray-200 bg-white flex flex-col min-h-0">
              <div className="px-3 py-2.5 border-b border-gray-200 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                      AI Assistant
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-gray-400 hover:text-gray-900"
                    onClick={() => setShowAiChat(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Natural language edits</p>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {/* Welcome Message */}
                  <div className="flex gap-3">
                    <div className="shrink-0 h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">AI Assistant</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Hi! I can help you modify your roster. Try commands
                          like:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-gray-500">
                          <li>• "Assign John to night shifts next week"</li>
                          <li>• "Add a day shift on Monday"</li>
                          <li>• "Check for scheduling conflicts"</li>
                          <li>• "Remove all shifts on the 15th"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-200 shrink-0">
                <div className="relative">
                  <Input
                    placeholder="Ask AI to modify roster..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        alert("AI integration coming soon!");
                        setAiInput("");
                      }
                    }}
                    className="bg-white border-gray-300 text-xs h-8 pr-9 text-gray-900 placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Button
                    size="sm"
                    className="absolute right-0.5 top-0.5 h-7 w-7 p-0 bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                    onClick={() => {
                      alert("AI integration coming soon!");
                      setAiInput("");
                    }}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 text-center">
                  <kbd className="px-1 py-0.5 text-xs rounded bg-gray-100 text-gray-600 border border-gray-200 font-sans">
                    Enter
                  </kbd>{" "}
                  to send •{" "}
                  <kbd className="px-1 py-0.5 text-xs rounded bg-gray-100 text-gray-600 border border-gray-200 font-sans">
                    ⌘I
                  </kbd>{" "}
                  to close
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
