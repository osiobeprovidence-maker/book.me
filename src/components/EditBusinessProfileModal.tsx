/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { X, Building2, Globe, MapPin, Film, Linkedin, Instagram, Twitter } from 'lucide-react';

interface EditBusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  onUpdate: (updated: Partial<BusinessProfile>) => void;
}

export default function EditBusinessProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdate
}: EditBusinessProfileModalProps) {
  const [formData, setFormData] = useState({
    description: profile.description || '',
    industry: profile.industry || '',
    website: profile.website || '',
    address: profile.address || '',
    founded_year: profile.founded_year || '',
    cover_image: profile.cover_image || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-8 border-b border-slate-50 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">Edit Brand Profile</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Global Registry Details</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Brand Vision */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Brand Vision & Mission</label>
             <textarea 
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium dark:text-white min-h-[120px]"
               placeholder="Describe your production house, aesthetic, and typical projects..."
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Industry</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold dark:text-white"
                  placeholder="e.g. Editorial Fashion"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="url"
                  value={formData.website}
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold dark:text-white"
                  placeholder="https://agency.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Headquarters</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold dark:text-white"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Year Established</label>
              <input 
                type="text"
                value={formData.founded_year}
                onChange={e => setFormData({...formData, founded_year: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold dark:text-white"
                placeholder="e.g. 2015"
              />
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cover Image URL</label>
             <input 
               type="url"
               value={formData.cover_image}
               onChange={e => setFormData({...formData, cover_image: e.target.value})}
               className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-bold dark:text-white"
               placeholder="Paste high-res editorial image URL..."
             />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Update Brand Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
