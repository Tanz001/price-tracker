import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../types';

const STORAGE_KEY_USER = 'priceradar_auth_user_v1';
const STORAGE_KEY_USERS = 'priceradar_registered_users_v1';

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr_demo',
    name: 'Alex Shopper',
    email: 'shopper@example.com',
    password: 'demo1234',
    role: 'user',
    createdAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 'usr_admin',
    name: 'Jordan Admin',
    email: 'admin@priceradar.io',
    password: 'admin1234',
    role: 'admin',
    createdAt: '2026-08-01T08:00:00Z',
  },
];

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'PR';
}

function toUser(account: StoredAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    avatarInitials: initialsFromName(account.name),
    createdAt: account.createdAt,
  };
}

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAccount[];
      const emails = new Set(parsed.map((a) => a.email.toLowerCase()));
      const merged = [...parsed];
      for (const demo of DEMO_ACCOUNTS) {
        if (!emails.has(demo.email.toLowerCase())) merged.push(demo);
      }
      return merged;
    }
  } catch {
    // ignore
  }
  return [...DEMO_ACCOUNTS];
}

function saveAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Ensure demo accounts exist for first-time visitors
    saveAccounts(loadAccounts());
  }, []);

  const persistSession = useCallback((next: User | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY_USER);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 550));
    const accounts = loadAccounts();
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) {
      throw new Error('Invalid email or password');
    }
    const next = toUser(match);
    persistSession(next);
    return next;
  }, [persistSession]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 650));
    const accounts = loadAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const account: StoredAccount = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    saveAccounts([account, ...accounts]);
    const next = toUser(account);
    persistSession(next);
    return next;
  }, [persistSession]);

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
