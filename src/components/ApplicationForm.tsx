/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Opportunity, Application } from '../types';
import { 
  X, 
  Send, 
  Instagram, 
  Camera, 
  User, 
  FileText, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  modelName: string;
  onApply: (application: Partial<Application>) => void;
}

export default function ApplicationForm({
  isOpen,
  onClose,
  opportunity,
  modelName,
  onApply
}: ApplicationFormProps) {
  const [fullName, setFullName] = useState(modelName);
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [experience, setExperience] = useState('Beginner');
  const [message, setMessage] = useState('');
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>(['', '', '']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const applicationData: Partial<Application> = {
      opportunity_id: opportunity.id,
      full_name: fullName,
      bio,
      instagram_handle: instagram,
      experience_level: experience,
      message,
      portfolio_photos: portfolioUrls.filter(url => url.trim() !== ''),
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    setTimeout(() => {
      onApply(applicationData);
      setSubmitting(false);
      onClose();
    }, 1200);
  };

  const handleUrlChange = (index: number, val: string) => {
    const newUrls = [...portfolioUrls];
    newUrls[index] = val;
    setPortfolioUrls(newUrls);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              Apply for Casting
            </h2>
            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{opportunity.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Snap Info */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {opportunity.business_name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Casting By</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{opportunity.business_name}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Fee</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{opportunity.payment_amount || 'TFP'}</p>
            </div>
          </div>

          {/* Model Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Your Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">FULL NAME</label>
                <input 
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your visual name"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">INSTAGRAM HANDLE</label>
                <div className="relative">
                  <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    placeholder="@username"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">SHORT BIO</label>
              <textarea 
                required
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Highlight your best features and stats..."
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none"
              />
            </div>
          </section>

          {/* Portfolio */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" /> Portfolio Links
            </h3>
            <div className="space-y-3">
              {portfolioUrls.map((url, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">SHOT {i + 1} URL</label>
                  <input 
                    value={url}
                    onChange={e => handleUrlChange(i, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Use high-quality headshots or full-body portfolio images for better visibility.</p>
            </div>
          </section>

          {/* Message */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Personal Message
            </h3>
            <textarea 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Why are you perfect for this campaign?"
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none"
            />
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pb-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Applying...' : 'Submit Application'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
