import React, { useState } from 'react';
import { BusinessProfile, AppScreen, User } from '../types';
import { ArrowLeft, Building, Globe, MapPin, Briefcase, Image, Link, Check, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface BusinessProfileSetupViewProps {
  currentUser: User;
  onSave: (profile: BusinessProfile) => void;
  onSkip: () => void;
  setCurrentScreen: (screen: AppScreen) => void;
}

export default function BusinessProfileSetupView({
  currentUser,
  onSave,
  onSkip,
  setCurrentScreen,
}: BusinessProfileSetupViewProps) {
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Fashion Design House');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const profile: BusinessProfile = {
      user_id: currentUser.id,
      brand_name: brandName.trim() || currentUser.name + ' Agency',
      website: website.trim(),
      industry,
      address: location.trim(),
      description: description.trim(),
      cover_image: coverImage.trim() || undefined,
      is_verified: false,
    };
    setTimeout(() => {
      onSave(profile);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-full border border-indigo-100 dark:border-indigo-900/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Brand Setup</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/30">
              <Building className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Set Up Your Brand Profile</h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Tell us about your company so models and talent can discover and connect with your brand.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Brand / Agency Name</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder={currentUser.name + ' Agency'}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="vogue.com"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Industry / Sector</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                >
                  <option value="Fashion Design House">Fashion Design House</option>
                  <option value="Editorial & Magazines">Editorial & Magazines</option>
                  <option value="Modeling Agency">Agency Representatives</option>
                  <option value="Independent Photographer">Photographers Group</option>
                  <option value="Advertising Campaigns">Creative Production Ad</option>
                  <option value="Film & Television">Film & Television</option>
                  <option value="E-Commerce">E-Commerce / Retail</option>
                  <option value="Event Management">Event Management</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Headquarters Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Lagos, Nigeria"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cover Image URL</label>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Brand Description / Bio</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell models about your brand, past campaigns, and the type of talent you're looking for..."
                className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onSkip}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Check className="w-4 h-4" /> Complete Brand Profile</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
