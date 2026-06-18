/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, SubscriptionPlan } from '../types';
import { 
  User as UserIcon, Lock, Bell, CreditCard, Shield, 
  ChevronRight, ArrowLeft, Check, Sparkles, Globe,
  Zap, Crown, Building, Moon, Sun, Star, Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import { initializePayment, generateReference } from '../lib/paystack';
import ImageUploader from '../components/ImageUploader';

interface SettingsViewProps {
  currentUser: User | null;
  onUpdateUser: (userData: Partial<User>) => void;
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onActivateModel?: () => void;
  onActivateBusiness?: () => void;
}

export default function SettingsView({ currentUser, onUpdateUser, onBack, darkMode, onToggleDarkMode, onActivateModel, onActivateBusiness }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'billing' | 'notifications' | 'security'>('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.name || '');
  const [displayEmail, setDisplayEmail] = useState(currentUser?.email || '');
  const [avatarDataUrl, setAvatarDataUrl] = useState('');

  const plans: { name: SubscriptionPlan, price: string, features: string[], icon: any, color: string }[] = [
    { 
      name: 'Free', 
      price: '$0', 
      features: ['Basic Profile', '5 Portfolio Photos', 'Apply to 3 Jobs/mo'],
      icon: Zap,
      color: 'slate'
    },
    { 
      name: 'Pro', 
      price: '$19', 
      features: ['Verified Badge', 'Unlimited Photos', 'Unlimited Applications', 'Direct Messaging'],
      icon: Crown,
      color: 'indigo'
    },
    { 
      name: 'Enterprise', 
      price: '$99', 
      features: ['Priority Support', 'Platform Analytics', 'Agency Management Tools', 'Custom Branding'],
      icon: Building,
      color: 'rose'
    }
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Settings</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
             <Sparkles className="w-4 h-4 text-indigo-500" />
             <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
               {currentUser.plan || 'Free'} Plan
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-2">
            {[
              { id: 'profile', label: 'Public Profile', icon: UserIcon },
              { id: 'appearance', label: 'Appearance', icon: Moon },
              { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
              { id: 'security', label: 'Login & Security', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-10"
            >
              
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black mb-1">Account Information</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Basic information about your identity on the platform.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 shrink-0">
                        <ImageUploader
                          currentImage={avatarDataUrl || currentUser.avatar}
                          onImageSelect={setAvatarDataUrl}
                          aspectRatio="square"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold">{currentUser.name}</h4>
                        <p className="text-xs text-slate-400 tracking-widest uppercase font-black">{currentUser.role} Account</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                        <input
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <input
                          value={displayEmail}
                          onChange={e => setDisplayEmail(e.target.value)}
                          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUpdating(true);
                      const updates: Partial<User> = {};
                      if (displayName !== currentUser.name) updates.name = displayName;
                      if (displayEmail !== currentUser.email) updates.email = displayEmail;
                      if (avatarDataUrl) updates.avatar = avatarDataUrl;
                      if (Object.keys(updates).length > 0) onUpdateUser(updates);
                      setIsUpdating(false);
                    }}
                    disabled={isUpdating}
                    className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Role Activation Section */}
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">Activate Roles</h3>
                <p className="text-xs text-slate-500 font-medium tracking-tight mb-6">Unlock additional capabilities on your account.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!currentUser.roles.includes('model') && (
                    <button
                      onClick={onActivateModel}
                      className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-3 border border-indigo-100 dark:border-indigo-900/30 group-hover:scale-110 transition-transform">
                        <Star className="w-5 h-5 text-indigo-500" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Become a Model</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Set up your model profile and get discovered by brands.</p>
                    </button>
                  )}

                  {!currentUser.roles.includes('business') && (
                    <button
                      onClick={onActivateBusiness}
                      className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-3 border border-amber-100 dark:border-amber-900/30 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5 text-amber-500" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Become a Business</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Post opportunities and hire talent for your projects.</p>
                    </button>
                  )}

                  {currentUser.roles.includes('model') && currentUser.roles.includes('business') && (
                    <div className="col-span-full p-5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">All roles activated</p>
                      <p className="text-[10px] text-emerald-500 font-medium mt-1">Use the role switcher in the header to change between User, Model, and Business modes.</p>
                    </div>
                  )}
                </div>
              </div>

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black mb-1">Appearance</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Customize how the platform looks for you.</p>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {darkMode ? (
                          <Moon className="w-6 h-6 text-indigo-500" />
                        ) : (
                          <Sun className="w-6 h-6 text-amber-500" />
                        )}
                        <div>
                          <p className="text-sm font-bold">Dark Mode</p>
                          <p className="text-[10px] text-slate-500 font-medium">{darkMode ? 'Dark theme active' : 'Light theme active'}</p>
                        </div>
                      </div>
                      <button
                        onClick={onToggleDarkMode}
                        className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${
                          darkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                            darkMode ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-3">Preview</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Light</p>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded mt-2" />
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200">
                        <p className="text-xs font-bold text-white dark:text-slate-900">Dark</p>
                        <div className="h-2 w-full bg-slate-700 dark:bg-slate-200 rounded mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-black mb-1">Upgrade Your Potential</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Monetize your profile by accessing premium networking features.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div 
                        key={plan.name}
                        className={`relative p-6 rounded-3xl border-2 transition-all group ${
                          (currentUser.plan || 'Free') === plan.name 
                            ? 'border-indigo-500 bg-indigo-50/10' 
                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {(currentUser.plan || 'Free') === plan.name && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                            Current Plan
                          </div>
                        )}
                        <plan.icon className={`w-8 h-8 mb-4 ${plan.color === 'indigo' ? 'text-indigo-500' : plan.color === 'rose' ? 'text-rose-500' : 'text-slate-400'}`} />
                        <h3 className="text-lg font-black">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                           <span className="text-2xl font-black">{plan.price}</span>
                           <span className="text-xs text-slate-400 font-medium">/mo</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                           {plan.features.map((f, i) => (
                             <li key={i} className="flex gap-2 text-[10px] font-bold text-slate-500 items-start">
                               <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                               {f}
                             </li>
                           ))}
                        </ul>
                        <button 
                          onClick={() => {
                            if ((currentUser.plan || 'Free') !== plan.name) {
                              if (plan.name !== 'Free' && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
                                initializePayment({
                                  email: currentUser.email,
                                  amount: plan.name === 'Pro' ? 19 : 99,
                                  reference: generateReference(),
                                  metadata: { plan: plan.name, userId: currentUser.id },
                                  onSuccess: (ref) => {
                                    onUpdateUser({ plan: plan.name });
                                  },
                                  onCancel: () => {},
                                });
                              } else {
                                onUpdateUser({ plan: plan.name });
                              }
                            }
                          }}
                          disabled={(currentUser.plan || 'Free') === plan.name}
                          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            (currentUser.plan || 'Free') === plan.name 
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 cursor-pointer'
                          }`}
                        >
                          {(currentUser.plan || 'Free') === plan.name ? 'Active' : 'Upgrade'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4">Payment Methods</h3>
                    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <span className="text-[10px] font-black">VISA</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">•••• •••• •••• 4242</p>
                          <p className="text-[10px] text-slate-400 font-medium">Expires 12/26</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">Edit</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black mb-1">Login & Security</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Keep your account safe and manage your access credentials.</p>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Shield className="w-5 h-5 text-emerald-500" />
                           <div>
                              <p className="text-sm font-bold">Two-Factor Authentication</p>
                              <p className="text-[10px] text-slate-500 font-medium">Secured by your primary mobile device</p>
                           </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">Active</div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest">Change Password</h4>
                        <div className="space-y-4">
                           <input type="password" placeholder="Current Password" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm" />
                           <input type="password" placeholder="New Password" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-sm" />
                        </div>
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest overflow-hidden relative group">
                           Update Security Credentials
                        </button>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-black mb-1">Push Notifications</h2>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">How and when you want to be alerted about new opportunities.</p>
                  </div>

                  <div className="space-y-4">
                     {[
                       { label: 'Booking Requests', desc: 'Alert me when a client requests a booking', checked: true },
                       { label: 'Application Updates', desc: 'Notify me when my job application status changes', checked: true },
                       { label: 'New Job Alerts', desc: 'Notify me about new jobs in my category', checked: false },
                       { label: 'Platform Announcements', desc: 'Updates about BookMe features', checked: true },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-2xl transition-colors">
                          <div className="space-y-0.5">
                             <p className="text-sm font-bold">{item.label}</p>
                             <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                          </div>
                          <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${item.checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.checked ? 'left-7' : 'left-1'}`} />
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
