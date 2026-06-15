/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ModelProfile, PortfolioImage, User, AppScreen } from '../types';
import { ChevronLeft, MapPin, Calendar, ClipboardCheck, ArrowLeft, Image as ImageIcon, Ruler, Award, Eye, X, BookOpen, AlertCircle, Share2, Plus, Trash2, Edit3, Settings2 } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

import { AnimatePresence, motion } from 'motion/react';

interface ProfileViewProps {
  modelId: string;
  models: ModelProfile[];
  portfolio: PortfolioImage[];
  onOpenBooking: (model: ModelProfile) => void;
  currentUser: User | null;
  setCurrentScreen: (screen: AppScreen) => void;
  onBackToDirectory: () => void;
  onUpdateProfile?: (updated: Partial<ModelProfile>) => void;
  onAddPortfolioImage?: (imageUrl: string, type?: 'image' | 'video', muxPlaybackId?: string, muxAssetId?: string) => void;
  onDeletePortfolioImage?: (imageId: string) => void;
}

export default function ProfileView({
  modelId,
  models,
  portfolio,
  onOpenBooking,
  currentUser,
  setCurrentScreen,
  onBackToDirectory,
  onUpdateProfile,
  onAddPortfolioImage,
  onDeletePortfolioImage
}: ProfileViewProps) {
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);

  // Find target model
  const model = useMemo(() => {
    return models.find((m) => m.id === modelId) || null;
  }, [models, modelId]);

  // Filters portfolio photos for this specific model
  const modelPortfolio = useMemo(() => {
    return portfolio.filter((img) => img.model_id === modelId);
  }, [portfolio, modelId]);

  const isOwner = useMemo(() => {
    return currentUser?.id === model?.user_id;
  }, [currentUser, model]);

  if (!model) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600 inline-flex">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-950 font-sans">Profile Not Found</h2>
        <p className="text-xs text-slate-500">The model profile you are seeking might have been unregistered or is temporarily private.</p>
        <button onClick={onBackToDirectory} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Back to Directory
        </button>
      </div>
    );
  }

  const handleBookSession = () => {
    if (!currentUser) {
      setCurrentScreen('login');
    } else {
      onOpenBooking(model);
    }
  };

  const handleShare = () => {
    setCurrentScreen('public-profile');
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl && onAddPortfolioImage) {
      onAddPortfolioImage(newImageUrl);
      setNewImageUrl('');
      setIsAddingImage(false);
    }
  };

  return (
    <div id={`model-profile-${model.id}`} className="w-full bg-white dark:bg-black min-h-screen pb-40 transition-colors duration-300">
      
      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out select-none"
            onClick={() => setActiveLightboxImage(null)}
            id="lightbox-overlay"
          >
            <button 
              onClick={() => setActiveLightboxImage(null)} 
              className="absolute top-10 right-10 p-5 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              referrerPolicy="no-referrer"
              src={activeLightboxImage} 
              alt="High definition lightbox presentation" 
              className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile container */}
      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Superior Header Control Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDirectory}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Directory
          </button>

          <div className="flex gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Bio-Link
            </button>
            
            {isOwner && (
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
              >
                <Settings2 className="w-3.5 h-3.5" /> Edit Specs
              </button>
            )}
          </div>
        </div>

        {/* Hero Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Avatar Frame (Portrait 3:4) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5 bg-slate-50">
              <img 
                src={model.avatar} 
                className="w-full h-full object-cover" 
                alt={model.name} 
              />
              <div className="absolute top-8 left-8">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  {model.experience_level}
                </span>
              </div>
            </div>
            
            {isOwner && (
              <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100/50 dark:border-indigo-900/30">
                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 px-1">Owner Dashboard</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-1">This is your profile as clients see it. Use the Share button to get your personal BookMe link.</p>
              </div>
            )}
          </div>

          {/* Right: Specs & Actions */}
          <div className="lg:col-span-7 space-y-10 text-left py-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-none dark:text-white"
              >
                {model.name}
              </motion.h1>
              <div className="flex items-center gap-6 mt-6">
                 <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <MapPin className="w-4 h-4 text-indigo-500" /> {model.location}
                 </span>
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <Calendar className="w-4 h-4 text-indigo-500" /> Member since {new Date(model.created_at).getFullYear()}
                 </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: 'Height', value: model.height + 'cm', icon: Ruler },
                 { label: 'Daily Rate', value: '$' + model.daily_rate, icon: Award },
                 { label: 'Age', value: model.age + 'y', icon: Calendar },
                 { label: 'Gender', value: model.gender, icon: Eye }
               ].map(spec => (
                 <div key={spec.label} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{spec.label}</p>
                    <p className="text-lg font-black dark:text-white leading-none">{spec.value}</p>
                 </div>
               ))}
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <BookOpen className="w-4 h-4" /> Editorial Biography
               </h3>
               <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                 {model.bio || "This model has not provided a custom biography yet. Versatile across editorial and commercial productions."}
               </p>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleBookSession}
                className="w-full md:w-auto px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Request Booking Session
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Upgrade Section */}
        <section className="space-y-10 pt-10 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black tracking-tight dark:text-white">Portfolio Highlights</h2>
            <div className="flex gap-4">
               {isOwner && (
                 <button 
                   onClick={() => setIsAddingImage(!isAddingImage)}
                   className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 hover:bg-indigo-100 transition-colors"
                 >
                   <Plus className="w-5 h-5" />
                 </button>
               )}
               <span className="px-5 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                 {modelPortfolio.length} Assets
               </span>
            </div>
          </div>

          <AnimatePresence>
            {isAddingImage && isOwner && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddImage}
                className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-indigo-100 dark:border-white/10 space-y-4 overflow-hidden"
              >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Paste New Image URL</label>
                <div className="flex gap-4">
                   <input 
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-grow px-6 py-4 bg-white dark:bg-black rounded-2xl border border-slate-100 dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium dark:text-white"
                   />
                   <button type="submit" className="px-8 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-colors">
                     Add Photo
                   </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {modelPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modelPortfolio.map((img, idx) => (
                <motion.div 
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx % 3 * 0.1 }}
                  className="group relative aspect-[3/4] bg-slate-100 dark:bg-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={img.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in" 
                    alt="Portfolio" 
                    onClick={() => setActiveLightboxImage(img.image_url)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button 
                        onClick={() => setActiveLightboxImage(img.image_url)}
                        className="p-4 bg-white/20 backdrop-blur-xl rounded-full border border-white/20 hover:bg-white/40 transition-colors cursor-pointer"
                     >
                        <Eye className="w-5 h-5 text-white" />
                     </button>
                     {isOwner && onDeletePortfolioImage && (
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePortfolioImage(img.id);
                        }}
                        className="p-4 bg-rose-500/20 backdrop-blur-xl rounded-full border border-rose-500/20 hover:bg-rose-500 transition-colors cursor-pointer"
                       >
                         <Trash2 className="w-5 h-5 text-white" />
                       </button>
                     )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-slate-50 dark:bg-white/5 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-white/5">
               <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
               <h4 className="text-2xl font-black text-slate-300">Curate Your Showcase</h4>
               <p className="text-sm text-slate-400 font-medium">Add editorial shots to transform this profile into a premium portfolio.</p>
            </div>
          )}
        </section>

      </div>

      {isEditProfileOpen && model && onUpdateProfile && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          profile={model}
          onUpdateProfile={onUpdateProfile}
        />
      )}
    </div>
  );
}

