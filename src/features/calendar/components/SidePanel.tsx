"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { MiniCalendarCard } from "./MiniCalendarCard";
import { GoalRingCard } from "./GoalRingCard";
import { EventFormCard } from "./EventFormCard";
import { type EventType } from "../types/event";

export function SidePanel({
        isEditing,
        onStartEdit,
        onCloseEdit,
        onAddEvent,
        draft,
        days,
    }: {
        isEditing: boolean;
        onStartEdit: () => void;
        onCloseEdit: () => void;
        onAddEvent: (payload: { type: EventType; label: string; startMin: number; endMin: number }) => void;
        draft?: { startMin: number; dayIndex: number } | null;
        days: Date[];
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
        <aside className="shrink-0 lg:sticky lg:top-6 lg:h-fit">
        <div className="space-y-4">
            <MiniCalendarCard />

            {!isEditing ? (
            <>
                <Button className="w-full" color="primary" onPress={onStartEdit}>
                ＋ 新しい予定を作成する
                </Button>

                <GoalRingCard />
            </>
            ) : (
            <div ref={formWrapRef} className="relative">
            {/* ✕ をカード内右上に重ねる */}
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
                days={days}
                titleInputRef={titleInputRef}
                onAdd={(payload) => {
                onAddEvent(payload);
                }}
            />
            </div>
            )}
        </div>
        </aside>
    );
}
