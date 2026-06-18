import React from 'react';
import { AppScreen, User } from '../types';
import { User as UserIcon, Briefcase, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AccountTypeSelectionViewProps {
  currentUser: User;
  onSelectUserOnly: () => void;
  onBecomeModel: () => void;
  onBecomeBusiness: () => void;
  setCurrentScreen: (screen: AppScreen) => void;
}

export default function AccountTypeSelectionView({
  currentUser,
  onSelectUserOnly,
  onBecomeModel,
  onBecomeBusiness,
  setCurrentScreen,
}: AccountTypeSelectionViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/30">
              <UserIcon className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome, {currentUser.full_name}
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Your account is ready. Choose how you want to use BookMe. You can always add more roles later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onSelectUserOnly}
              className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserIcon className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">User Only</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse the platform, explore profiles, and book talent as a client.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
                Continue <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={onBecomeModel}
              className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-900/30 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Become a Model</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create a model profile, showcase your portfolio, and get hired by brands.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
                Set up profile <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={onBecomeBusiness}
              className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4 border border-amber-100 dark:border-amber-900/30 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Become a Business</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Post opportunities, discover talent, and manage your brand presence.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
                Set up business <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-8">
            You can change or add roles anytime from Settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
