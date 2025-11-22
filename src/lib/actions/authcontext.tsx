"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth"; // Importar signOut
import { auth } from "@/lib/firestore/firebaseconfig";
import { FirebaseError } from "firebase/app";

// NÃO PRECISAMOS MAIS DA signOutAction
// import { signOutAction } from "@/lib/actions/useauth"; 

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- FUNÇÃO LOGOUT CORRIGIDA ---
  const logout = async () => {
    try {
      await signOut(auth); // Chama o signOut do CLIENTE
      return { success: true };
    } catch (error) {
      let errorMessage = "Erro ao fazer logout.";
      if (error instanceof FirebaseError) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};