import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.frenix.sh'

    const blogSlugs = [
        "apache-bench-performance-report",
        "axion-1-5-pro-free-swe-bench-2",
        "axion-1-5-pro-swe-bench-2",
        "axion-daily-startup-guide",
        "axion-everyday-debugging-playbook",
        "axion-everyday-use-prompts",
        "axion-everyday-workflow-guide",
        "axion-vs-claude-opus-4-5",
        "axion-vs-claude-opus-4-6",
        "axion-vs-claude-sonnet-4-6",
        "axion-vs-gemini-2-5-pro",
        "axion-vs-gemini-3-1-pro",
        "axion-vs-gemini-3-1-pro-advanced",
        "axion-vs-gemini-3-pro",
        "axion-vs-glm-5",
        "axion-vs-gpt-4-1",
        "axion-vs-gpt-5",
        "axion-vs-gpt-5-4",
        "axion-vs-grok-code-fast-1",
        "axion-vs-kimi-k2-5",
        "axion-vs-qwen3-5-plus",
        "axion-vs-qwen3-coder-next",
        "building-ai-agents",
        "future-of-llm",
        "gdpr-and-data-residency",
        "multi-tenant-ai-architecture",
        "pii-redaction-at-the-edge",
        "rbac-in-ai-gateways",
        "semantic-caching-deep-dive",
        "soc2-compliance-guide",
        "top-5-ai-gateways-2026",
        "webhook-driven-ai-workflows",
        "whats-frenix",
        "why-frenix",
        "sponsored-by-exa"
    ]

    const staticPages = [
        // Core pages
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
        { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
        { url: `${baseUrl}/models`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${baseUrl}/status`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.6 },
        { url: `${baseUrl}/billing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
        { url: `${baseUrl}/playground`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },

        // SEO Landing Pages
        { url: `${baseUrl}/ai-gateway`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.95 },
        { url: `${baseUrl}/llm-gateway`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.95 },
        { url: `${baseUrl}/openai-compatible-api`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },

        // Comparison Pages
        { url: `${baseUrl}/compare/openrouter-alternative`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 },

        // Use Case Pages
        { url: `${baseUrl}/use-cases/startups`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/use-cases/agents`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },

        // Integration Pages
        { url: `${baseUrl}/integrations/openai`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${baseUrl}/integrations/anthropic`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
        
        // Dynamic Blog Posts
        ...blogSlugs.map(slug => ({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))
    ]

    return staticPages
}