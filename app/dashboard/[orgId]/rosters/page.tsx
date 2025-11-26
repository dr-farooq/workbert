"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  Calendar,
  Users,
  Clock,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "grid";

// Mock Data
const MOCK_ROSTERS = [
  {
    id: "1",
    name: "Emergency Ward - Week 42",
    status: "PUBLISHED",
    startDate: "2024-10-14",
    endDate: "2024-10-20",
    durationType: "WEEKLY",
    shiftCount: 42,
    instructions: "Standard rotation. Note public holiday on Monday.",
  },
  {
    id: "2",
    name: "ICU Staffing - October",
    status: "DRAFT",
    startDate: "2024-10-01",
    endDate: "2024-10-31",
    durationType: "MONTHLY",
    shiftCount: 156,
    instructions: "Drafting phase. Please confirm availability.",
  },
  {
    id: "3",
    name: "Pediatrics - Weekend",
    status: "ARCHIVED",
    startDate: "2024-10-12",
    endDate: "2024-10-13",
    durationType: "CUSTOM",
    shiftCount: 12,
    instructions: "",
  },
];

export default function RostersPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params?.orgId as string;
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rosters, setRosters] = useState(MOCK_ROSTERS);

  // Filter rosters based on search
  const filteredRosters = useMemo(() => {
    if (!rosters) return [];
    if (!searchQuery.trim()) return rosters;

    const query = searchQuery.toLowerCase();
    return rosters.filter(
      (roster: any) =>
        roster.name.toLowerCase().includes(query) ||
        roster.status.toLowerCase().includes(query) ||
        roster.instructions?.toLowerCase().includes(query)
    );
  }, [rosters, searchQuery]);

  const handleRosterClick = (rosterId: string) => {
    router.push(`/dashboard/${orgId}/rosters/${rosterId}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title + Search */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <h1 className="text-xl font-semibold text-foreground whitespace-nowrap">
                Rosters
              </h1>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rosters..."
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

              <Link href={`/dashboard/${orgId}/rosters/new`}>
              <Button size="sm" className="gap-2 h-9 bg-[#00C853] hover:bg-[#00b54b] text-white">
                <PlusCircle className="h-4 w-4" />
                New Roster
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-32 ml-auto" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && rosters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rosters created yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Create your first roster to start scheduling shifts for your team
            </p>
            <Link href={`/dashboard/${orgId}/rosters/new`}>
            <Button className="gap-2 bg-[#00C853] hover:bg-[#00b54b] text-white">
              <PlusCircle className="h-4 w-4" />
              Create Your First Roster
            </Button>
            </Link>
          </div>
        )}

        {/* List View */}
        {!isLoading && filteredRosters.length > 0 && viewMode === "list" && (
          <div className="space-y-2">
            {filteredRosters.map((roster: any) => (
              <div
                key={roster.id}
                onClick={() => handleRosterClick(roster.id)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-[#313578] hover:shadow-sm transition-all text-left group cursor-pointer"
              >
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#313578] transition-colors truncate">
                    {roster.name}
                  </h3>
                </div>

                {/* Status */}
                <Badge
                  variant={
                    roster.status === "PUBLISHED"
                      ? "default"
                      : roster.status === "DRAFT"
                      ? "secondary"
                      : "outline"
                  }
                  className={cn(
                    "text-xs min-w-[80px] justify-center",
                    roster.status === "PUBLISHED" && "bg-green-100 text-green-800 hover:bg-green-200",
                    roster.status === "DRAFT" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                    roster.status === "ARCHIVED" && "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  {roster.status}
                </Badge>

                {/* Date Range */}
                <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 min-w-[200px]">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {new Date(roster.startDate).toLocaleDateString()}
                    {roster.endDate && (
                      <> - {new Date(roster.endDate).toLocaleDateString()}</>
                    )}
                  </span>
                </div>

                {/* Duration Type */}
                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 min-w-[120px]">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="capitalize">
                    {roster.durationType.toLowerCase()}
                  </span>
                </div>

                {/* Shifts Count */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 min-w-[100px]">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {roster.shiftCount}{" "}
                    {roster.shiftCount === 1 ? "shift" : "shifts"}
                  </span>
                </div>
                
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}

        {/* Grid View */}
        {!isLoading && filteredRosters.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRosters.map((roster: any) => (
              <div
                key={roster.id}
                onClick={() => handleRosterClick(roster.id)}
                className="p-5 bg-white border border-gray-200 rounded-lg hover:border-[#313578] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col"
              >
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#313578] transition-colors line-clamp-1">
                      {roster.name}
                    </h3>
                    <Badge
                      variant={
                        roster.status === "PUBLISHED"
                          ? "default"
                          : roster.status === "DRAFT"
                          ? "secondary"
                          : "outline"
                      }
                      className={cn(
                        "text-xs shrink-0",
                        roster.status === "PUBLISHED" && "bg-green-100 text-green-800 hover:bg-green-200",
                        roster.status === "DRAFT" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
                        roster.status === "ARCHIVED" && "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {roster.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(roster.startDate).toLocaleDateString()}
                        {roster.endDate && (
                          <>
                            {" "}
                            - {new Date(roster.endDate).toLocaleDateString()}
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="capitalize">
                        {roster.durationType.toLowerCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {roster.shiftCount}{" "}
                        {roster.shiftCount === 1 ? "shift" : "shifts"}
                      </span>
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  {roster.instructions && (
                    <p className="text-xs text-gray-500 line-clamp-2 pt-3 border-t border-gray-100 mt-3">
                      {roster.instructions}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
