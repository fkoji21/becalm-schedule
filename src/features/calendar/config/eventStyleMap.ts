import { EventGroup } from "../types/event";

export const eventStyleMap: Record<EventGroup, string> = {
    PLAN: "bg-default-200 text-foreground",
    SHIFT: "bg-success-200 text-success-900",
    MEETING: "bg-primary text-primary-foreground",
};
