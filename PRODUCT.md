# Product

## Register

product

## Platform

web

## Users

Frenix serves two audiences, both first-class, because the product is the gateway itself and the site that sells it.

**Primary — engineers and builders, startup-led.** Developers, technical founders, CTOs, and platform/infra leads who need to route requests to 150+ LLMs through one endpoint without rewiring their app. Startups are the wedge and the volume: small teams shipping fast who want one API call, low latency, low cost, and zero infra burden. They arrive via comparison content ("Axion vs GPT-5", "OpenRouter alternative") and the playground. Their context: evaluating, integrating, and then living in the dashboard daily — keys, logs, usage, failover.

**Secondary — enterprise buyers and teams.** Larger orgs (security, compliance, platform teams) for whom the deciding factors are RBAC, key rotation, audit logs, PII redaction, zero data retention, and SOC2/GDPR posture. The marketing site has to carry the credibility that closes these deals, even though the daily user is still an engineer.

When the two conflict, optimize the story for the startup engineer first — they are the user and the advocate; the enterprise buyer is persuaded through proof the engineer already trusts.

## Product Purpose

Frenix is a high-performance AI gateway: one OpenAI-compatible REST endpoint that routes to 150+ models from OpenAI, Anthropic, Google, Meta, Mistral, Grok, and others, with latency-aware routing, smart failover during provider outages, and edge caching. It exists so teams never rewrite their model calls, never get locked to one provider, and never go dark when a provider does.

Success means: a developer lands on the homepage, believes the performance/security/reliability claims fast, and reaches the docs or playground with minimal friction to try it themselves. The marketing site and the dashboard are weighted equally — both must be exceptional, because the gateway is judged on both the promise and the daily reality.

## Positioning

The gateway you can trust with your data and your uptime — zero-retention by default, with routing intelligence that never lets a provider outage take you down.

## Brand Personality

Expert, calm, and fast. Three words: **precise, premium, trustworthy.** Frenix speaks like a senior infra engineer who has seen every provider fail at 3am — confident without hype, specific over vague ("842ms", "zero-retention", "150+ models" beat "blazing fast"). The interface should feel like a well-instrumented cockpit: tabular numbers, monospaced stats, restrained motion, dark by default. Calm authority — not playful, not shouty. Performance is shown, not claimed.

Emotional goal: a developer should feel "these people take latency and security as seriously as I do."

## Anti-references

- **Generic "blazing fast AI" SaaS** — gradient purple/violet hero text, sparkly bento cards with rocket emojis, hype superlatives with no numbers. Frenix earns trust with specifics.
- **OpenRouter / LiteLLM / Portkey visual defaults** — we are not trying to look like the category; we're trying to look like the premium option within it.
- **Cream/warm-paper backgrounds** — the saturated AI default of 2026. Frenix is a tool, dark and crisp, not a lifestyle magazine.
- **Excessive glassmorphism and gradient-text** — decorative blur and `background-clip: text` gradients read as templated, not engineered.
- **Dull, verbose, hype-laden copy.** Every claim should carry a number or be cut.

## Design Principles

- **Trust through specifics.** Every performance or security claim carries a real number (842ms, 150+, zero-retention, 99.99%). Vague superlatives are banned.
- **The instrument over the billboard.** Surfaces read like a calibrated cockpit — tabular monospaced metrics, restrained palette, motion that explains rather than entertains. Premium because it's precise.
- **Security is the product, so show it.** Zero-retention, key rotation, PII redaction, failover are first-class headline capabilities, not footer footnotes. The brand's point of difference is always visible.
- **Dark, calm, fast.** Dark-by-default, smooth (Lenis + eased) but never bouncy or distracting. Motion earns its place or it's removed.
- **One consistent system across both surfaces.** Marketing and dashboard share tokens, type, and components so the promise and the daily reality feel like one product.

## Accessibility & Inclusion

- Color contrast: body text ≥4.5:1, large/bold text ≥3:1 against background. The current `--text-muted` (#737373 light / #a1a1a1 dark) is a known risk on tinted surfaces — verify and bump toward ink where it falls short.
- Respect `prefers-reduced-motion`: Lenis smooth scroll, GSAP scroll triggers, beams, and reveal animations need instant/crossfade fallbacks.
- Keyboard-accessible overlays/modals (focus trap, Esc to close, focus return), adequate touch targets, and no color-only status signaling.
