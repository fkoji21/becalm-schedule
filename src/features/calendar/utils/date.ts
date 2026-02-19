export function startOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay(); // 0=Sun
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    return date;
}

export function addDays(d: Date, n: number) {
    const date = new Date(d);
    date.setDate(date.getDate() + n);
    return date;
}

export function formatYM(d: Date) {
    return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, "0")}月`;
}

export function formatMD(d: Date) {
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function toYMD(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
