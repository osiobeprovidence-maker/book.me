/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Opportunity, User, Application } from '../types';
import { NIGERIAN_STATES, MODEL_CATEGORIES } from '../constants';
import OpportunityCard from '../components/OpportunityCard';
import ApplicationForm from '../components/ApplicationForm';
import OpportunityForm from '../components/OpportunityForm';
import OpportunityDetailModal from '../components/OpportunityDetailModal';
import { 
  Search, 
  MapPin, 
  Filter, 
  User as UserIcon, 
  Sparkles, 
  Briefcase,
  Layers,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OpportunityWallViewProps {
  currentUser: User | null;
  opportunities: Opportunity[];
  onApply: (application: Partial<Application>) => void;
  onPostOpportunity: (opportunity: Partial<Opportunity>) => void;
  onNavigate: (screen: any) => void;
  onViewBrand?: (businessId: string) => void;
  isModel?: boolean;
}

export default function OpportunityWallView({
  currentUser,
  opportunities,
  onApply,
  onPostOpportunity,
  onNavigate,
  onViewBrand,
  isModel
}: OpportunityWallViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [paidOnly, setPaidOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [applyingTo, setApplyingTo] = useState<Opportunity | null>(null);
  const [viewingDetails, setViewingDetails] = useState<Opportunity | null>(null);

  const states = ['All States', ...NIGERIAN_STATES];
  const categories = ['All Categories', ...MODEL_CATEGORIES];

  // Filtering Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(o => {
      const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            o.business_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = selectedState === 'All States' || o.location_state === selectedState;
      const matchesCategory = selectedCategory === 'All Categories' || o.category === selectedCategory;
      const matchesPaid = !paidOnly || o.payment_type === 'Paid';
      const matchesVerified = !verifiedOnly || o.is_verified_business;
      
      return matchesSearch && matchesState && matchesCategory && matchesPaid && matchesVerified;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [opportunities, searchTerm, selectedState, selectedCategory, paidOnly, verifiedOnly]);

  const handleApplyClick = (opp: Opportunity) => {
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    if (!isModel) {
       alert('Only models can apply to opportunities.');
       return;
    }
    setApplyingTo(opp);
  };



  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 pb-20">
      {/* Editorial Header */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-8 md:pt-16 pb-20 px-4">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-rose-400 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"
          >
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 dark:bg-white rounded-full text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl shadow-slate-900/10">
                <Sparkles className="w-3 h-3 fill-indigo-400" />
                Casting Network
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white font-sans tracking-tighter mb-6 leading-[0.9]">
                Opportunity <br/>
                <span className="text-indigo-600 dark:text-indigo-400">Wall.</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
                Connect with professional brands across the country. Filter by location, category, and payment status to find your next headliner shoot.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:mb-2">
              <div className="flex gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
                  <p className="text-3xl font-black dark:text-white leading-none mb-1">{opportunities.length}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Jobs</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
                  <p className="text-3xl font-black dark:text-white leading-none mb-1">{opportunities.filter(o => o.status === 'Open').length}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Open Now</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Filter Strip */}
      <section className="sticky top-16 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-4 py-5 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-5 items-center">
          {/* Search Box */}
          <div className="relative w-full xl:flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search roles, brands, or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white text-sm font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full xl:w-auto">
            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
               <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select 
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white text-xs font-bold appearance-none cursor-pointer hover:border-indigo-200"
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

               <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white text-xs font-bold appearance-none cursor-pointer hover:border-indigo-200"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* Quick Toggles */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPaidOnly(!paidOnly)}
                className={`flex items-center gap-2 group cursor-pointer px-4 py-2.5 rounded-full border transition-all ${paidOnly ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Paid Only</span>
              </button>
              
              <button 
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`flex items-center gap-2 group cursor-pointer px-4 py-2.5 rounded-full border transition-all ${verifiedOnly ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-400'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feed Stage */}
      <main className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="w-8 h-[2px] bg-indigo-600" />
              Found {filteredOpportunities.length} Listings
           </h2>
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.map((opp, idx) => (
                <motion.div 
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                >
                  <OpportunityCard 
                    opportunity={opp}
                    onApply={handleApplyClick}
                    onViewDetails={(opp) => setViewingDetails(opp)}
                    onViewBrand={onViewBrand}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 dark:border-slate-800">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black dark:text-white mb-3 tracking-tight">No casting calls found.</h2>
            <p className="text-slate-500 max-w-xs mx-auto leading-relaxed mb-8">Try adjusting your filters or checking back later for new opportunities.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedState('All States');
                setSelectedCategory('All Categories');
                setPaidOnly(false);
                setVerifiedOnly(false);
              }}
              className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl text-sm shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {applyingTo && (
        <ApplicationForm 
          isOpen={true}
          onClose={() => setApplyingTo(null)}
          opportunity={applyingTo}
          modelName={currentUser?.name || ''}
          onApply={onApply}
        />
      )}

      {viewingDetails && (
        <OpportunityDetailModal 
          isOpen={true}
          onClose={() => setViewingDetails(null)}
          opportunity={viewingDetails}
          onApply={handleApplyClick}
          isModel={!!isModel}
        />
      )}

    </div>
  );
}
