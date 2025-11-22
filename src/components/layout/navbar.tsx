"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/actions/authcontext";
import { LogIn, LogOut, UserPlus, Moon, Sun, X, Menu } from "lucide-react"; // Importe X e Menu
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kanban", label: "Quadro" },
  { href: "/calendar", label: "Calendário" },
];

// --- Componente de Botão do Tema ---
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 p-2" />; 
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      aria-label="Mudar tema"
    >
      {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

// --- Componente Principal da Navbar ---
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      {/* Links desktop */}
      <div className="hidden md:flex items-center gap-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Botões do lado direito (Desktop) */}
      <div className="hidden md:flex items-center gap-x-4">
        <ThemeToggle /> 

        {!user && (
          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm 
              transition-transform duration-300 hover:scale-105"
          >
            <UserPlus size={18} />
            Cadastrar
          </Link>
        )}

        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm 
              transition-transform duration-300 hover:scale-105"
          >
            <LogOut size={18} />
            Sair
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-md border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm 
              transition-transform duration-300 hover:scale-105"
          >
            <LogIn size={18} />
            Entrar
          </Link>
        )}
      </div>

      {/* Botão Menu mobile */}
      <div className="md:hidden flex items-center gap-x-2">
        <ThemeToggle />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {/* ESTA É A LINHA CORRIGIDA */}
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 top-16 w-full bg-white dark:bg-slate-800 shadow-md md:hidden
            flex flex-col items-center p-4 gap-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

        {/* Botões Mobile */}
          {user ? (
            <button
      _       onClick={() => { logout(); setIsOpen(false); }}
              className="flex items-center justify-center gap-2 w-full rounded-md bg-red-500 px-4 py-2 text-lg font-semibold text-white shadow-sm"
            >
              <LogOut size={20} />
              Sair
            </button>
          ) : (
          <>
            <Link
              href="/signup"
              className="w-full text-center rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Cadastrar
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full rounded-md border border-indigo-600 px-4 py-2 text-lg font-semibold text-indigo-600 shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={20} />
              Entrar
            </Link>
          </>
          )}
        </div>
      )}
    </nav>
  );
}