"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { MiniCalendarCard } from "./MiniCalendarCard";
import { GoalRingCard } from "./GoalRingCard";
import { EventFormCard } from "./EventFormCard";
import { type EventType } from "../types/event";
import { type ScheduleEvent } from "../types/event";

export function SidePanel({
    anchorDate,
    events,
    isEditing,
    onStartEdit,
    onCloseEdit,
    onAddEvent,
    draft,
    days,
    selectedEvent,
    onDelete,
}: {
    anchorDate: Date;
    events: ScheduleEvent[];
    isEditing: boolean;
    onStartEdit: () => void;
    onCloseEdit: () => void;
    onAddEvent: (payload: { type: EventType; label: string; startMin: number; endMin: number }) => void;
    draft?: { startMin: number; endMin: number; dayIndex: number } | null;
    days: Date[];
    selectedEvent?: ScheduleEvent | null;
    onDelete?: (id: string) => void;
    }) {
    const formWrapRef = useRef<HTMLDivElement | null>(null);
    const titleInputRef = useRef<HTMLInputElement | null>(null);

    // 編集開始したらフォームへスクロール＆フォーカス
    useEffect(() => {
        if (!isEditing) return;
        formWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        const t = setTimeout(() => titleInputRef.current?.focus(), 200);
        return () => clearTimeout(t);
    }, [isEditing]);

    return (
        <aside className="shrink-0 h-full flex flex-col min-h-0">
            <div className="flex flex-col flex-1 space-y-4 min-h-0">
            <MiniCalendarCard currentDate={anchorDate} events={events}/>

            {!isEditing ? (
            <>
                <Button className="w-full" color="primary" onPress={onStartEdit}>
                ＋ 新しい予定を作成する
                </Button>

                <div className="flex-1">
                <GoalRingCard />
                </div>
            </>
            ) : (
            <div ref={formWrapRef} className="relative flex-1">
                {/* ✕ */}
                <button
                type="button"
                onClick={onCloseEdit}
                aria-label="close"
                className="absolute right-4 top-4 z-10 rounded-md p-2 text-slate-500 hover:bg-slate-100"
                >
                ✕
                </button>

                <EventFormCard
                draft={draft}
                selectedEvent={selectedEvent}
                days={days}
                titleInputRef={titleInputRef}
                onAdd={(payload) => {
                    onAddEvent(payload);
                }}
                onDelete={onDelete}
                />
            </div>
            )}
        </div>
        </aside>
    );
}
