/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Opportunity } from '../types';
import { 
  MapPin, 
  Users, 
  Clock, 
  Briefcase, 
  ChevronRight, 
  DollarSign, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface OpportunityCardProps {
  key?: React.Key;
  opportunity: Opportunity;
  onApply: (opportunity: Opportunity) => void;
  onViewDetails: (opportunity: Opportunity) => void;
  onViewBrand?: (businessId: string) => void;
}

export default function OpportunityCard({ 
  opportunity, 
  onApply, 
  onViewDetails,
  onViewBrand
}: OpportunityCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Almost Full': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'Filled': return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      case 'Expired': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      case 'Still Looking For Applicants': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const isClosed = opportunity.status === 'Filled' || opportunity.status === 'Expired';
  
  // Calculate time remaining (mock logic for demo)
  const deadlineDate = new Date(opportunity.deadline);
  const now = new Date();
  const diffHours = Math.max(0, Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)));
  const timeDisplay = diffHours > 24 ? `${Math.floor(diffHours / 24)}d remaining` : `${diffHours}h remaining`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 h-full flex flex-col"
      id={`opportunity-${opportunity.id}`}
    >
      <div className="p-8 flex-1">
        {/* Header: Status & Verification */}
        <div className="flex items-center justify-between mb-8">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${getStatusColor(opportunity.status)}`}>
            {opportunity.status}
          </span>
          <div className="flex items-center gap-2">
            {opportunity.is_verified_business && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30" title="Verified Brand">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="px-3 py-1 bg-slate-50 dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800 text-[9px] font-bold text-slate-400">
              {timeDisplay}
            </div>
          </div>
        </div>

        {/* Brand & Title */}
        <div className="space-y-4 mb-8">
          <div 
            className="flex items-center gap-4 cursor-pointer group/brand"
            onClick={() => onViewBrand?.(opportunity.business_id)}
          >
            {opportunity.business_logo ? (
              <img 
                referrerPolicy="no-referrer"
                src={opportunity.business_logo} 
                alt={opportunity.business_name} 
                className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-800 p-0.5 group-hover/brand:border-indigo-500 transition-colors"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover/brand:border-indigo-500 transition-colors">
                <Briefcase className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="min-w-0">
               <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5 group-hover/brand:underline">
                {opportunity.business_name}
              </p>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                 <MapPin className="w-3 h-3" />
                 {opportunity.location_city}
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-[1.1] font-sans tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {opportunity.title}
          </h3>
        </div>

        {/* Deep Specs */}
        <div className="space-y-4 py-6 border-y border-slate-50 dark:border-slate-800/50 mb-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" /> Compensation
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">
              {opportunity.payment_type === 'Paid' ? (opportunity.payment_amount || 'Negotiable') : 'TFP'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Role Count
            </span>
            <span className="text-slate-900 dark:text-white font-black">
              {opportunity.models_needed} Talent
            </span>
          </div>
        </div>

        {/* Requirements */}
        <div className="flex flex-wrap gap-2">
          {[opportunity.gender_requirement, opportunity.experience_requirement, opportunity.category].map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-[#F5F5FA] dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black rounded-lg uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-6 bg-slate-50/30 dark:bg-slate-950/30 mt-auto flex items-center justify-between">
        <button 
          onClick={() => onViewDetails(opportunity)}
          className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
        >
          Detailed Brief
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {isClosed ? (
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-black rounded-xl uppercase tracking-widest">
            Closed
          </div>
        ) : (
          <button 
            onClick={() => onApply(opportunity)}
            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 cursor-pointer uppercase tracking-[0.1em]"
          >
            Apply
          </button>
        )}
      </div>
    </motion.div>
  );
}
