# 🗓 BeCalm Schedule

Next.js + HeroUI を用いた週間スケジュール管理UIです。

## 🔧 Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- HeroUI

## ✨ Features

- 週間カレンダー表示
- セルクリックによる予定作成
- 開始・終了時間の指定
- 面談種別の選択
- 毎週繰り返し（UI実装のみ）
- コンポーネント分割による状態管理

## 🗂 Directory Structure

```text
src/features/calendar/
├── components/
│ ├── WeekCalendarPage.tsx
│ ├── SidePanel.tsx
│ ├── EventFormCard.tsx
│ ├── EventChip.tsx
│ ├── MiniCalendarCard.tsx
│ └── GoalRingCard.tsx
├── hooks/
│ └── useWeekCalendar.ts
├── types/
│ └── event.ts
├── utils/
│ └── date.ts
└── config/
└── eventStyleMap.ts
```

- `WeekCalendarPage`：メイン画面（レイアウト管理）
- `SidePanel`：右サイドフォーム
- `useWeekCalendar`：カレンダー状態管理
- `EventFormCard`：予定追加UI

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open:
http://localhost:3000/schedule
