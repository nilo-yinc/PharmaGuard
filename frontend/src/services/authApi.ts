// ─── PharmaGuard Auth API Service ─────────────────────────────────────────
// Typed fetch wrapper for the Express auth backend at /api/v1/users/*
// All requests include credentials (JWT cookie) automatically.

const BASE = '/api/v1/users';

async function request<T>(
    method: string,
    path: string,
    body?: object
): Promise<{ ok: boolean; data?: T; error?: string }> {
    try {
        // Use stored JWT as Authorization header fallback (covers Google OAuth flow)
        const storedToken = localStorage.getItem('pg_jwt');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

        const res = await fetch(`${BASE}${path}`, {
            method,
            credentials: 'include',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();
        if (!res.ok) {
            return { ok: false, error: json.message || 'Request failed' };
        }
        return { ok: true, data: json };
    } catch (e: any) {
        return { ok: false, error: e.message || 'Network error' };
    }
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ApiUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePic?: string;
    role?: string;
    createdAt?: string;
    lastLogin?: string;
}

interface AuthResponse {
    status: boolean;
    message: string;
    token?: string;
    user?: ApiUser;
}

interface ProfileResponse {
    status: boolean;
    user?: ApiUser;
}

// ─── Auth Operations ────────────────────────────────────────────────────────

export async function apiRegister(name: string, email: string, password: string) {
    return request<AuthResponse>('POST', '/register', { name, email, password });
}

export async function apiLogin(email: string, password: string) {
    const result = await request<AuthResponse>('POST', '/login', { email, password });
    // Store JWT in localStorage as fallback (for cross-origin)
    if (result.ok && result.data?.token) {
        localStorage.setItem('pg_jwt', result.data.token);
    }
    return result;
}

export async function apiLogout() {
    localStorage.removeItem('pg_jwt');
    return request<{ status: boolean; message: string }>('POST', '/logout');
}

export async function apiGetProfile() {
    return request<ProfileResponse>('GET', '/get-profile');
}

export async function apiUpdateProfile(updates: { name?: string; phone?: string; profilePic?: string }) {
    return request<ProfileResponse>('PUT', '/update-profile', updates);
}
