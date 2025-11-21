"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Building2, ArrowRight, Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for now - will be replaced with Convex data later
const MOCK_ORGS = [
  { id: "org_1", name: "Acme Corp", role: "Admin", members: 12, rosters: 3 },
  { id: "org_2", name: "Beta Industries", role: "Member", members: 8, rosters: 1 },
  { id: "org_3", name: "Gamma Health", role: "Admin", members: 45, rosters: 12 },
  { id: "org_4", name: "Delta Logistics", role: "Member", members: 23, rosters: 5 },
];

type ViewMode = "grid" | "list";

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleOrgSelect = (orgId: string) => {
    router.push(`/dashboard/${orgId}`);
  };

  const filteredOrgs = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_ORGS;
    const query = searchQuery.toLowerCase();
    return MOCK_ORGS.filter((org) =>
      org.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Your Organizations</h1>
            <p className="text-gray-500">Manage your workspaces and teams</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-gray-200"
              />
            </div>
            <div className="flex items-center border border-gray-200 rounded-md bg-white shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-l-md transition-colors",
                  viewMode === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <div className="w-[1px] h-4 bg-gray-200" />
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-r-md transition-colors",
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <Button className="gap-2 bg-[#00C853] hover:bg-[#00b54b] text-white border-none">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Organization</span>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {/* Create New Org Card (Grid Only) */}
          {viewMode === "grid" && (
            <button className="group flex flex-col items-center justify-center p-8 bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#00C853] hover:bg-green-50 transition-all duration-200 min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-[#00C853] group-hover:text-white flex items-center justify-center transition-colors mb-4">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </div>
              <span className="font-semibold text-gray-900">Create Organization</span>
              <span className="text-sm text-gray-500 mt-1">Start a new workspace</span>
            </button>
          )}

          {filteredOrgs.map((org) => (
            <button
              key={org.id}
              onClick={() => handleOrgSelect(org.id)}
              className={cn(
                "group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#313578] transition-all duration-200 text-left",
                viewMode === "grid" ? "p-6 flex flex-col min-h-[220px]" : "p-4 flex items-center gap-6"
              )}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-[#313578]" />
                  </div>
                  
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-[#313578]" />
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#313578] transition-colors">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Role: {org.role}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-900 block text-sm">{org.members}</span>
                        Members
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-900 block text-sm">{org.rosters}</span>
                        Rosters
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#313578]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#313578] transition-colors">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-500">Role: {org.role}</p>
                  </div>

                  <div className="flex items-center gap-8 mr-8">
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 block">{org.members}</span>
                      <span className="text-xs text-gray-500">Members</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 block">{org.rosters}</span>
                      <span className="text-xs text-gray-500">Rosters</span>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#313578]" />
                </>
              )}
            </button>
          ))}
        </div>

        {filteredOrgs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No organizations found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
