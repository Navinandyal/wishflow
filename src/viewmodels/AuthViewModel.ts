/**
 * AuthViewModel: MVVM ViewModel for User Registration, Password Hashing, and Role-Based Sessions
 * Mediates between Views (LoginPage, RegisterPage) and Repositories (UserRepository, SessionRepository)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  StoredUser,
  UserSession,
  UserRole,
  RegistrationInput,
  AuthResult,
} from '../types';
import { userRepository, IUserRepository } from '../repositories/UserRepository';
import { sessionRepository, ISessionRepository } from '../repositories/SessionRepository';
import { hashPassword, verifyPassword, generateOtp } from '../utils/crypto';

export interface DemoAccount {
  label: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  passwordHint: string;
  roleDescription: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Dr. Rajesh Kulkarni',
    name: 'Dr. Rajesh Kulkarni',
    email: 'dr.rajesh@sunrisedental.in',
    mobile: '9822014589',
    role: 'owner',
    passwordHint: 'password123',
    roleDescription: 'Clinic Owner • Full Access (WABA API, Billing, Exports, Team)',
  },
  {
    label: 'Anita More',
    name: 'Anita More',
    email: 'manager@sunrisedental.in',
    mobile: '9822099887',
    role: 'manager',
    passwordHint: 'password123',
    roleDescription: 'Operations Manager • Customer DB, Templates & Schedule Approvals',
  },
  {
    label: 'Sneha K (Front Desk)',
    name: 'Sneha K (Receptionist)',
    email: 'reception@sunrisedental.in',
    mobile: '9822188776',
    role: 'staff',
    passwordHint: 'password123',
    roleDescription: 'Front Desk Staff • Daily Birthday Radar & Assisted WhatsApp Send',
  },
  {
    label: 'WishFlow Platform Ops',
    name: 'WishFlow Platform Admin',
    email: 'ops@wishflow.ai',
    mobile: '9900000001',
    role: 'superadmin',
    passwordHint: 'password123',
    roleDescription: 'SuperAdmin • Multi-Tenant Console, Feature Flags, WABA Health & Audit Stream',
  },
];

export interface AuthViewModelState {
  currentUser: User | null;
  currentSession: UserSession | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  demoAccounts: DemoAccount[];
}

export interface AuthViewModelActions {
  register: (input: RegistrationInput) => Promise<AuthResult>;
  loginWithPassword: (identifier: string, password: string) => Promise<AuthResult>;
  loginWithOtp: (mobile: string, otpCode: string) => Promise<AuthResult>;
  sendOtp: (mobile: string) => Promise<{ success: boolean; demoOtp: string; message: string }>;
  switchRole: (role: UserRole) => Promise<AuthResult>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

export type AuthViewModel = AuthViewModelState & AuthViewModelActions;

export function useAuthViewModel(
  userRepo: IUserRepository = userRepository,
  sessionRepo: ISessionRepository = sessionRepository
): AuthViewModel {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore active session on mount
  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await sessionRepo.getActiveSession();
      if (session) {
        setCurrentSession(session);
        setCurrentUser(session.user);
      } else {
        setCurrentSession(null);
        setCurrentUser(null);
      }
    } catch (err: any) {
      console.error('Failed to restore session in ViewModel:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionRepo]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * User Registration with PBKDF2 Secure Password Hashing
   */
  const register = useCallback(
    async (input: RegistrationInput): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validation
        if (!input.name.trim()) {
          throw new Error('Full name is required.');
        }
        if (!input.email.includes('@') || !input.email.includes('.')) {
          throw new Error('Please enter a valid email address.');
        }
        const cleanMobile = input.mobile.replace(/\D/g, '');
        if (cleanMobile.length < 10) {
          throw new Error('Please enter a valid 10-digit Indian mobile number.');
        }
        if (input.password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (!input.businessName.trim()) {
          throw new Error('Business or practice name is required.');
        }

        // Check if user already exists
        const existingEmail = await userRepo.findByEmail(input.email);
        if (existingEmail) {
          throw new Error(`An account with email ${input.email} already exists.`);
        }
        const existingMobile = await userRepo.findByMobile(input.mobile);
        if (existingMobile) {
          throw new Error(`An account with mobile number ${input.mobile} already exists.`);
        }

        // Secure password hashing with PBKDF2 + cryptographic salt
        const { hash, salt } = await hashPassword(input.password);

        const targetRole: UserRole = input.role || 'owner';
        const tenantId = `tnt_${input.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;

        // Create stored user in repository
        const storedUser = await userRepo.create({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          mobile: `+91 ${cleanMobile.slice(-10)}`,
          role: targetRole,
          passwordHash: hash,
          passwordSalt: salt,
          tenantId,
          status: 'active',
          twoFactorEnabled: false,
        });

        // Create role-based authenticated session
        const session = await sessionRepo.createSession(storedUser, targetRole);

        setCurrentSession(session);
        setCurrentUser(session.user);

        return {
          success: true,
          user: session.user,
          session,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Registration failed. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [userRepo, sessionRepo]
  );

  /**
   * Password Authentication with Hash Verification
   */
  const loginWithPassword = useCallback(
    async (identifier: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!identifier.trim()) {
          throw new Error('Please enter your mobile number or email.');
        }
        if (!password) {
          throw new Error('Please enter your password.');
        }

        const storedUser = await userRepo.findByIdentifier(identifier);
        if (!storedUser) {
          throw new Error('No registered account found with that email or mobile number.');
        }

        if (storedUser.status !== 'active') {
          throw new Error('This account has been suspended or is pending review.');
        }

        // Verify password against stored PBKDF2 hash and unique salt
        const isValid = await verifyPassword(
          password,
          storedUser.passwordHash,
          storedUser.passwordSalt
        );

        if (!isValid) {
          throw new Error('Incorrect password. Please verify your credentials.');
        }

        // Create authenticated session with user's role
        const session = await sessionRepo.createSession(storedUser, storedUser.role);
        setCurrentSession(session);
        setCurrentUser(session.user);

        // Update last login timestamp
        await userRepo.update(storedUser.id, {
          lastLoginAt: new Date().toISOString(),
        });

        return {
          success: true,
          user: session.user,
          session,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Login failed. Please check your credentials.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [userRepo, sessionRepo]
  );

  /**
   * Send OTP Simulator for Indian Mobile Numbers
   */
  const sendOtp = useCallback(
    async (mobile: string): Promise<{ success: boolean; demoOtp: string; message: string }> => {
      setError(null);
      const clean = mobile.replace(/\D/g, '');
      if (clean.length < 10) {
        const msg = 'Please enter a valid 10-digit mobile number.';
        setError(msg);
        return { success: false, demoOtp: '', message: msg };
      }

      // Generate verification OTP code
      const generated = generateOtp(6);
      return {
        success: true,
        demoOtp: generated,
        message: `OTP sent successfully to +91 ${clean.slice(-10)}.`,
      };
    },
    []
  );

  /**
   * OTP Authentication (Passwordless Login)
   */
  const loginWithOtp = useCallback(
    async (mobile: string, otpCode: string): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const cleanMobile = mobile.replace(/\D/g, '');
        if (cleanMobile.length < 10) {
          throw new Error('Please enter a valid 10-digit Indian mobile number.');
        }

        const cleanOtp = otpCode.trim();
        if (cleanOtp.length < 4) {
          throw new Error('Please enter the valid OTP verification code.');
        }

        // Match user by mobile in repository
        let storedUser = await userRepo.findByMobile(cleanMobile);

        // If user doesn't exist yet, check demo accounts or create default account
        if (!storedUser) {
          const matchedDemo = DEMO_ACCOUNTS.find(
            (d) => d.mobile.replace(/\D/g, '').slice(-10) === cleanMobile.slice(-10)
          );

          if (matchedDemo) {
            storedUser = await userRepo.findByIdentifier(matchedDemo.email);
          }
        }

        if (!storedUser) {
          // Auto-provision basic owner account for quick onboarding
          const { hash, salt } = await hashPassword('password123');
          storedUser = await userRepo.create({
            name: `User ${cleanMobile.slice(-4)}`,
            email: `user_${cleanMobile.slice(-4)}@wishflow.demo`,
            mobile: `+91 ${cleanMobile.slice(-10)}`,
            role: 'owner',
            passwordHash: hash,
            passwordSalt: salt,
            tenantId: `tnt_${cleanMobile.slice(-4)}`,
            status: 'active',
            twoFactorEnabled: false,
          });
        }

        // Establish role-based session
        const session = await sessionRepo.createSession(storedUser, storedUser.role);
        setCurrentSession(session);
        setCurrentUser(session.user);

        return {
          success: true,
          user: session.user,
          session,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'OTP Verification failed.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [userRepo, sessionRepo]
  );

  /**
   * Role Switching for Active Session (RBAC Session Claim Update)
   */
  const switchRole = useCallback(
    async (newRole: UserRole): Promise<AuthResult> => {
      setIsLoading(true);
      try {
        if (!currentSession) {
          // If no active session, find demo user for that role
          const demo = DEMO_ACCOUNTS.find((d) => d.role === newRole) || DEMO_ACCOUNTS[0];
          const stored = await userRepo.findByIdentifier(demo.email);
          if (stored) {
            const newSession = await sessionRepo.createSession(stored, newRole);
            setCurrentSession(newSession);
            setCurrentUser(newSession.user);
            return { success: true, user: newSession.user, session: newSession };
          }
          throw new Error(`Unable to activate session for role ${newRole}`);
        }

        const updatedSession = await sessionRepo.updateSessionRole(currentSession.token, newRole);
        if (!updatedSession) {
          throw new Error('Failed to update session role');
        }

        setCurrentSession(updatedSession);
        setCurrentUser(updatedSession.user);

        return {
          success: true,
          user: updatedSession.user,
          session: updatedSession,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to switch role session.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, userRepo, sessionRepo]
  );

  /**
   * Logout and Session Revocation
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (currentSession) {
        await sessionRepo.revokeSession(currentSession.token);
      } else {
        await sessionRepo.clearSession();
      }
      setCurrentSession(null);
      setCurrentUser(null);
    } catch (err) {
      console.error('Error during session logout:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, sessionRepo]);

  const currentRole: UserRole = currentSession?.role || currentUser?.role || 'owner';
  const isAuthenticated = !!currentUser && !!currentSession;

  return {
    currentUser,
    currentSession,
    currentRole,
    isAuthenticated,
    isLoading,
    error,
    demoAccounts: DEMO_ACCOUNTS,
    register,
    loginWithPassword,
    loginWithOtp,
    sendOtp,
    switchRole,
    logout,
    clearError,
    refreshSession,
  };
}
