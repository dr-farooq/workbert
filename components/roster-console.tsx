"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  Terminal,
  X,
  Maximize2,
  Minimize2,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export interface ConsoleProblem {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  resource?: string;
  date?: string;
  source?: string; // e.g., "Rule Engine", "AI"
}

interface RosterConsoleProps {
  problems: ConsoleProblem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  height?: number;
}

export function RosterConsole({
  problems,
  isExpanded,
  onToggleExpand,
  height = 300,
}: RosterConsoleProps) {
  const [activeTab, setActiveTab] = React.useState("problems");
  const [filter, setFilter] = React.useState("");

  const filteredProblems = problems.filter((p) =>
    p.message.toLowerCase().includes(filter.toLowerCase())
  );

  const errorCount = problems.filter((p) => p.severity === "error").length;
  const warningCount = problems.filter((p) => p.severity === "warning").length;

  return (
    <div
      className={cn(
        "border-t border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" : ""
      )}
      style={{ height: isExpanded ? height : "36px" }}
    >
      {/* Header / Tab Bar */}
      <div className="flex items-center justify-between px-2 bg-gray-50/80 border-b border-gray-200 h-9 shrink-0 select-none">
        <div className="flex items-center h-full">
          <Button
            variant="ghost"
            size="sm"
            className="h-full w-8 px-0 hover:bg-gray-200/50 text-gray-500"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v);
              if (!isExpanded) onToggleExpand();
            }}
            className="h-full"
          >
            <TabsList className="h-full p-0 bg-transparent gap-0 rounded-none">
              <TabsTrigger
                value="problems"
                className="h-full px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:shadow-none text-xs font-medium text-gray-600 gap-2"
              >
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Problems
                  <div className="flex items-center gap-1 ml-1">
                    {errorCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 border-0 text-[10px] min-w-5 justify-center"
                      >
                        {errorCount}
                      </Badge>
                    )}
                    {warningCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1.5 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0 text-[10px] min-w-5 justify-center"
                      >
                        {warningCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="console"
                className="h-full px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:shadow-none text-xs font-medium text-gray-600 gap-2"
              >
                <Terminal className="h-3.5 w-3.5" />
                Console
              </TabsTrigger>
              <TabsTrigger
                value="output"
                className="h-full px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:shadow-none text-xs font-medium text-gray-600 gap-2"
              >
                Output
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-1">
          {/* Additional controls could go here */}
        </div>
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="flex-1 min-h-0 flex flex-col">
          {activeTab === "problems" && (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Filter messages..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-7 pl-8 text-xs bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-colors"
                  />
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{filteredProblems.length} messages</span>
                </div>
              </div>

              {/* List */}
              <ScrollArea className="flex-1">
                <div className="flex flex-col">
                  {filteredProblems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Check className="h-8 w-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900">
                        No problems found
                      </p>
                      <p className="text-xs">
                        Roster validation checks passed successfully.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {filteredProblems.map((problem) => (
                          <tr
                            key={problem.id}
                            className="group border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                          >
                            <td className="py-1.5 pl-4 pr-2 w-8 align-top">
                              {problem.severity === "error" ? (
                                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                              ) : problem.severity === "warning" ? (
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                              ) : (
                                <div className="h-4 w-4 rounded-full bg-blue-500 mt-0.5" />
                              )}
                            </td>
                            <td className="py-1.5 px-2 align-top">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs text-gray-900 font-medium leading-snug">
                                  {problem.message}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                  {problem.source && (
                                    <span className="font-medium text-gray-600">
                                      [{problem.source}]
                                    </span>
                                  )}
                                  {problem.resource && (
                                    <span>{problem.resource}</span>
                                  )}
                                  {problem.date && <span>{problem.date}</span>}
                                </div>
                              </div>
                            </td>
                            <td className="py-1.5 px-4 w-24 text-right align-top text-xs text-gray-400 group-hover:text-gray-500">
                              {problem.id.split("-")[1]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeTab === "console" && (
            <div className="p-4 text-xs font-mono text-gray-500">
              <div className="flex gap-2 mb-1">
                <span className="text-blue-600">info</span>
                <span>Initializing AI agent...</span>
              </div>
              <div className="flex gap-2 mb-1">
                <span className="text-green-600">ready</span>
                <span>Waiting for commands.</span>
              </div>
            </div>
          )}

          {activeTab === "output" && (
            <div className="p-4 text-xs font-mono text-gray-500">
              No output generated yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
