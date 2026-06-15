/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ModelProfile } from '../types';
import { MapPin, ArrowRight, DollarSign, Award } from 'lucide-react';

interface ModelCardProps {
  key?: string;
  model: ModelProfile;
  onViewProfile: (modelId: string) => void;
}

export default function ModelCard({ model, onViewProfile }: ModelCardProps) {
  return (
    <div 
      id={`model-card-${model.id}`}
      className="group bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-850 backdrop-blur-md hover:border-indigo-600/55 dark:hover:border-indigo-500/50 shadow-sm transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* 3:4 aspect ratio photobox with editorial margins */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 select-none m-3 rounded-xl">
        <img 
          referrerPolicy="no-referrer"
          src={model.avatar} 
          alt={model.name} 
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none"
          loading="lazy"
        />
        
        {/* Experience level badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/85 text-white backdrop-blur-md border border-white/10 shadow-sm">
            <Award className="w-3 h-3 text-indigo-400" />
            {model.experience_level}
          </span>
        </div>

        {/* Height badge (quick stat overlay) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold font-mono tracking-wide bg-black/50 text-slate-200 backdrop-blur-md">
            {model.height} cm
          </span>
        </div>

        {/* Daily rate sticker */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest font-sans bg-indigo-600 text-white shadow-md uppercase">
            ${model.daily_rate}/Day
          </span>
        </div>
      </div>

      {/* Information body */}
      <div className="p-4 pt-1 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight font-sans group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {model.name}
            </h3>
            {/* Location indicators */}
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{model.location}</span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1 italic font-sans">
          "{model.bio}"
        </p>

        {/* Trigger view profile button */}
        <button
          onClick={() => onViewProfile(model.id)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs uppercase tracking-widest font-sans font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white hover:border-indigo-600 dark:hover:border-indigo-600 transition-all cursor-pointer shadow-sm"
          id={`view-profile-btn-${model.id}`}
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
