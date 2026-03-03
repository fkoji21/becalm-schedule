"use client";

import React from "react";
import dayjs from "dayjs";
import type { ScheduleEvent } from "../types/event";

function CardShell({
    title,
    children,
    }: {
    title?: string;
    children: React.ReactNode;
    }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
        {title && (
            <div className="mb-3 text-sm font-semibold text-gray-700">
            {title}
            </div>
        )}
        {children}
        </div>
    );
}

type Props = {
    currentDate: Date;
    events: ScheduleEvent[];
};

export function MiniCalendarCard({ currentDate, events }: Props) {
    const current = dayjs(currentDate);

    // ① days を先に作る
    const startOfMonth = current.startOf("month");
    const endOfMonth = current.endOf("month");

    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days: dayjs.Dayjs[] = [];
    let cursor = startDate;

    while (cursor.isBefore(endDate) || cursor.isSame(endDate)) {
        days.push(cursor);
        cursor = cursor.add(1, "day");
    }

    // ② eventDays を作る
    const eventDays = new Set<string>();

    (events ?? []).forEach((ev) => {
        const eventDate = dayjs(ev.date).startOf("day");

        days.forEach((d) => {
            const currentDay = d.startOf("day");

            // 単発
            if (!ev.isRecurring) {
            if (currentDay.isSame(eventDate, "day")) {
                eventDays.add(currentDay.format("YYYY-MM-DD"));
            }
            }

            // 毎週
            if (ev.isRecurring) {
            const diff = currentDay.diff(eventDate, "day");

            if (diff >= 0 && diff % 7 === 0) {
                eventDays.add(currentDay.format("YYYY-MM-DD"));
            }
            }
        });
    });

    const today = dayjs();
    const DOW = ["日", "月", "火", "水", "木", "金", "土"];

    return (
        <CardShell title={`${current.format("YYYY年M月")}`}>
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 text-xs font-medium text-gray-800 mb-2 justify-items-center gap-1">
            {DOW.map((d) => (
            <div key={d} className="text-center">
                {d}
            </div>
            ))}
        </div>
        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-1 text-xs justify-items-center">
            {days.map((day) => {
            const key = day.format("YYYY-MM-DD");
            const isToday = day.isSame(today, "day");
            const isCurrentMonth = day.month() === current.month();
            const hasEvent = eventDays.has(key);

            return (
                <div key={key} className="relative h-9 w-9 flex items-center justify-center cursor-pointer">

                {/* ① 予定あり */}
                {hasEvent && (
                    <div className="absolute h-9 w-9 rounded-full bg-[#D1F6F4]" />
                )}

                {/* ② 今日（内側） */}
                {isToday && (
                    <div className="absolute h-8 w-8 rounded-full bg-primary" />
                )}

                {/* ③ 日付 */}
                <div
                    className={[
                    "relative z-10 text-xs font-medium",
                    !isCurrentMonth ? "text-gray-300" : "text-gray-800",
                    isToday ? "text-white" : "",
                    ].join(" ")}
                >
                    {day.date()}
                </div>
                </div>
            );
            })}
        </div>
        </CardShell>
    );
}
