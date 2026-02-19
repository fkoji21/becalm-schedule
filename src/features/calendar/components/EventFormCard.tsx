"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Select, SelectItem, Checkbox  } from "@heroui/react";
import { EventType, type EventType as EventTypeT } from "../types/event";

const fieldCN = {
    label: "text-slate-600 text-xs",
    inputWrapper:
        "bg-slate-100 shadow-none border-0 hover:bg-slate-100 data-[focus=true]:bg-slate-100",
    input: "text-slate-900",
};

const selectCN = {
    label: "text-slate-600 text-xs",
    trigger:
        "bg-slate-100 shadow-none border-0 hover:bg-slate-100 data-[focus=true]:bg-slate-100",
    value: "text-slate-900",
};

const EVENT_OPTIONS: { key: EventTypeT; label: string }[] = [
    { key: EventType.SHIFT_REGULAR, label: "学習時間" },
    { key: EventType.PLAN, label: "予定" },
    { key: EventType.MEETING, label: "面談" },
];

const INTERVIEW_LABELS = [
    "面談",
    "休学申請面談",
    "解約申請面談",
    "コーチ変更申請面談",
] as const;

function CardShell({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {title && <div className="mb-3 text-sm font-semibold text-gray-700">{title}</div>}
        {children}
        </div>
    );
}

function toMin(hhmm: string) {
    const m = hhmm.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return h * 60 + min;
}

function toHHMM(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function EventFormCard({
    onAdd,
    titleInputRef,
    draft,
    days,
    }: {
    onAdd: (payload: { type: EventTypeT; label: string; startMin: number; endMin: number }) => void;
    titleInputRef: React.RefObject<HTMLInputElement | null>;
        draft?: { startMin: number; dayIndex: number } | null;
        days: Date[];
    }) {
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("10:00");
    const [end, setEnd] = useState("11:30");
    const [type, setType] = useState<EventTypeT>(EventType.SHIFT_REGULAR);
    const [interviewLabel, setInterviewLabel] =
        useState<(typeof INTERVIEW_LABELS)[number]>("面談");

    const isMeeting = type === EventType.MEETING;
    const dateStr =
        draft
            ? `${days[draft.dayIndex].getFullYear()}/${
                String(days[draft.dayIndex].getMonth() + 1).padStart(2, "0")
            }/${
                String(days[draft.dayIndex].getDate()).padStart(2, "0")
            }`
            : "";

    const [isRecurring, setIsRecurring] = useState(false);

    useEffect(() => {
        if (!draft) return;

        const s = draft.startMin;
        const e = s + 90;

        setStart(toHHMM(s));
        setEnd(toHHMM(e));
    }, [draft?.startMin]);

    const submit = () => {
        const s = toMin(start);
        const e = toMin(end);
        if (s == null || e == null) return;
        if (e <= s) return;

        const label = isMeeting ? interviewLabel : title.trim() || "予定";
        onAdd({ type, label, startMin: s, endMin: e });

        setTitle("");
    };

    return (
        <CardShell title="予定">
        <div className="space-y-3">
            <Select
            label="概要"
            selectedKeys={[type]}
            variant="flat"
            onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as EventTypeT | undefined;
                if (k) setType(k);
            }}
            >
            {EVENT_OPTIONS.map((o) => (
                <SelectItem key={o.key}>{o.label}</SelectItem>
            ))}
            </Select>

            {isMeeting ? (
            <Select
                label="面談種別"
                selectedKeys={[interviewLabel]}
                variant="flat"
                onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as (typeof INTERVIEW_LABELS)[number] | undefined;
                if (k) setInterviewLabel(k);
                }}
            >
                {INTERVIEW_LABELS.map((l) => (
                <SelectItem key={l}>{l}</SelectItem>
                ))}
            </Select>
            ) : (
            <Input
            label="日付"
            value={dateStr}
            isReadOnly
            variant="flat"
            classNames={fieldCN}
            />
            )}

            <div className="grid grid-cols-1 gap-3">
            <Input label="開始" value={start} onValueChange={setStart} variant="flat" classNames={fieldCN} />
            <Input label="終了" value={end} onValueChange={setEnd} variant="flat" classNames={fieldCN} />
            </div>

                <Checkbox
                    isSelected={isRecurring}
                    onValueChange={setIsRecurring}
                    classNames={{ label: "text-sm text-slate-700" }}
                >
                毎週繰り返す
                </Checkbox>

            <div className="mt-4 flex justify-end">
            <Button className="w-w-1/2" color="primary" onPress={submit}>
            更新
            </Button>
            </div>
        </div>
        </CardShell>
    );
}
