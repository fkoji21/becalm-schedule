import { EventGroup } from "../types/event";

export const eventStyleMap: Record<EventGroup, string> = {
    PLAN: "bg-default-200 text-foreground",
    SHIFT: "bg-[#D1F6F4] text-[#1C7F86]",
    MEETING: "bg-primary text-primary-foreground",
};
