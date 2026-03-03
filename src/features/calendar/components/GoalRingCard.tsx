"use client";

import React from "react";

function CardShell({ children }: { children: React.ReactNode }) {
    return <div className="h-full rounded-2xl border border-gray-200 bg-white p-4 flex flex-col">{children}</div>;
}

export function GoalRingCard() {
    return (
        <CardShell>
        <div className="flex-1 flex items-center justify-center">
            <div className="relative h-60 w-60 rounded-full border-[16px] border-teal-600">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl text-gray-500">目標まで</div>
                <div className="text-3xl font-bold">2時間30分</div>
            </div>
            </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">今週の目標学習時間</div>
        <div className="text-center text-3xl font-bold">40時間</div>
        </CardShell>
    );
}
