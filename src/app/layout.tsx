import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Frenix | Premium AI Gateway & LLM Orchestration",
  description: "Frenix provides a unified API to access 150+ LLMs including OpenAI, Claude, and Gemini. Experience low-latency, dynamic routing, and secure AI management.",
  keywords: ["AI Gateway", "LLM Orchestration", "Unified API", "OpenAI Proxy", "AI Management", "Claude API", "Gemini API", "AI Infrastructure"],
  authors: [{ name: "Frenix Engineering Team", url: "https://frenix.sh/team" }],
  openGraph: {
    title: "Frenix | The Unified Gateway for Machine Intelligence",
    description: "Access every major LLM through one secure point. Dynamic routing, global edge proxy, and zero client changes.",
    url: "https://frenix.sh",
    siteName: "Frenix",
    images: [{ url: "https://frenix.sh/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "x8IDq7qRl8YDA9-OKGFYFbrBto9THBl9O-RXzMwclbc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <div className="gradient-bg" />
          <Toaster position="top-right" richColors />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Frenix AI Gateway",
                "operatingSystem": "Web, Linux, Windows, macOS",
                "applicationCategory": "DeveloperApplication",
                "description": "Unified AI Gateway providing a single endpoint for 150+ LLMs including OpenAI, Anthropic, and Google DeepMind.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Organization",
                  "name": "Frenix Infrastructure Group",
                  "url": "https://frenix.sh"
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is Frenix AI Gateway?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Frenix is a unified proxy that allows developers to access multiple AI model providers like OpenAI, Anthropic, and Google through a single, secure API endpoint with zero configuration changes."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does Frenix improve latency?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Frenix uses global edge routing and dynamic provider switching to ensure your requests are always handled by the fastest available node and model provider."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Frenix compatible with the OpenAI SDK?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Frenix is 100% compatible with the OpenAI SDK. Simply swap the base URL to api.frenix.sh/v1 to start routing traffic through the gateway."
                    }
                  }
                ]
              })
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
