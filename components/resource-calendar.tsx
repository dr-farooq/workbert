"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResourceCalendarResource {
  id: string;
  title: string;
  subtitle?: string;
  color?: string;
}

export interface ResourceCalendarEvent {
  id: string;
  resourceId: string;
  title: string;
  date: Date;
  backgroundColor?: string;
  textColor?: string;
  hasWarning?: boolean;
  warningMessage?: string;
  data?: any;
}

interface ResourceCalendarProps {
  resources: ResourceCalendarResource[];
  events: ResourceCalendarEvent[];
  view?: "week" | "month";
  onEventClick?: (event: ResourceCalendarEvent) => void;
  onCellClick?: (date: Date, resourceId: string) => void;
  onCellDrop?: (e: React.DragEvent, date: Date, resourceId: string) => void;
  onEventDrop?: (
    e: React.DragEvent,
    event: ResourceCalendarEvent,
    date: Date,
    resourceId: string
  ) => void;
}

export function ResourceCalendar({
  resources,
  events,
  view = "week",
  onEventClick,
  onCellClick,
  onCellDrop,
  onEventDrop,
}: ResourceCalendarProps) {
  // Generate dates based on view (mocking current week/month)
  const dates = React.useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
      {/* Header - Days */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px]">
          <div className="flex border-b border-gray-200 sticky top-0 z-20 bg-white">
            <div className="w-48 shrink-0 p-3 border-r border-gray-200 bg-gray-50 text-gray-500 font-medium text-sm sticky left-0 z-30">
              Resources
            </div>
            <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200">
              {dates.map((date) => (
                <div
                  key={date.toISOString()}
                  className="p-2 text-center bg-gray-50/50"
                >
                  <div className="text-xs text-gray-500 font-medium uppercase">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-sm text-gray-900 font-semibold">
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Body - Resources & Cells */}
          <div className="flex flex-col divide-y divide-gray-200">
            {resources.map((resource) => (
              <div key={resource.id} className="flex group min-h-[80px]">
                {/* Resource Header */}
                <div className="w-48 shrink-0 p-3 border-r border-gray-200 bg-white group-hover:bg-gray-50 transition-colors sticky left-0 z-10">
                  <div className="flex items-center gap-2">
                    {resource.color && (
                      <div
                        className="w-1 h-4 rounded-full"
                        style={{ backgroundColor: resource.color }}
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {resource.title}
                      </div>
                      {resource.subtitle && (
                        <div className="text-xs text-gray-500 truncate">
                          {resource.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cells Grid */}
                <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200 bg-white">
                  {dates.map((date) => {
                    const dateKey = date.toISOString().split("T")[0];
                    const cellEvents = events.filter(
                      (e) =>
                        e.resourceId === resource.id &&
                        e.date.toISOString().split("T")[0] === dateKey
                    );

                    return (
                      <div
                        key={dateKey}
                        className="p-1 relative hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onCellClick?.(date, resource.id)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          // Check effectAllowed to determine if it's a move (event) or copy (member)
                          if (e.dataTransfer.effectAllowed === "move") {
                            e.dataTransfer.dropEffect = "move";
                          } else {
                            e.dataTransfer.dropEffect = "copy";
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          try {
                            const data = JSON.parse(
                              e.dataTransfer.getData("application/json")
                            );
                            if (data.id && data.resourceId) {
                              // It's an event being moved
                              const event = events.find((ev) => ev.id === data.id);
                              if (event && onEventDrop) {
                                onEventDrop(e, event, date, resource.id);
                              }
                            } else {
                              // It's a member being dropped
                              onCellDrop?.(e, date, resource.id);
                            }
                          } catch (err) {
                            // Fallback to regular drop
                            onCellDrop?.(e, date, resource.id);
                          }
                        }}
                      >
                        {cellEvents.map((event) => (
                          <div
                            key={event.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData(
                                "application/json",
                                JSON.stringify(event)
                              );
                              e.dataTransfer.effectAllowed = "move";
                              e.stopPropagation();
                            }}
                            className="p-1.5 rounded text-xs font-medium mb-1 shadow-sm truncate cursor-move hover:opacity-90 border border-black/5 active:opacity-70"
                            style={{
                              backgroundColor:
                                event.backgroundColor || "#3b82f6",
                              color: event.textColor || "#ffffff",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                            title={
                              event.hasWarning
                                ? event.warningMessage
                                : undefined
                            }
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No shift templates defined yet. Add templates to see the
                calendar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
