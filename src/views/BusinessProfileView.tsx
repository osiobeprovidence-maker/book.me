/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { User, BusinessProfile, Opportunity, AppScreen } from '../types';
import { 
  Building2, MapPin, Globe, ShieldCheck, Briefcase, 
  ArrowLeft, ExternalLink, Calendar, Users, 
  CheckCircle2, Info, Linkedin, Twitter, Instagram
} from 'lucide-react';
import { motion } from 'motion/react';
import OpportunityCard from '../components/OpportunityCard';

interface BusinessProfileViewProps {
  businessId: string;
  users: User[];
  businessProfiles: BusinessProfile[];
  opportunities: Opportunity[];
  onBack: () => void;
  onViewOpportunity: (opp: Opportunity) => void;
  onApplyToOpportunity: (opp: Opportunity) => void;
  currentUser: User | null;
}

export default function BusinessProfileView({
  businessId,
  users,
  businessProfiles,
  opportunities,
  onBack,
  onViewOpportunity,
  onApplyToOpportunity,
  currentUser
}: BusinessProfileViewProps) {
  
  const user = useMemo(() => users.find(u => u.id === businessId), [users, businessId]);
  const profile = useMemo(() => businessProfiles.find(p => p.user_id === businessId), [businessProfiles, businessId]);
  const activeOpps = useMemo(() => opportunities.filter(o => o.business_id === businessId), [opportunities, businessId]);

  if (!user) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold dark:text-white">Business profile not found</h2>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-left">
      {/* Editorial Cover Section */}
      <div className="relative h-[40vh] bg-slate-900 border-b border-white/10 overflow-hidden">
        {profile?.cover_image ? (
          <img 
            src={profile.cover_image} 
            className="w-full h-full object-cover opacity-60"
            alt="Business cover" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 opacity-80" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 px-4">
          <div className="max-w-6xl mx-auto h-full flex flex-col justify-end pb-12">
            <button 
              onClick={onBack}
              className="absolute top-10 left-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Back</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900 p-2 shadow-2xl relative overflow-hidden">
                  <img 
                    src={user.avatar} 
                    className="w-full h-full object-cover rounded-[2rem]" 
                    alt={user.name} 
                  />
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">{user.name}</h1>
                    {profile?.is_verified && (
                      <div className="p-1 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <span className="flex items-center gap-2 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                      <Building2 className="w-4 h-4" /> {profile?.industry || 'Production Agency'}
                    </span>
                    <span className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="w-4 h-4" /> {profile?.address || 'Location Pending'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                {profile?.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl transition-all border border-white/20"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                <div className="flex gap-2">
                   <button className="p-4 bg-white/10 text-white rounded-2xl border border-white/20"><Instagram className="w-5 h-5" /></button>
                   <button className="p-4 bg-white/10 text-white rounded-2xl border border-white/20"><Twitter className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: About & Details */}
          <div className="lg:col-span-4 space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black dark:text-white tracking-tight flex items-center gap-3">
                <span className="w-2 h-6 bg-indigo-600 rounded-full" />
                About the Brand
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {profile?.description || `${user.name} is a leading creative production house specializing in high-end editorial and commercial projects. We connect top brands with premium talent for global campaigns.`}
              </p>
            </section>

            <section className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Intelligence</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year Founded</p>
                    <p className="font-black dark:text-white">{profile?.founded_year || '2018'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                    <p className="font-black dark:text-white">94% Fill Rate</p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Talent Network</p>
                    <p className="font-black dark:text-white">500+ Hires</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20">
               <ShieldCheck className="w-10 h-10 mb-6 text-indigo-200" />
               <h4 className="text-xl font-black mb-2">Verified Producer</h4>
               <p className="text-sm text-indigo-100 font-medium mb-6">This agency has undergone official vetting and registration protocols with the Casting Network.</p>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 p-3 rounded-xl border border-white/10">
                  <Info className="w-4 h-4" /> Registration ID: {profile?.registration_details || 'Verified Agent'}
               </div>
            </div>
          </div>

          {/* Right Column: Opportunities Feed */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black dark:text-white tracking-tight">Active Casting Sessions</h2>
              <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                {activeOpps.length} LIVE CALLS
              </span>
            </div>

            {activeOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeOpps.map(opp => (
                  <OpportunityCard 
                    key={opp.id} 
                    opportunity={opp} 
                    onViewDetails={onViewOpportunity} 
                    onApply={onApplyToOpportunity} 
                  />
                ))}
              </div>
            ) : (
              <div className="p-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Open Castings</h3>
                <p className="text-sm text-slate-500 font-medium">This brand has no active sessions at the moment. Check back soon for new opportunities.</p>
              </div>
            )}

            <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800">
               <h3 className="text-xl font-black dark:text-white tracking-tight mb-6">Company Portfolio</h3>
               <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                       <img 
                        src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&q=80&w=800`} 
                        className="w-full h-full object-cover" 
                        alt="Past work" 
                       />
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
