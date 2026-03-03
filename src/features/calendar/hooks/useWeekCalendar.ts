import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { addDays, startOfWeek } from "../utils/date";
import { type ScheduleEvent, type EventType } from "../types/event";

const isoDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export function useWeekCalendar() {
    const [anchorDate, setAnchorDate] = useState<Date>(new Date());

    const [events, setEvents] = useState<ScheduleEvent[]>([
        {
        id: "1",
        date: "2026-02-16",
        dayIndex: 1,
        startMin: 10 * 60,
        endMin: 12 * 60,
        type: "MEETING",
        label: "面談",
        },
        {
        id: "2",
        date: "2026-02-18",
        dayIndex: 3,
        startMin: 15 * 60,
        endMin: 16 * 60 + 30,
        type: "SHIFT_REGULAR",
        label: "学習時間",
        },
    ]);

    const [draft, setDraft] = useState<{
        dayIndex: number;
        startMin: number;
        endMin: number;
    } | null>(null);

    const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);

    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart]
    );

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(ev => ev.id !== id));
    };

    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

    const addEvent = ({
        type,
        label,
        startMin,
        endMin,
        isRecurring,
        date,
    }: {
        type: EventType;
        label: string;
        startMin: number;
        endMin: number;
        isRecurring: boolean;
        date: string;
        }) => {
        const dayIndex = days.findIndex(d => isoDate(d) === date);
        const newEv: ScheduleEvent = {
        id: nanoid(),
        date,
        dayIndex,
        startMin,
        endMin,
        type,
        label,
        isRecurring,
        };
        setEvents((prev) => [...prev, newEv]);
    };

    const updateEvent = (updated: ScheduleEvent) => {
        setEvents((prev) =>
            prev.map((ev) => (ev.id === updated.id ? updated : ev))
        );
    };

    return {
        anchorDate,
        setAnchorDate,
        events,
        days,
        draft,
        setDraft,
        addEvent,
        updateEvent,
        deleteEvent,
        selectedEvent,
        setSelectedEvent,
    };
}
