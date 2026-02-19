import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [
        heroui({
        themes: {
            light: {
            colors: {
                primary: "#1C7F86",
            },
            },
        },
        }),
    ],
} satisfies Config;
