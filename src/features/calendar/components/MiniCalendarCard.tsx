"use client";

import React from "react";

function CardShell({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
        {title && <div className="mb-3 text-sm font-semibold text-gray-700">{title}</div>}
        {children}
        </div>
    );
}

export function MiniCalendarCard() {
    return (
        <CardShell title="カレンダー">
        <div className="h-40 rounded-xl bg-gray-50 border border-gray-200" />
        </CardShell>
    );
}
