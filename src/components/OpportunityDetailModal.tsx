/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Opportunity, Application } from '../types';
import { 
  X, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Globe,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OpportunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onApply: (opportunity: Opportunity) => void;
  isModel: boolean;
}

export default function OpportunityDetailModal({
  isOpen,
  onClose,
  opportunity,
  onApply,
  isModel
}: OpportunityDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-8"
      >
        {/* Header Hero */}
        <div className="relative h-48 sm:h-64 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
          <div className="absolute top-6 right-6 z-10">
            <button 
              onClick={onClose}
              className="p-3 bg-white/20 hover:bg-white/40 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 backdrop-blur-md rounded-full text-white transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center z-10 p-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-xl shadow-indigo-600/30">
              {opportunity.category}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-sans tracking-tighter leading-[1.1] max-w-2xl mx-auto">
              {opportunity.title}
            </h2>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Col: Core Details */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Brand Section */}
              <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                {opportunity.business_logo ? (
                  <img 
                    src={opportunity.business_logo} 
                    alt={opportunity.business_name} 
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {opportunity.business_name}
                    {opportunity.is_verified_business && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">{opportunity.location_state}, {opportunity.location_city}</p>
                </div>
              </div>

              {/* Rules & Guidelines (New) */}
              {opportunity.rules && (
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" /> Casting Rules & Guidelines
                  </h4>
                  <div className="p-8 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium italic">
                      "{opportunity.rules}"
                    </p>
                  </div>
                </section>
              )}

              {/* Description */}
              <section>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-500" /> Detailed Brief
                </h4>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-lg">
                  {opportunity.business_description}
                </p>
              </section>

              {/* Additional Notes */}
              {opportunity.notes && (
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Additional Information</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {opportunity.notes}
                  </p>
                </section>
              )}
            </div>

            {/* Right Col: Stats & Logistics */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Logistics</h4>
                
                {/* Location Card */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-0.5">Location</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {opportunity.location_city}, {opportunity.location_state}
                      </p>
                      {opportunity.venue_address && (
                        <p className="text-xs text-slate-500 mt-1">{opportunity.venue_address}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-0.5">Event Date</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {new Date(opportunity.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-0.5">Compensation</p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {opportunity.payment_amount || 'Negotiable'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Requirements Card */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Casting Requirements</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      <span className="text-xs font-bold text-slate-500">Gender</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{opportunity.gender_requirement}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      <span className="text-xs font-bold text-slate-500">Age Range</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{opportunity.age_requirement}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      <span className="text-xs font-bold text-slate-500">Experience</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{opportunity.experience_requirement}</span>
                    </div>
                  </div>
                </div>
              </div>

               {/* Action Area */}
               <div className="pt-8">
                {isModel ? (
                  <button 
                    onClick={() => onApply(opportunity)}
                    className="w-full py-5 bg-indigo-600 hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 text-white rounded-3xl font-black text-sm shadow-2xl shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    APPLY FOR THIS ROLE
                  </button>
                ) : (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <p className="text-xs font-bold text-slate-400">Only model accounts can apply to listings.</p>
                  </div>
                )}
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                  Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
