/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppScreen, User } from '../types';
import { Menu, X, LogOut, User as UserIcon, Calendar, Compass, Grid, Sparkles, Briefcase, Settings, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen | any) => void;
  currentUser: User | null;
  logout: () => void;
  setSelectedModelId?: (id: string | null) => void;
  setSelectedBusinessId?: (id: string | null) => void;
}

export default function Header({
  currentScreen,
  setCurrentScreen,
  currentUser,
  logout,
  setSelectedModelId,
  setSelectedBusinessId
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (screen: AppScreen) => {
    if (setSelectedModelId) setSelectedModelId(null);
    if (setSelectedBusinessId) setSelectedBusinessId(null);
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
  };

  const handleGoToMyProfile = () => {
    if (!currentUser) return;
    if (currentUser.role === 'model') {
      if (setSelectedModelId) setSelectedModelId(currentUser.id);
      setCurrentScreen('profile');
    } else {
      if (setSelectedBusinessId) setSelectedBusinessId(currentUser.id);
      setCurrentScreen('business-profile');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      id="main-header"
      className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md shadow-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Logo */}
          <div 
            onClick={() => handleNavigate('home')} 
            className="flex items-center cursor-pointer group"
            id="brand-logo"
          >
            <span className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white flex items-center">
              BOOKME <span className="font-light text-indigo-600 dark:text-indigo-400 normal-case tracking-widest pl-1 text-[10px]">LITE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">

            <button
              onClick={() => handleNavigate('directory')}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                currentScreen === 'directory' || currentScreen === 'profile'
                  ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'
              }`}
              id="nav-directory"
            >
              <Compass className="w-4 h-4" />
              Explore Models
            </button>
            <button
              onClick={() => handleNavigate('opportunities')}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                currentScreen === 'opportunities'
                  ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'
              }`}
              id="nav-opportunities"
            >
              <Briefcase className="w-4 h-4" />
              Opportunity Wall
            </button>

            {currentUser && (
              <button
                onClick={() => handleNavigate(currentUser.role === 'client' ? 'client-dashboard' : 'model-dashboard')}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                  currentScreen === 'client-dashboard' || currentScreen === 'model-dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
                id="nav-dashboard"
              >
                <Grid className="w-4 h-4" />
                Dashboard
              </button>
            )}
          </nav>

          {/* Desktop Right Panel (Auth Actions) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 pl-3 pr-2 py-1.5 rounded-full">
                <div className="flex items-center gap-2">
                  <img 
                    referrerPolicy="no-referrer"
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/30"
                  />
                  <div className="text-left font-sans flex flex-col justify-center leading-none">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleGoToMyProfile}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-full transition-all cursor-pointer"
                  title="View My Profile"
                  id="header-profile-btn"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleNavigate('settings')}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-full transition-all cursor-pointer"
                  title="Settings"
                  id="header-settings-btn"
                >
                  <Settings className="w-4 h-4" />
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavigate('admin')}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-full transition-all cursor-pointer"
                    title="Admin Console"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-all cursor-pointer"
                  title="Logout"
                  id="header-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('login')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer transition-colors"
                  id="header-login-btn"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate('signup')}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white dark:text-slate-950 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-full cursor-pointer transition-all border border-slate-900 dark:border-white shadow-sm font-sans"
                  id="header-signup-btn"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <div className="mr-1">
                <img 
                  referrerPolicy="no-referrer"
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500"
                  onClick={() => handleNavigate(currentUser.role === 'client' ? 'client-dashboard' : 'model-dashboard')}
                />
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-lg cursor-pointer transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="md:hidden border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex flex-col gap-3 shadow-lg">

          <button
            onClick={() => handleNavigate('directory')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentScreen === 'directory' ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Explore Models
          </button>
          <button
            onClick={() => handleNavigate('opportunities')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentScreen === 'opportunities' ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Opportunity Wall
          </button>

          {currentUser ? (
            <>
              <button
                onClick={handleGoToMyProfile}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentScreen === 'profile' || currentScreen === 'business-profile' 
                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                View My Profile
              </button>
              <button
                onClick={() => handleNavigate(currentUser.role === 'client' ? 'client-dashboard' : 'model-dashboard')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentScreen === 'client-dashboard' || currentScreen === 'model-dashboard' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Go to Dashboard ({currentUser.role === 'client' ? 'Client' : 'Model'})
              </button>
              <button
                onClick={() => handleNavigate('settings')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentScreen === 'settings' ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Settings
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleNavigate('admin')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                    currentScreen === 'admin' ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Admin Console
                </button>
              )}
              <div className="h-px bg-slate-100 dark:bg-slate-900 my-1" />
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <img 
                    referrerPolicy="no-referrer"
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{currentUser.name}</div>
                    <div className="text-xs text-slate-400 italic block capitalize">{currentUser.role} Account</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/30 rounded-xl"
                  id="mobile-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="h-px bg-slate-100 dark:bg-slate-900 my-1" />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => handleNavigate('login')}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-slate-200/80"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigate('signup')}
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
