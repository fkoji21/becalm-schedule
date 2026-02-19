import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { addDays, startOfWeek } from "../utils/date";
import { type ScheduleEvent, type EventType } from "../types/event";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

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

    const [draft, setDraft] = useState({
        dayIndex: 1,
        startMin: 10 * 60,
    });

    const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);

    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart]
    );

    const addEvent = ({
        type,
        label,
        startMin,
        endMin,
    }: {
        type: EventType;
        label: string;
        startMin: number;
        endMin: number;
    }) => {
        const newEv: ScheduleEvent = {
        id: nanoid(),
        date: isoDate(days[draft.dayIndex]),
        dayIndex: draft.dayIndex,
        startMin,
        endMin,
        type,
        label,
        };
        setEvents((prev) => [...prev, newEv]);
    };

    return {
        anchorDate,
        setAnchorDate,
        events,
        days,
        draft,
        setDraft,
        addEvent,
    };
}
