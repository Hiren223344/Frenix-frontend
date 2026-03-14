/**
 * Gateway API helper
 * All calls go to the self-hosted AI Gateway (default: http://localhost:4000).
 */

const BASE = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:4000';
const SERVICE_KEY = process.env.GATEWAY_SERVICE_KEY || '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GatewayStats {
    email: string | null;
    tier: string;
    keyPrefix: string;
    fullKey?: string;
    plainKey?: string;
    status: string;
    createdAt: string;
    lastUsedAt: string | null;
    stats: {
        totalRequests: number;
        successRequests: number;
        failedRequests: number;
        tokens: { prompt: number; completion: number; total: number };
        totalCostUsd: number;
        operations: {
            imageGenerations: number;
            imageEdits: number;
            imageVariations: number;
            audioSpeeches: number;
            transcriptions: number;
            translations: number;
            embeddings: number;
            moderations: number;
        };
        modelsUsed: Record<string, number>;
        providersUsed: Record<string, number>;
        endpointsUsed: Record<string, number>;
    };
}

export interface CreateKeyResult {
    key: string;
    tier: string;
    email?: string;
    name?: string;
    message: string;
}

// ─── Fetch stats for an existing key ─────────────────────────────────────────

export async function fetchStats(apiKey: string): Promise<GatewayStats> {
    const res = await fetch(`${BASE}/v1/keys/stats`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// ─── Fetch key info by email (Dashboard fallback) ───────────────────────────

export async function fetchStatsByEmail(email: string): Promise<GatewayStats> {
    const res = await fetch(`${BASE}/v1/keys/email/${encodeURIComponent(email)}`, {
        headers: SERVICE_KEY ? { Authorization: `Bearer ${SERVICE_KEY}` } : {},
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// ─── Create a new key for a user ─────────────────────────────────────────────

export async function createGatewayKey(params: {
    email?: string;
    name?: string;
    lastName?: string;
    username?: string;
}): Promise<CreateKeyResult> {
    const res = await fetch(`${BASE}/v1/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
        // 409 = user already has a key
        throw Object.assign(new Error(body.message || `HTTP ${res.status}`), { status: res.status, body });
    }

    return body;
}

// ─── Admin Functions ─────────────────────────────────────────────────────────

export async function adminFetchUsers(creds: { username: string; password: string }) {
    const auth = btoa(`${creds.username}:${creds.password}`);
    const res = await fetch(`${BASE}/v1/admin/users`, {
        headers: { Authorization: `Basic ${auth}` },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
    }

    return res.json();
}

export async function adminUpgradeUser(creds: { username: string; password: string }, userId: string, tier: string) {
    const auth = btoa(`${creds.username}:${creds.password}`);
    const res = await fetch(`${BASE}/v1/admin/upgrade`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`
        },
        body: JSON.stringify({ userId, tier }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
    }

    return res.json();
}

export async function adminUpdateUserStatus(creds: { username: string; password: string }, userId: string, status: string) {
    const auth = btoa(`${creds.username}:${creds.password}`);
    const res = await fetch(`${BASE}/v1/admin/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`
        },
        body: JSON.stringify({ userId, status }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
    }

    return res.json();
}
