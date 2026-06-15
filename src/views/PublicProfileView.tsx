/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModelProfile, PortfolioImage } from '../types';
import { 
  MapPin, Globe, Share2, Instagram, Twitter, 
  Linkedin, Mail, Calendar, Ruler, Award, 
  ChevronRight, ArrowRight, Eye, X, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PublicProfileViewProps {
  model: ModelProfile;
  portfolio: PortfolioImage[];
  onBack?: () => void;
}

export default function PublicProfileView({ model, portfolio, onBack }: PublicProfileViewProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const stats = [
    { label: 'Height', value: `${model.height}cm`, icon: Ruler },
    { label: 'Level', value: model.experience_level, icon: Award },
    { label: 'Base Rate', value: `$${model.daily_rate}`, icon: Calendar },
    { label: 'Location', value: model.location, icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Ornament */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-20 lg:py-32 space-y-20">
        
        {onBack && (
          <button 
            onClick={onBack}
            className="fixed top-10 left-10 z-[60] p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-full border border-slate-100 dark:border-white/10 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer text-slate-400 hover:text-indigo-600"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        )}

        {/* Editorial Header Section */}
        <section className="text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block relative"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(255,255,255,0.05)] ring-1 ring-slate-100 dark:ring-white/10 relative z-10 transition-transform hover:scale-[1.02] duration-500">
              <img 
                src={model.avatar} 
                className="w-full h-full object-cover" 
                alt={model.name} 
              />
            </div>
            <div className="absolute -inset-6 bg-indigo-600/10 rounded-[5rem] blur-3xl -z-10" />
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            >
              {model.name}
            </motion.h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] pb-4">
              Editorial Talent & Creator
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4 max-w-sm mx-auto"
          >
            <button className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Calendar className="w-5 h-5" /> Book Session
            </button>
            <div className="grid grid-cols-2 gap-4">
               <button className="py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-600 dark:text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                 <Mail className="w-4 h-4" /> Message
               </button>
               <button className="py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-600 dark:text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                 <Instagram className="w-4 h-4" /> Instagram
               </button>
            </div>
          </motion.div>
        </section>

        {/* Stats Grid - "Quick Specs" */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 text-center"
            >
              <stat.icon className="w-5 h-5 text-indigo-500 mx-auto mb-3" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="font-extrabold text-lg">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Bio Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
             <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
             Talent Biography
          </h2>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {model.bio || "Versatile model with a focus on editorial and high-fashion campaigns. Known for professionalism and ability to adapt to diverse creative visions."}
          </p>
        </section>

        {/* Portfolio Showcase */}
        <section className="space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">Portfolio Highlights</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{portfolio.length} Assets</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.map((img, idx) => (
                <motion.div 
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx % 2 * 0.1 }}
                  className="group relative aspect-[3/4] bg-slate-100 dark:bg-white/5 rounded-[2.5rem] overflow-hidden cursor-zoom-in"
                  onClick={() => setActiveImage(img.image_url)}
                >
                  <img 
                    src={img.image_url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Portfolio" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="p-4 bg-white/20 backdrop-blur-xl rounded-full border border-white/20">
                        <Eye className="w-6 h-6 text-white" />
                     </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Simple Social Links Footer */}
        <section className="pt-20 border-t border-slate-100 dark:border-white/10 flex flex-col items-center gap-10">
           <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Mail className="w-6 h-6" /></a>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Powered by</p>
              <h4 className="text-xl font-black italic tracking-tighter">BookMe </h4>
           </div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-10 right-10 p-4 bg-slate-100 dark:bg-white/10 rounded-full">
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={activeImage} 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-3xl"
              alt="Full screen view" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
