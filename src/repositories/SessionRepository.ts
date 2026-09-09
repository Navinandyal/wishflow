/**
 * Session Repository: Manages authenticated sessions, role claims, and token lifecycle
 */

import { StoredUser, UserSession, UserRole, User } from '../types';
import { generateSessionToken } from '../utils/crypto';

export interface ISessionRepository {
  createSession(user: StoredUser, targetRole?: UserRole): Promise<UserSession>;
  getActiveSession(): Promise<UserSession | null>;
  getSessionByToken(token: string): Promise<UserSession | null>;
  updateSessionRole(token: string, newRole: UserRole): Promise<UserSession | null>;
  revokeSession(token: string): Promise<void>;
  clearSession(): Promise<void>;
}

const SESSION_STORAGE_KEY = 'wishflow_active_session_v2';
const SESSIONS_HISTORY_KEY = 'wishflow_session_history_v2';
const SESSION_DURATION_DAYS = 7;

export class LocalStorageSessionRepository implements ISessionRepository {
  private sanitizeUser(stored: StoredUser, activeRole: UserRole): User {
    return {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      mobile: stored.mobile,
      role: activeRole,
      avatarUrl: stored.avatarUrl,
      twoFactorEnabled: stored.twoFactorEnabled,
    };
  }

  async createSession(user: StoredUser, targetRole?: UserRole): Promise<UserSession> {
    const activeRole = targetRole || user.role;
    const token = generateSessionToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    const session: UserSession = {
      token,
      userId: user.id,
      user: this.sanitizeUser(user, activeRole),
      role: activeRole,
      tenantId: user.tenantId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastActiveAt: now.toISOString(),
      ipAddress: '49.36.14.89 (Asia/Kolkata)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'WishFlow Client',
    };

    // Save active session
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

      // Append to session history log
      const historyRaw = localStorage.getItem(SESSIONS_HISTORY_KEY);
      const history: UserSession[] = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift(session);
      // Keep last 20 sessions
      localStorage.setItem(SESSIONS_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.error('Failed to store session in localStorage:', e);
    }

    return session;
  }

  async getActiveSession(): Promise<UserSession | null> {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const session: UserSession = JSON.parse(raw);
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      // Check if session has expired
      if (now > expiresAt) {
        await this.clearSession();
        return null;
      }

      // Touch lastActiveAt
      session.lastActiveAt = now.toISOString();
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return session;
    } catch (e) {
      console.error('Failed to retrieve active session:', e);
      return null;
    }
  }

  async getSessionByToken(token: string): Promise<UserSession | null> {
    const active = await this.getActiveSession();
    if (active && active.token === token) {
      return active;
    }
    return null;
  }

  async updateSessionRole(token: string, newRole: UserRole): Promise<UserSession | null> {
    const session = await this.getActiveSession();
    if (!session || session.token !== token) {
      return null;
    }

    session.role = newRole;
    session.user.role = newRole;
    session.lastActiveAt = new Date().toISOString();

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to update session role:', e);
    }

    return session;
  }

  async revokeSession(token: string): Promise<void> {
    const active = await this.getActiveSession();
    if (active && active.token === token) {
      await this.clearSession();
    }
  }

  async clearSession(): Promise<void> {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session:', e);
    }
  }
}

// Singleton session repository instance
export const sessionRepository: ISessionRepository = new LocalStorageSessionRepository();
