"use client";

import { type ScheduleEvent, typeToGroup } from "../types/event";
import { eventStyleMap } from "../config/eventStyleMap";

export function EventChip({ ev }: { ev: ScheduleEvent }) {
    const group = typeToGroup[ev.type];
    const top = ev.startMin - 8 * 60;
    const height = ev.endMin - ev.startMin;

    return (
        <div
        className={[
            "absolute rounded-xl px-3 py-2 text-sm font-semibold shadow-sm",
            "overflow-hidden leading-tight",
            eventStyleMap[group],
        ].join(" ")}
        style={{
            top: `${top}px`,
            left: `calc(72px + ${ev.dayIndex} * ((100% - 72px) / 7) + 6px)`,
            width: `calc((100% - 72px) / 7 - 12px)`,
            height: `${height}px`,
        }}
        >
        <span className="block truncate">{ev.label}</span>
        </div>
    );
}
