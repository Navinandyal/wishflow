/**
 * User Repository: Handles persistence, retrieval, and registration of user records
 * Supports local storage caching with pre-seeded hashed credentials for role testing.
 */

import { StoredUser, UserRole } from '../types';
import { hashPassword } from '../utils/crypto';

export interface IUserRepository {
  getAll(): Promise<StoredUser[]>;
  findById(id: string): Promise<StoredUser | null>;
  findByEmail(email: string): Promise<StoredUser | null>;
  findByMobile(mobile: string): Promise<StoredUser | null>;
  findByIdentifier(identifier: string): Promise<StoredUser | null>;
  create(userData: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser>;
  update(id: string, updates: Partial<StoredUser>): Promise<StoredUser>;
  delete(id: string): Promise<boolean>;
  resetToDefaultUsers(): Promise<void>;
}

const USERS_STORAGE_KEY = 'wishflow_users_v2';

// Known initial salt & hash for demo password: "password123"
// Generated via PBKDF2 (SHA-256)
const DEMO_SALT = 'e4a8b7c3d2e1f09876543210abcdef12';
const DEMO_PASSWORD_HASH = '9f83ac63eedf4f10037a3c3e2e811f58b760a5e8f495ec9bc4b3a4a905a5a120';

const DEFAULT_STORED_USERS: StoredUser[] = [
  {
    id: 'usr_rajesh_kulkarni',
    name: 'Dr. Rajesh Kulkarni',
    email: 'dr.rajesh@sunrisedental.in',
    mobile: '+91 98220 14589',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    tenantId: 'tnt_sunrise_dental',
    passwordHash: DEMO_PASSWORD_HASH,
    passwordSalt: DEMO_SALT,
    createdAt: '2024-03-15T08:00:00.000Z',
    status: 'active',
  },
  {
    id: 'usr_manager_anita',
    name: 'Anita More',
    email: 'manager@sunrisedental.in',
    mobile: '+91 98220 99887',
    role: 'manager',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    twoFactorEnabled: false,
    tenantId: 'tnt_sunrise_dental',
    passwordHash: DEMO_PASSWORD_HASH,
    passwordSalt: DEMO_SALT,
    createdAt: '2024-04-01T09:30:00.000Z',
    status: 'active',
  },
  {
    id: 'usr_staff_sneha',
    name: 'Sneha K (Receptionist)',
    email: 'reception@sunrisedental.in',
    mobile: '+91 98221 88776',
    role: 'staff',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813565-d0ff9e061805?w=150&auto=format&fit=crop&q=80',
    twoFactorEnabled: false,
    tenantId: 'tnt_sunrise_dental',
    passwordHash: DEMO_PASSWORD_HASH,
    passwordSalt: DEMO_SALT,
    createdAt: '2024-04-10T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'usr_superadmin',
    name: 'WishFlow Platform Admin',
    email: 'ops@wishflow.ai',
    mobile: '+91 99000 00001',
    role: 'superadmin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    twoFactorEnabled: true,
    tenantId: 'tnt_platform_ops',
    passwordHash: DEMO_PASSWORD_HASH,
    passwordSalt: DEMO_SALT,
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'active',
  },
];

export class LocalStorageUserRepository implements IUserRepository {
  private initialized = false;

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Check if initial users exist in storage
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Pre-seed default users with verified hash
      const seeded = await Promise.all(
        DEFAULT_STORED_USERS.map(async (u) => {
          const { hash, salt } = await hashPassword('password123');
          return { ...u, passwordHash: hash, passwordSalt: salt };
        })
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeded));
    }
    this.initialized = true;
  }

  private loadUsers(): StoredUser[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse stored users:', e);
    }
    return DEFAULT_STORED_USERS;
  }

  private saveUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist users to localStorage:', e);
    }
  }

  async getAll(): Promise<StoredUser[]> {
    await this.initialize();
    return this.loadUsers();
  }

  async findById(id: string): Promise<StoredUser | null> {
    await this.initialize();
    const users = this.loadUsers();
    return users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    await this.initialize();
    const normalized = email.trim().toLowerCase();
    const users = this.loadUsers();
    return users.find((u) => u.email.trim().toLowerCase() === normalized) || null;
  }

  async findByMobile(mobile: string): Promise<StoredUser | null> {
    await this.initialize();
    const cleanNumber = mobile.replace(/\D/g, '').slice(-10);
    const users = this.loadUsers();
    return (
      users.find((u) => {
        const uClean = u.mobile.replace(/\D/g, '').slice(-10);
        return uClean === cleanNumber;
      }) || null
    );
  }

  async findByIdentifier(identifier: string): Promise<StoredUser | null> {
    await this.initialize();
    const cleanId = identifier.trim().toLowerCase();
    if (cleanId.includes('@')) {
      return this.findByEmail(cleanId);
    }
    return this.findByMobile(cleanId);
  }

  async create(userData: Omit<StoredUser, 'id' | 'createdAt'>): Promise<StoredUser> {
    await this.initialize();
    const users = this.loadUsers();

    // Check uniqueness of email and mobile
    const emailLower = userData.email.trim().toLowerCase();
    const mobileDigits = userData.mobile.replace(/\D/g, '').slice(-10);

    const existingEmail = users.find((u) => u.email.trim().toLowerCase() === emailLower);
    if (existingEmail) {
      throw new Error(`An account with email ${userData.email} already exists.`);
    }

    const existingMobile = users.find((u) => u.mobile.replace(/\D/g, '').slice(-10) === mobileDigits);
    if (existingMobile) {
      throw new Error(`An account with mobile number ${userData.mobile} already exists.`);
    }

    const newUser: StoredUser = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  async update(id: string, updates: Partial<StoredUser>): Promise<StoredUser> {
    await this.initialize();
    const users = this.loadUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found.`);
    }

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    this.saveUsers(users);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await this.initialize();
    const users = this.loadUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    this.saveUsers(filtered);
    return true;
  }

  async resetToDefaultUsers(): Promise<void> {
    const seeded = await Promise.all(
      DEFAULT_STORED_USERS.map(async (u) => {
        const { hash, salt } = await hashPassword('password123');
        return { ...u, passwordHash: hash, passwordSalt: salt };
      })
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeded));
    this.initialized = true;
  }
}

// Singleton repository instance
export const userRepository: IUserRepository = new LocalStorageUserRepository();
