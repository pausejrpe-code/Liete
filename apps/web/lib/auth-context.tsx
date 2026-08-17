"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createSupabaseBrowserClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";
import { withBasePath } from "./site-path";
import type { ProfileRecord } from "./db/types";

export type AuthUser = {
  email?: string;
  id: string;
  user_metadata?: Record<string, unknown>;
};

export type AuthContextType = {
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: ProfileRecord | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextType>({
  error: null,
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  refresh: async () => {},
  signOut: async () => {},
  user: null
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(withBasePath("/api/auth/me"), { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setProfile(data.profile || null);
          setError(null);
          return;
        }
      }
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      setError(err?.message || "Erro ao consultar sessão.");
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    if (isSupabaseConfigured()) {
      try {
        const supabase = createSupabaseBrowserClient();
        const { credentialsListener } = {
          credentialsListener: supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
              fetchSession();
            } else if (event === "SIGNED_OUT") {
              setUser(null);
              setProfile(null);
              setIsLoading(false);
            }
          })
        };

        return () => {
          credentialsListener.data.subscription.unsubscribe();
        };
      } catch {
        // Safe fallback
      }
    }
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await fetch(withBasePath("/api/auth/logout"), { method: "POST" });
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      window.location.assign(withBasePath("/entrar/"));
    } catch {
      window.location.assign(withBasePath("/entrar/"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        error,
        isAuthenticated: Boolean(user),
        isLoading,
        profile,
        refresh: fetchSession,
        signOut,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
