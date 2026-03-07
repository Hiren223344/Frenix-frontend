/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                "primary-foreground": "var(--primary-foreground)",
                secondary: "var(--secondary)",
                "secondary-foreground": "var(--secondary-foreground)",
                accent: "var(--accent)",
                "accent-foreground": "var(--accent-foreground)",
                warning: "var(--warning)",
                destructive: "var(--destructive)",
                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",
                ring: "var(--ring)",
                input: "var(--input)",
                "bg-soft": "var(--bg-soft)",
                "bg-card": "var(--bg-card)",
                "text-main": "var(--text-main)",
                "text-muted": "var(--text-muted)",
                border: "var(--border)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
