"use client";

import React from "react";

function CardShell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4">{children}</div>;
}

export function GoalRingCard() {
    return (
        <CardShell>
        <div className="flex items-center justify-center">
            <div className="relative h-44 w-44 rounded-full border-[14px] border-teal-600">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs text-gray-500">目標まで</div>
                <div className="text-2xl font-bold">2時間30分</div>
            </div>
            </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">今週の目標学習時間</div>
        <div className="text-center text-xl font-bold">40時間</div>
        </CardShell>
    );
}
