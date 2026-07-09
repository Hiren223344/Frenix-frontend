import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Uttam Code — The AI Coding Agent by Uttam AI",
    description:
        "Uttam Code is a professional, AI-powered development environment built by Uttam AI, the AI research company behind the models that ship inside it. Uttam AI is a subsidiary of Frenix.",
    keywords: [
        "Uttam Code",
        "Uttam AI",
        "Uttamai",
        "Frenix",
        "AI coding agent",
        "developer tools",
        "AI IDE",
    ],
    openGraph: {
        title: "Uttam Code — The AI Coding Agent by Uttam AI",
        description:
            "Uttam Code is the professional, AI-powered development environment built by Uttam AI and served through the Frenix AI Gateway.",
        url: "https://www.frenix.sh/uttam-code",
        siteName: "Frenix",
        type: "website",
    },
};

export default function UttamCodePage() {
    return (
        <div
            style={{
                background: "var(--bg)",
                minHeight: "100vh",
                transition: "background-color 0.3s",
            }}
        >
            <div
                style={{
                    maxWidth: "880px",
                    margin: "0 auto",
                    padding: "80px 24px",
                }}
            >
                <Link
                    href="/"
                    style={{
                        color: "var(--primary)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "32px",
                        fontWeight: "600",
                    }}
                >
                    ← Back to Home
                </Link>

                {/* Hero */}
                <div
                    style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        borderRadius: "999px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        fontSize: "12px",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        color: "var(--primary)",
                        marginBottom: "20px",
                    }}
                >
                    Product
                </div>

                <h1
                    style={{
                        fontSize: "56px",
                        fontWeight: "800",
                        marginBottom: "16px",
                        letterSpacing: "-2.5px",
                        color: "var(--text-main)",
                        lineHeight: 1.05,
                    }}
                >
                    Uttam Code
                </h1>

                <p
                    style={{
                        fontSize: "20px",
                        lineHeight: 1.6,
                        color: "var(--text-main)",
                        opacity: 0.85,
                        marginBottom: "48px",
                        maxWidth: "720px",
                    }}
                >
                    A professional, AI-powered development environment built
                    by <strong>Uttam AI</strong> — the AI research company
                    that designs the models behind it. Uttam AI is a
                    subsidiary of <strong>Frenix</strong>, and the agent is
                    served through the <strong>Frenix AI Gateway</strong>.
                </p>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "56px",
                        color: "var(--text-main)",
                        lineHeight: 1.8,
                    }}
                >
                    {/* What it is */}
                    <section>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "800",
                                marginBottom: "20px",
                                color: "var(--primary)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            What is Uttam Code?
                        </h2>
                        <p>
                            Uttam Code is a desktop and terminal development
                            environment that puts an AI coding agent directly
                            inside the tools developers already use. It runs in
                            the IDE and command line, where the agent can read
                            files, run commands, plan changes, and ship code
                            alongside the human on the keyboard.
                        </p>
                        <p style={{ marginTop: "16px" }}>
                            The agent itself is built by{" "}
                            <strong>Uttam AI</strong> (uttamai.in), an AI
                            research company that designs and trains its own
                            models — in the spirit of companies like
                            Anthropic. Uttam AI operates as a subsidiary of{" "}
                            <strong>Frenix</strong> (frenix.sh), the parent
                            company, and the agent is served to users through
                            the <strong>Frenix AI Gateway</strong> — the
                            unified routing layer that handles failover,
                            observability, and the global edge behind every
                            request.
                        </p>
                    </section>

                    {/* What the agent does */}
                    <section>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "800",
                                marginBottom: "20px",
                                color: "var(--primary)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            What the Agent Does
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {[
                                {
                                    title: "Writes Code",
                                    body: "Scaffolds features, components, API routes, and full apps from a prompt, matching the project's existing style.",
                                },
                                {
                                    title: "Fixes Bugs",
                                    body: "Investigates failing tests, traces stack traces, and ships targeted fixes without rewriting parts that already work.",
                                },
                                {
                                    title: "Refactors Safely",
                                    body: "Restructures large files and modules with minimal, reviewable diffs. Plans before cutting.",
                                },
                                {
                                    title: "Explains Codebases",
                                    body: "Walks through unfamiliar systems, documents legacy modules, and answers deep questions about how things work.",
                                },
                                {
                                    title: "Runs Commands",
                                    body: "Builds, tests, installs, migrates, and deploys. Prefers dedicated tools over raw shell, and treats destructive operations with care.",
                                },
                                {
                                    title: "Orchestrates Work",
                                    body: "Plans, tracks, and ships multi-step changes with task tracking, subagents, and background processes.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{
                                        padding: "24px",
                                        borderRadius: "24px",
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            marginBottom: "12px",
                                            color: "var(--text-main)",
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p style={{ fontSize: "14px", opacity: 0.8 }}>
                                        {item.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* How it behaves */}
                    <section>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "800",
                                marginBottom: "20px",
                                color: "var(--primary)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            How It Behaves
                        </h2>
                        <ul
                            style={{
                                paddingLeft: "24px",
                                listStyleType: "disc",
                                display: "flex",
                                flexDirection: "column",
                                gap: "14px",
                            }}
                        >
                            <li>
                                <strong>Direct, not chatty.</strong> Skips
                                preamble and leads with the answer.
                            </li>
                            <li>
                                <strong>Plans before it cuts.</strong> For
                                non-trivial changes, it weighs reversibility,
                                blast radius, and the right tool for the job.
                            </li>
                            <li>
                                <strong>Matches the codebase.</strong> Reads
                                files before editing, follows naming
                                conventions, and prefers minimal diffs over
                                rewrites.
                            </li>
                            <li>
                                <strong>Runs tools in parallel.</strong> When
                                commands are independent, they run together
                                rather than in series.
                            </li>
                            <li>
                                <strong>Stays in scope.</strong> Does exactly
                                what is asked — nothing more, nothing less —
                                and surfaces conflicts instead of silently
                                resolving them.
                            </li>
                        </ul>
                    </section>

                    {/* Guardrails */}
                    <section>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "800",
                                marginBottom: "20px",
                                color: "var(--primary)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Safety Guardrails
                        </h2>
                        <ul
                            style={{
                                paddingLeft: "24px",
                                listStyleType: "disc",
                                display: "flex",
                                flexDirection: "column",
                                gap: "14px",
                            }}
                        >
                            <li>
                                No unrequested features, abstractions, or
                                refactors.
                            </li>
                            <li>
                                No hardcoded secrets, SQL concatenation, plain
                                passwords, or HTTP in production paths.
                            </li>
                            <li>
                                No silent scope expansion. If instructions
                                conflict, the agent surfaces it and asks.
                            </li>
                            <li>
                                No destructive commands without confirmation —
                                reversible actions are preferred.
                            </li>
                            <li>
                                No commits, pushes, or force operations
                                without an explicit ask.
                            </li>
                        </ul>
                    </section>

                    {/* Who built it */}
                    <section>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "800",
                                marginBottom: "20px",
                                color: "var(--primary)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Who Built It
                        </h2>
                        <p>
                            <strong>Uttam AI</strong> (uttamai.in) is an AI
                            research company that designs, trains, and
                            ships its own models — the same way Anthropic
                            builds Claude, or OpenAI builds GPT. It is a
                            subsidiary of <strong>Frenix</strong>{" "}
                            (frenix.sh), the parent company that provides
                            the infrastructure, distribution, and the{" "}
                            <strong>Frenix AI Gateway</strong> through which
                            Uttam Code reaches developers around the world.
                        </p>
                        <p style={{ marginTop: "16px" }}>
                            Together: Uttam AI makes the intelligence.
                            Frenix ships it.
                        </p>
                    </section>

                    {/* CTA */}
                    <section>
                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "800",
                                marginBottom: "20px",
                                color: "var(--primary)",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Get Started
                        </h2>
                        <p>
                            Install Uttam Code, open a terminal in your
                            project, and start a session. The agent will read
                            the codebase, plan a change, and ship it.
                        </p>
                        <div
                            style={{
                                marginTop: "32px",
                                display: "flex",
                                gap: "16px",
                                flexWrap: "wrap",
                            }}
                        >
                            <Link
                                href="/"
                                style={{
                                    padding: "16px 32px",
                                    background: "var(--primary)",
                                    color: "black",
                                    borderRadius: "16px",
                                    fontWeight: "800",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    fontSize: "14px",
                                    display: "inline-block",
                                }}
                            >
                                Back to Home
                            </Link>
                            <Link
                                href="/pricing"
                                style={{
                                    padding: "16px 32px",
                                    background: "var(--bg-card)",
                                    color: "var(--text-main)",
                                    borderRadius: "16px",
                                    fontWeight: "800",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                See Pricing
                            </Link>
                        </div>
                    </section>

                    <p
                        style={{
                            color: "var(--text-muted)",
                            fontSize: "14px",
                            marginTop: "40px",
                            borderTop: "1px solid var(--border)",
                            paddingTop: "32px",
                            textAlign: "center",
                        }}
                    >
                        © 2026 Uttam AI · A subsidiary of Frenix
                    </p>
                </div>
            </div>
        </div>
    );
}
