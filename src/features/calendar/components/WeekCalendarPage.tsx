"use client";

import { useState } from "react";
import { addDays, formatYM, formatMD } from "../utils/date";
import { useWeekCalendar } from "../hooks/useWeekCalendar";
import { EventChip } from "./EventChip";
import { SidePanel } from "./SidePanel";

const DOW = ["日", "月", "火", "水", "木", "金", "土"];
const btnToday = "h-10 w-[120px] rounded-xl border-2 border-primary bg-white px-4 text-sm font-medium text-primary hover:bg-primary/5";

const btnNav = "h-10 w-10 rounded-xl bg-transparent text-slate-700 hover:bg-slate-200/40 active:bg-slate-200/60";
const today = new Date();

export function WeekCalendarPage() {
    const { anchorDate, setAnchorDate, events, days, draft, setDraft, addEvent } = useWeekCalendar();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="w-full">
            <div className="w-full px-4 py-4 lg:px-6">
                <h1 className="text-2xl font-bold">スケジュール</h1>

                {/* Week header */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    {!isEditing && (
                        <>
                        <button
                            className={btnToday}
                            onClick={() => setAnchorDate(new Date())}
                        >
                            今日
                        </button>

                        <button
                            className={btnNav}
                            onClick={() => setAnchorDate(addDays(anchorDate, -7))}
                            aria-label="prev week"
                        >
                            ◀
                        </button>

                        <button
                            className={btnNav}
                            onClick={() => setAnchorDate(addDays(anchorDate, 7))}
                            aria-label="next week"
                        >
                            ▶
                        </button>
                        </>
                    )}
                    </div>


                    <div className="text-lg font-semibold">{formatYM(anchorDate)}</div>
                    <div className="w-[120px]" />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Left: Week grid */}
                    <section className="h-full rounded-2xl border border-gray-200 bg-white p-4 lg:p-5 overflow-x-auto">
                    <div className="min-w-[900px]">
                        {/* Day header */}
                        <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] border-b border-slate-200">
                        <div className="border-r border-slate-200" />

                        {days.map((d, i) => {
                            const dowClass =
                                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-slate-500";
                            const dateClass =
                                i === 0 ? "text-red-600" : i === 6 ? "text-blue-600" : "text-slate-900";
                            const isToday =
                                d.getFullYear() === today.getFullYear() &&
                                d.getMonth() === today.getMonth() &&
                                d.getDate() === today.getDate();

                            return (
                            <div
                                key={i}
                                className="border-r border-slate-200 last:border-r-0 px-2 py-3 text-center"
                            >
                                <div className={`text-xs font-medium ${dowClass}`}>{DOW[i]}</div>
                                <div className={[
                                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xl font-bold",
                                    isToday ? "bg-blue-500 text-white" : dateClass,
                                    ].join(" ")}
                                    >{d.getDate()}</div>
                            </div>
                            );
                        })}
                        </div>

                        {/* Grid body */}
                        <div className="relative grid grid-cols-[72px_repeat(7,minmax(0,1fr))] border-t border-gray-200">
                        {events.map((ev) => (
                            <EventChip key={ev.id} ev={ev} />
                        ))}

                        {/* Time labels */}
                        <div className="border-r border-gray-200">
                            {Array.from({ length: 11 }, (_, i) => 8 + i).map((h) => (
                            <div key={h} className="h-[60px] px-2 pt-1 text-xs text-gray-500">
                                {h}:00
                            </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {Array.from({ length: 7 }, (_, dayIdx) => (
                            <div key={dayIdx} className="border-r border-gray-200 last:border-r-0">
                            {Array.from({ length: 11 }, (_, row) => {
                                const startMin = (8 + row) * 60;
                                const isSelected =
                                    draft?.dayIndex === dayIdx &&
                                    draft?.startMin === startMin;

                                return (
                                <div
                                    key={row}
                                    className={["h-[60px] border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition",
                                        isSelected ? "bg-primary/10 ring-1 ring-primary/30" : "",
                                    ].join(" ")}
                                    onClick={() => {
                                        setDraft({ dayIndex: dayIdx, startMin });
                                        setIsEditing(true);
                                    }}
                                />
                                );
                            })}
                            </div>
                        ))}
                        </div>
                    </div>
                    </section>

                    {/* Right: Side panel */}
                    <SidePanel
                    isEditing={isEditing}
                    onStartEdit={() => setIsEditing(true)}
                    onCloseEdit={() => {
                        setIsEditing(false);
                        setDraft(null);
                    }}
                    onAddEvent={(payload) => {
                        addEvent(payload);
                        setIsEditing(false);
                        setDraft(null);
                    }}
                    draft={draft}
                    days={days}
                    />
                </div>
            </div>
        </div>
    );
}
