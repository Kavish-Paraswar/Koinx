import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative z-10 select-none">
      {/* Decorative top ambient blur blobs */}
      <div className="absolute top-[-200px] left-[10%] w-[350px] h-[350px] bg-brand-accent/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[-100px] right-[10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main Navbar */}
      <nav className="border-b border-brand-border/60 bg-brand-bg/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* KoinX Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center shadow-glow shadow-brand-accent/40 animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-brand-text leading-tight tracking-tight">
                  Koin<span className="text-brand-accent">X</span>
                </span>
                <span className="text-[10px] font-semibold text-brand-textMuted tracking-wider uppercase leading-none">
                  Tax Optimizer
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#" className="text-brand-text hover:text-brand-accent transition-colors">Dashboard</a>
              <a href="#" className="text-brand-textMuted hover:text-brand-accent transition-colors">Portfolios</a>
              <a href="#" className="text-brand-textMuted hover:text-brand-accent transition-colors">Tax Reports</a>
              <a href="#" className="text-brand-textMuted hover:text-brand-accent transition-colors">Settings</a>
            </div>

            {/* Right-side Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-brand-border/50 text-[11px] font-semibold text-indigo-300">
                <Shield className="w-3.5 h-3.5" />
                <span>Broker Secure</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Application Container */}
      <main className="flex-1 flex flex-col py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border/60 bg-slate-950/40 py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-brand-textMuted">
          <p>© {new Date().getFullYear()} KoinX. Built for simulated tax loss harvesting optimization.</p>
        </div>
      </footer>
    </div>
  );
};
