"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Send,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Check,
  Settings,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  MoreVertical,
  AlertTriangle,
  Users,
  Search,
  GripVertical,
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

import {
  RosterSettings,
  RosterSettingsDialog,
  ShiftType,
  Member,
} from "@/components/roster-settings-dialog";

import {
  RuleOverride,
  DraftOverridesDialog,
} from "@/components/draft-overrides-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RosterConsole, ConsoleProblem } from "@/components/roster-console";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

const INITIAL_ROSTER_SETTINGS: RosterSettings = {
  name: "Emergency Department - Q1 2025",
  startDate: "2025-01-01",
  endDate: "2025-03-31",
  durationType: "QUARTERLY",
  rules: [
    {
      id: "rule-1",
      type: "max_hours_week",
      label: "Max Hours per Week",
      value: 50,
      unit: "hours",
      severity: "error",
      scope: "all",
    },
    {
      id: "rule-2",
      type: "max_hours_fortnight",
      label: "Max Hours per Fortnight",
      value: 100,
      unit: "hours",
      severity: "error",
      scope: "all",
    },
    {
      id: "rule-3",
      type: "min_rest_hours",
      label: "Min Rest Between Shifts",
      value: 10,
      unit: "hours",
      severity: "warning",
      scope: "all",
    },
  ],
};

// Mock overrides per draft
const MOCK_DRAFT_OVERRIDES: Record<string, RuleOverride[]> = {
  "3": [
    {
      id: "override-1",
      ruleId: "rule-1",
      ruleName: "Max Hours per Week",
      staffId: "m1",
      staffName: "Dr. Sarah Connor",
      originalValue: 50,
      overrideValue: 55,
      unit: "hours",
      reason: "Short-staffed, approved by HOD",
      createdBy: "user",
    },
    {
      id: "override-2",
      ruleId: "rule-3",
      ruleName: "Min Rest Between Shifts",
      staffId: "m2",
      staffName: "Dr. Kyle Reese",
      originalValue: 10,
      overrideValue: 8,
      unit: "hours",
      reason: "Only way to achieve full coverage",
      createdBy: "ai",
    },
  ],
};

const MOCK_VARIANTS = [
  { id: "v1", name: "Week 1", dateRange: "Jan 1 - Jan 7", isActive: true },
  { id: "v2", name: "Week 2", dateRange: "Jan 8 - Jan 14", isActive: false },
  { id: "v3", name: "Week 3", dateRange: "Jan 15 - Jan 21", isActive: false },
  { id: "v4", name: "Week 4", dateRange: "Jan 22 - Jan 28", isActive: false },
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

const INITIAL_EVENTS: ResourceCalendarEvent[] = [
  {
    id: "e1",
    resourceId: "t1",
    title: "Sarah Connor",
    date: new Date(), // Today
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    hasWarning: true,
    warningMessage: "Exceeds max 50 hours/week (55 hours)",
  },
  {
    id: "e2",
    resourceId: "t2",
    title: "Kyle Reese",
    date: new Date(), // Today
    backgroundColor: "#10b981",
    textColor: "#ffffff",
    hasWarning: true,
    warningMessage: "Less than 10 hours rest between shifts (8 hours)",
  },
  {
    id: "e3",
    resourceId: "t1",
    title: "John Connor",
    date: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    })(),
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
  },
];

export default function RosterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.orgId as string;

  const [activeDraftId, setActiveDraftId] = useState<string>("3");
  const [rightSidebarTab, setRightSidebarTab] = useState<
    "chat" | "members" | null
  >(null);
  const [aiInput, setAiInput] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("v1");
  const [showRosterSettings, setShowRosterSettings] = useState(false);
  const [showDraftOverrides, setShowDraftOverrides] = useState(false);
  const [rosterSettings, setRosterSettings] = useState<RosterSettings>(
    INITIAL_ROSTER_SETTINGS
  );
  const [draftOverrides, setDraftOverrides] =
    useState<Record<string, RuleOverride[]>>(MOCK_DRAFT_OVERRIDES);
  const [shiftTypes, setShiftTypes] =
    useState<ShiftType[]>(INITIAL_SHIFT_TYPES);
  const [events, setEvents] = useState<ResourceCalendarEvent[]>(INITIAL_EVENTS);
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
    {
      id: "m3",
      name: "Dr. John Connor",
      email: "john@hospital.com",
      role: "Doctor",
      fte: 1.0,
      maxShiftsPerWeek: 5,
      tags: [],
    },
  ]);
  const [memberSearch, setMemberSearch] = useState("");
  const [consoleExpanded, setConsoleExpanded] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  // Convert shift types to calendar resources
  const calendarResources: ResourceCalendarResource[] = shiftTypes.map((t) => ({
    id: t.id,
    title: t.code,
    subtitle: `${t.startTime} - ${t.endTime}`,
    color: t.color,
  }));

  // Derive problems from events
  const problems: ConsoleProblem[] = events
    .filter((e) => e.hasWarning)
    .map((e) => ({
      id: `prob-${e.id}`,
      severity: "warning", // defaulting to warning as per mock data
      message: e.warningMessage || "Unknown warning",
      resource: calendarResources.find((r) => r.id === e.resourceId)?.title,
      date: e.date.toLocaleDateString(),
      source: "Rule Engine",
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

  // Cmd+I keyboard shortcut to toggle Sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setRightSidebarTab((prev) => (prev ? null : "chat"));
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

  const handleCellDrop = (
    e: React.DragEvent,
    date: Date,
    resourceId: string
  ) => {
    try {
      const memberData = JSON.parse(e.dataTransfer.getData("application/json"));
      if (!memberData || !memberData.id) return;

      const resource = calendarResources.find((r) => r.id === resourceId);

      const newEvent: ResourceCalendarEvent = {
        id: `e-${Date.now()}`,
        resourceId,
        title: memberData.name.split(" ").slice(-1)[0], // Last name or just name
        date: date,
        backgroundColor: resource?.color || "#3b82f6",
        textColor: "#ffffff",
      };

      setEvents((prev) => [...prev, newEvent]);
    } catch (err) {
      console.error("Failed to parse drop data", err);
    }
  };

  const handleEventDrop = (
    e: React.DragEvent,
    event: ResourceCalendarEvent,
    date: Date,
    resourceId: string
  ) => {
    // Remove the old event and create a new one at the new location
    setEvents((prev) => {
      const filtered = prev.filter((ev) => ev.id !== event.id);
      const resource = calendarResources.find((r) => r.id === resourceId);
      const newEvent: ResourceCalendarEvent = {
        ...event,
        id: event.id, // Keep the same ID
        resourceId,
        date: date,
        backgroundColor: resource?.color || event.backgroundColor,
      };
      return [...filtered, newEvent];
    });
  };

  const handlePublish = () => {
    if (confirm("Publish this roster? Staff will be notified.")) {
      alert("Roster published!");
    }
  };

  const handleDeleteRoster = () => {
    if (confirm("Delete this roster? This cannot be undone.")) {
      router.push(`/dashboard/${orgId}/rosters`);
    }
  };

  // Drag and Drop Handler
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    member: Member
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(member));
    e.dataTransfer.effectAllowed = "copy";
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

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
                onClick={() => setShowRosterSettings(true)}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
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
            </div>
          </div>
        </div>

        {/* Three-column layout: Draft History | Calendar | Right Sidebar */}
        <div
          className="flex-1 grid overflow-hidden min-h-0 transition-[grid-template-columns] duration-300"
          style={{
            gridTemplateColumns: rightSidebarTab
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
                  const overrides = draftOverrides[draft.id] || [];
                  const hasOverrides = overrides.length > 0;

                  return (
                    <div
                      key={draft.id}
                      className={cn(
                        "w-full p-2 rounded-md transition-all group relative",
                        isActive
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-transparent hover:bg-gray-50 hover:border-gray-200"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r" />
                      )}

                      <div
                        onClick={() => setActiveDraftId(draft.id)}
                        className="cursor-pointer"
                      >
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
                            {hasOverrides && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertTriangle className="h-2.5 w-2.5 text-yellow-600" />
                                <span className="text-xs text-yellow-700 font-medium">
                                  {overrides.length} override
                                  {overrides.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Active Badge */}
                          <div className="flex items-center gap-2 shrink-0">
                            {isActive && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1.5 py-0 leading-none tracking-wide uppercase bg-blue-100 text-blue-600 border-0"
                              >
                                Active
                              </Badge>
                            )}

                            {/* Menu Toggle - Always visible */}
                            <div className="relative h-5 w-5 flex items-center justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDraftId(draft.id);
                                      setShowDraftOverrides(true);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Settings className="h-3.5 w-3.5 mr-2" />
                                    Draft Overrides
                                    {hasOverrides && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto text-xs bg-yellow-50 text-yellow-700"
                                      >
                                        {overrides.length}
                                      </Badge>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert("Rename draft coming soon!");
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 mr-2" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        confirm(
                                          `Delete draft "${draft.name}"? This cannot be undone.`
                                        )
                                      ) {
                                        alert("Delete draft coming soon!");
                                      }
                                    }}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                events={events}
                view="week"
                onEventClick={handleEventClick}
                onCellClick={handleCellClick}
                onCellDrop={handleCellDrop}
                onEventDrop={handleEventDrop}
              />
            </div>
          </div>

          <RosterSettingsDialog
            open={showRosterSettings}
            onOpenChange={setShowRosterSettings}
            settings={rosterSettings}
            onUpdate={setRosterSettings}
            shiftTypes={shiftTypes}
            onUpdateShiftTypes={setShiftTypes}
            members={members}
            onUpdateMembers={setMembers}
            onDeleteRoster={handleDeleteRoster}
          />

          <DraftOverridesDialog
            open={showDraftOverrides}
            onOpenChange={setShowDraftOverrides}
            draftName={
              MOCK_DRAFTS.find((d) => d.id === activeDraftId)?.name || "Draft"
            }
            rosterRules={rosterSettings.rules}
            overrides={draftOverrides[activeDraftId] || []}
            members={members}
            onUpdate={(newOverrides) => {
              setDraftOverrides({
                ...draftOverrides,
                [activeDraftId]: newOverrides,
              });
            }}
          />

          {/* Right Sidebar - Tabs & Content */}
          {rightSidebarTab && (
            <div className="w-80 border-l border-gray-200 bg-white flex flex-col min-h-0 shadow-sm z-10">
              {/* Sidebar Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setRightSidebarTab("chat")}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-medium text-center transition-colors border-b-2",
                    rightSidebarTab === "chat"
                      ? "border-purple-600 text-purple-600 bg-purple-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Assistant
                  </div>
                </button>
                <button
                  onClick={() => setRightSidebarTab("members")}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-medium text-center transition-colors border-b-2",
                    rightSidebarTab === "members"
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Members
                  </div>
                </button>
                <button
                  onClick={() => setRightSidebarTab(null)}
                  className="px-2.5 border-l border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Content */}
              {rightSidebarTab === "chat" && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      {/* Welcome Message */}
                      <div className="flex gap-3">
                        <div className="shrink-0 h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            AI Assistant
                          </p>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Hi! I can help you modify your roster. Try
                              commands like:
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
                      to toggle
                    </p>
                  </div>
                </div>
              )}

              {/* Members Content */}
              {rightSidebarTab === "members" && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        placeholder="Filter members..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="pl-8 h-8 text-xs bg-white"
                      />
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                      {filteredMembers.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-500">
                          No members found
                        </div>
                      ) : (
                        filteredMembers.map((member) => {
                          const isExpanded = expandedMembers.has(member.id);
                          // Mock shift preferences - in real app this would come from member data
                          const shiftPreferences = [
                            { day: "Monday", preference: "preferred" },
                            { day: "Tuesday", preference: "preferred" },
                            { day: "Wednesday", preference: "avoid" },
                            { day: "Thursday", preference: "neutral" },
                            { day: "Friday", preference: "preferred" },
                            { day: "Saturday", preference: "avoid" },
                            { day: "Sunday", preference: "avoid" },
                          ];

                          return (
                            <Collapsible
                              key={member.id}
                              open={isExpanded}
                              onOpenChange={(open) => {
                                setExpandedMembers((prev) => {
                                  const next = new Set(prev);
                                  if (open) {
                                    next.add(member.id);
                                  } else {
                                    next.delete(member.id);
                                  }
                                  return next;
                                });
                              }}
                            >
                              <div className="bg-white border border-transparent hover:border-gray-200 rounded-md transition-all">
                                <div
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, member)}
                                  className="group flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-all"
                                >
                                  <GripVertical className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-xs font-medium text-gray-900 truncate">
                                        {member.name}
                                      </span>
                                      <Badge
                                        variant="secondary"
                                        className="text-[10px] h-4 px-1 py-0 bg-gray-100 text-gray-500 border-0 font-normal"
                                      >
                                        {member.role}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-blue-500 rounded-full"
                                          style={{
                                            width: `${(Math.random() * 100).toFixed(0)}%`,
                                          }} // Mock progress
                                        />
                                      </div>
                                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                        3/5 shifts
                                      </span>
                                    </div>
                                  </div>
                                  <CollapsibleTrigger asChild>
                                    <button
                                      onClick={(e) => e.stopPropagation()}
                                      className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                      <ChevronDown
                                        className={cn(
                                          "h-3.5 w-3.5 text-gray-400 transition-transform",
                                          isExpanded && "transform rotate-180"
                                        )}
                                      />
                                    </button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent>
                                  <div className="px-2 pb-2 pt-1 border-t border-gray-100">
                                    <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                      Shift Preferences
                                    </div>
                                    <div className="space-y-1">
                                      {shiftPreferences.map((pref) => (
                                        <div
                                          key={pref.day}
                                          className="flex items-center justify-between text-xs"
                                        >
                                          <span className="text-gray-600">
                                            {pref.day}
                                          </span>
                                          <Badge
                                            variant="secondary"
                                            className={cn(
                                              "text-[10px] h-4 px-1.5 border-0",
                                              pref.preference === "preferred" &&
                                                "bg-green-100 text-green-700",
                                              pref.preference === "avoid" &&
                                                "bg-red-100 text-red-700",
                                              pref.preference === "neutral" &&
                                                "bg-gray-100 text-gray-600"
                                            )}
                                          >
                                            {pref.preference === "preferred"
                                              ? "Preferred"
                                              : pref.preference === "avoid"
                                                ? "Avoid"
                                                : "Neutral"}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-[10px] text-gray-500 text-center">
                      Drag names onto the calendar to assign
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <RosterConsole
          problems={problems}
          isExpanded={consoleExpanded}
          onToggleExpand={() => setConsoleExpanded(!consoleExpanded)}
        />
      </div>
    </div>
  );
}
