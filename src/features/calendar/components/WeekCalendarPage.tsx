"use client";

import { useState, useEffect, useRef } from "react";
import { addDays, formatYM, formatMD } from "../utils/date";
import { useWeekCalendar } from "../hooks/useWeekCalendar";
import { EventChip } from "./EventChip";
import { SidePanel } from "./SidePanel";
import { type ScheduleEvent } from "../types/event";
import {
    CALENDAR_START_HOUR,
    CALENDAR_END_HOUR,
    CALENDAR_START_MIN,
    CALENDAR_END_MIN,
    SLOT_HEIGHT,
} from "../config/timeConfig";

const DOW = ["日", "月", "火", "水", "木", "金", "土"];
const btnToday = "h-10 w-[120px] rounded-xl border-2 border-primary bg-white px-4 text-sm font-medium text-primary hover:bg-primary/5";
const btnNav = "h-10 w-10 rounded-xl bg-transparent text-slate-700 hover:bg-slate-200/40 active:bg-slate-200/60";
const today = new Date();
const iso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export function WeekCalendarPage() {
    const { anchorDate, setAnchorDate, events, days, draft, setDraft, addEvent, updateEvent, deleteEvent, selectedEvent, setSelectedEvent, } = useWeekCalendar();
    const [isEditing, setIsEditing] = useState(false);
    const weekDates = days.map((d) => iso(d));
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{
        dayIndex: number;
        startMin: number;
    } | null>(null);
    const [draggingEvent, setDraggingEvent] = useState<ScheduleEvent | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);
    const columnWidthRef = useRef(0);
    const labelWidthRef = useRef(0);
    const [colWidth, setColWidth] = useState(0);
    const [labelWidth, setLabelWidth] = useState(60);

    useEffect(() => {
        if (!gridRef.current) return;

        const dayCols = gridRef.current.querySelectorAll("[data-day-col]");
        if (!dayCols.length) return;

        const firstRect = dayCols[0].getBoundingClientRect();
        const gridRect = gridRef.current.getBoundingClientRect();

        setColWidth(firstRect.width);
        setLabelWidth(firstRect.left - gridRect.left);
    }, []);

    useEffect(() => {
        const handleMouseUp = () => {
            if (!dragging) return;
            setDragging(false);
            setIsEditing(true);
        };
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    useEffect(() => {
    if (!draggingEvent) return;

    const handleMouseMove = (e: MouseEvent) => {
        if (!gridRef.current || !draggingEvent) return;

        const rect = gridRef.current.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        // ===== 縦計算 =====
        const hoursFromTop = Math.floor(offsetY / SLOT_HEIGHT);
        let newStart = (CALENDAR_START_HOUR + hoursFromTop) * 60;

        const duration = draggingEvent.endMin - draggingEvent.startMin;

        const minStart = CALENDAR_START_MIN;
        const maxStart = CALENDAR_END_MIN - duration;

        newStart = Math.max(minStart, Math.min(newStart, maxStart));

        // ===== 横計算 =====
        const dayCols = Array.from(
        gridRef.current.querySelectorAll("[data-day-col]")
        ) as HTMLElement[];

        let newDayIndex = draggingEvent.dayIndex;

        for (let i = 0; i < dayCols.length; i++) {
            const r = dayCols[i].getBoundingClientRect();
            if (e.clientX >= r.left && e.clientX <= r.right) {
                newDayIndex = i;
                break;
            }
        }
        newDayIndex = Math.max(0, Math.min(6, newDayIndex));
        const newDate = iso(days[newDayIndex]);
        const updatedEvent = {
            ...draggingEvent,
            date: newDate,
            dayIndex: newDayIndex,
            startMin: newStart,
            endMin: newStart + duration,
        };
        updateEvent(updatedEvent);
        setSelectedEvent(updatedEvent);
    };

    const handleMouseUp = () => {
        setDraggingEvent(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };
    }, [draggingEvent, updateEvent]);

    return (
        <div className="mx-auto w-full max-w-[1436px] px-4 py-4 lg:px-6">
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

            <div className="mt-6 grid grid-cols-1 gap-6
                lg:grid-cols-[1092px_320px]
                lg:h-[777px]
                lg:grid-rows-[1fr]
                lg:items-stretch">
                {/* Left: Week grid */}
                <section className="h-full rounded-2xl border border-gray-200 bg-white overflow-x-auto lg:overflow-visible">
                <div className="h-full flex flex-col min-h-0">
                    {/* Day header */}
                    <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] lg:grid-cols-[60px_repeat(7,140px)] border-slate-200">
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
                            className="border-r border-b border-slate-200 last:border-r-0 px-2 py-2 text-center"
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
                    <div
                        ref={gridRef}
                        className="relative grid flex-1 grid-cols-[60px_repeat(7,minmax(0,1fr))] lg:grid-cols-[60px_repeat(7,140px)] border-gray-200"
                    >
                    {events
                        .filter((ev) => {
                            if (ev.isRecurring) return true;
                            return weekDates.includes(ev.date);
                        })
                        .map((ev) => (
                            <EventChip
                                key={ev.id}
                                ev={ev}
                                colWidth={colWidth}
                                labelWidth={labelWidth}
                                onClick={(ev) => {
                                    setSelectedEvent(ev);
                                    setIsEditing(true);
                                }}
                                onMouseDown={() => {
                                    setDraggingEvent(ev);
                                }}
                            />
                        ))}
                        {draft && (
                        <div
                            className="absolute bg-primary/20 border border-primary rounded-md pointer-events-none"
                            style={{
                                left: `${labelWidth + draft.dayIndex * colWidth}px`,
                                width: `${colWidth}px`,
                                top: `${draft.startMin - CALENDAR_START_MIN}px`,
                                height: `${draft.endMin - draft.startMin}px`,
                            }}
                        />
                        )}

                    {/* Time labels */}
                    <div className="border-r border-gray-200">
                        {Array.from(
                            { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
                            (_, i) => CALENDAR_START_HOUR + i
                        ).map((h) => (
                        <div key={h} className="h-[60px] pr-2 text-xs text-gray-500 flex items-end justify-end pb-1">
                            {h+1}:00
                        </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {Array.from({ length: 7 }, (_, dayIdx) => (
                        <div key={dayIdx} data-day-col className="border-r border-gray-200 last:border-r-0">
                        {Array.from(
                            { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
                            (_, row) => {
                                const startMin =
                                    (CALENDAR_START_HOUR + row) * 60;

                            return (
                            <div
                                key={row}
                                className={["h-[60px] border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition",
                                ].join(" ")}
                                onClick={() => {
                                    setSelectedEvent(null);
                                    setDraft({ dayIndex: dayIdx, startMin, endMin: startMin + 60, });
                                    setIsEditing(true);
                                }}
                                onMouseDown={() => {
                                    setDragging(true);
                                    setDragStart({ dayIndex: dayIdx, startMin });
                                    setDraft({
                                        dayIndex: dayIdx,
                                        startMin,
                                        endMin: startMin + 60,
                                    });
                                }}
                                onMouseEnter={() => {
                                    if (!dragging || !dragStart) return;
                                    if (dragStart.dayIndex !== dayIdx) return;

                                    const min = Math.min(dragStart.startMin, startMin);
                                    const max = Math.max(dragStart.startMin, startMin) + 60;

                                    setDraft({
                                        dayIndex: dayIdx,
                                        startMin: min,
                                        endMin: max,
                                    });
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
                anchorDate={anchorDate}
                events={events}
                isEditing={isEditing}
                selectedEvent={selectedEvent}
                onStartEdit={() => setIsEditing(true)}
                onCloseEdit={() => {
                    setIsEditing(false);
                    setDraft(null);
                }}
                onAddEvent={(payload) => {
                    if (selectedEvent) {
                        updateEvent({
                        ...selectedEvent,
                        ...payload,
                        });
                    } else if (draft) {
                        const targetDate = iso(days[draft.dayIndex]);

                        addEvent({
                        ...payload,
                        date: targetDate,
                        isRecurring: false,
                    });
                    }
                    setIsEditing(false);
                    setDraft(null);
                    setSelectedEvent(null);
                }}
                draft={draft}
                days={days}
                onDelete={(id) => {
                    deleteEvent(id);
                    setSelectedEvent(null);
                    setIsEditing(false);
                }}
                />
            </div>
        </div>
    );
}
