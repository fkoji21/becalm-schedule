export const EventType = {
    SHIFT_REGULAR: "SHIFT_REGULAR",
    SHIFT_TEMP: "SHIFT_TEMP",
    PLAN: "PLAN",
    RECURRING_PLAN: "RECURRING_PLAN",
    MEETING: "MEETING",
    MEETING_LEAVE: "MEETING_LEAVE",
    MEETING_CANCEL: "MEETING_CANCEL",
    MEETING_COACH_CHANGE: "MEETING_COACH_CHANGE",
} as const;
export type EventType = typeof EventType[keyof typeof EventType];

export const EventGroup = {
    SHIFT: "SHIFT",
    PLAN: "PLAN",
    MEETING: "MEETING",
} as const;
export type EventGroup = typeof EventGroup[keyof typeof EventGroup];

export const typeToGroup: Record<EventType, EventGroup> = {
    SHIFT_REGULAR: "SHIFT",
    SHIFT_TEMP: "SHIFT",
    PLAN: "PLAN",
    RECURRING_PLAN: "PLAN",
    MEETING: "MEETING",
    MEETING_LEAVE: "MEETING",
    MEETING_CANCEL: "MEETING",
    MEETING_COACH_CHANGE: "MEETING",
};

export type ScheduleEvent = {
    id: string;
    date: string;     // ISO (yyyy-mm-dd)
    dayIndex: number; // 0-6
    startMin: number;
    endMin: number;
    type: EventType;
    label: string;
};
