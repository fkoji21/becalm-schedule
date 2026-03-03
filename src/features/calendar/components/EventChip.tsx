"use client";

import { type ScheduleEvent, typeToGroup } from "../types/event";
import { eventStyleMap } from "../config/eventStyleMap";
import {
    CALENDAR_START_MIN,
    SLOT_HEIGHT,
} from "../config/timeConfig";

export function EventChip({ ev, onClick, colWidth, labelWidth, onMouseDown, }: { ev: ScheduleEvent; onClick: (ev: ScheduleEvent) => void; colWidth: number; labelWidth: number; onMouseDown?: () => void;}) {
    const group = typeToGroup[ev.type];
    const top = ev.startMin - CALENDAR_START_MIN;
    const height = ev.endMin - ev.startMin;

    return (
        <div
            onClick={() => onClick(ev)}
            onMouseDown={onMouseDown}
            className={[
                "absolute rounded-xl px-3 py-2 text-sm font-semibold shadow-sm",
                "overflow-hidden leading-tight",
                eventStyleMap[group],
                "cursor-pointer",
            ].join(" ")}
            style={{
                top: `${top}px`,
                left: `${labelWidth + ev.dayIndex * colWidth + 6}px`,
                width: `${colWidth - 12}px`,
                height: `${height}px`,
            }}
        >
        <span className="block truncate">{ev.label}</span>
        </div>
    );
}
