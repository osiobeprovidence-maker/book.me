/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { User, Booking, ModelProfile, AppScreen, Opportunity, Application } from '../types';
import { 
  ClipboardCheck, 
  Hourglass, 
  CalendarRange, 
  Clock, 
  MapPin, 
  Compass, 
  Trash2, 
  ArrowRight, 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Users, 
  History,
  X,
  ExternalLink,
  Instagram,
  Check,
  XCircle,
  Settings
} from 'lucide-react';
import OpportunityForm from '../components/OpportunityForm';
import EditBusinessProfileModal from '../components/EditBusinessProfileModal';
import { motion, AnimatePresence } from 'motion/react';
import { BusinessProfile } from '../types';

interface DashboardClientViewProps {
  currentUser: User;
  bookings: Booking[];
  models: ModelProfile[];
  opportunities: Opportunity[];
  applications: Application[];
  businessProfiles: BusinessProfile[];
  onCancelBooking: (bookingId: string) => void;
  onPostOpportunity: (opp: Partial<Opportunity>) => void;
  onUpdateApplicationStatus: (appId: string, status: 'Accepted' | 'Rejected') => void;
  onCloseOpportunity: (oppId: string) => void;
  onUpdateBusinessProfile: (profile: BusinessProfile) => void;
  setCurrentScreen: (screen: AppScreen) => void;
  setSelectedModelId: (id: string | null) => void;
}

export default function DashboardClientView({
  currentUser,
  bookings,
  models,
  opportunities,
  applications,
  businessProfiles,
  onCancelBooking,
  onPostOpportunity,
  onUpdateApplicationStatus,
  onCloseOpportunity,
  onUpdateBusinessProfile,
  setCurrentScreen,
  setSelectedModelId
}: DashboardClientViewProps) {
  const [oppFormOpen, setOppFormOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  
  // Business profile lookup
  const businessProfile = useMemo(() => {
    return businessProfiles.find(p => p.user_id === currentUser.id) || {
      user_id: currentUser.id,
      registration_details: 'Unverified Account',
      website: '',
      social_links: '',
      address: '',
      is_verified: false
    };
  }, [businessProfiles, currentUser.id]);
  
  // Filter data for this client
  const clientOpportunities = useMemo(() => {
    return opportunities.filter(o => o.business_id === currentUser.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [opportunities, currentUser.id]);

  const activeOppCount = clientOpportunities.filter(o => o.status !== 'Filled' && o.status !== 'Expired').length;
  const filledOppCount = clientOpportunities.filter(o => o.status === 'Filled').length;
  
  const clientApps = useMemo(() => {
    const oppIds = clientOpportunities.map(o => o.id);
    return applications.filter(a => oppIds.includes(a.opportunity_id));
  }, [applications, clientOpportunities]);

  const pendingAppCount = clientApps.filter(a => a.status === 'Pending').length;

  const currentSelectedOpp = useMemo(() => {
    return clientOpportunities.find(o => o.id === selectedOppId);
  }, [clientOpportunities, selectedOppId]);

  const clientLocation = useMemo(() => {
    if (clientOpportunities.length > 0) {
      return `${clientOpportunities[0].location_city}, ${clientOpportunities[0].location_state}`;
    }
    return 'Lagos, Nigeria';
  }, [clientOpportunities]);

  const appsForSelectedOpp = useMemo(() => {
    if (!selectedOppId) return [];
    return applications.filter(a => a.opportunity_id === selectedOppId);
  }, [applications, selectedOppId]);

  // Filter bookings belonging to this client
  const clientBookings = useMemo(() => {
    return bookings
      .filter((b) => b.client_id === currentUser.id)
      .map((b) => {
        const model = models.find((m) => m.id === b.model_id);
        return {
          ...b,
          model_name: model ? model.name : 'Unknown Model',
          model_location: model ? model.location : 'N/A',
          model_avatar: model ? model.avatar : '',
          model_rate: model ? model.daily_rate : 0
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [bookings, currentUser.id, models]);

  const handleViewModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setCurrentScreen('profile');
  };

  return (
    <div id="client-dashboard-page" className="w-full pt-10 pb-24 bg-white dark:bg-slate-950 min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-100 dark:border-slate-800 pb-12">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 text-4xl font-black shadow-2xl">
              {currentUser.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100/50 dark:border-indigo-900/40">Verified Business</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3" /> {clientLocation}
                </span>
              </div>
              <h1 className="text-5xl font-black dark:text-white tracking-tighter leading-none">{currentUser.full_name}</h1>
              <div className="flex gap-4 mt-4">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Production Management Console</p>
                <button 
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity cursor-pointer px-2 py-1 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg"
                >
                  <Settings className="w-3.5 h-3.5" /> Edit Profile Specs
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
             <button
              onClick={() => setOppFormOpen(true)}
              className="px-8 py-4 bg-indigo-600 hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-950 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-3"
            >
              <Plus className="w-4 h-4" /> Create Opportunity
            </button>
            <button
              onClick={() => setCurrentScreen('opportunities')}
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-300 font-black rounded-2xl text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Briefcase className="w-4 h-4" /> Opportunity Wall
            </button>
          </div>
        </div>

        {/* Quick Performance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Live Castings', val: activeOppCount, icon: Briefcase, color: 'text-indigo-600' },
            { label: 'Successful Hires', val: filledOppCount, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Talent Network', val: clientApps.length, icon: Users, color: 'text-slate-600' },
            { label: 'Review Queue', val: pendingAppCount, icon: Hourglass, color: 'text-amber-600' }
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-transparent dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none group">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 bg-white dark:bg-slate-950 rounded-2xl shadow-sm ${s.color} group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-4xl font-black dark:text-white leading-none tracking-tighter">{s.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          {/* Main Dashboard: Opportunity List */}
          <section className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-3">
                  <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                  Your Active Listings
                </h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800">
                  {clientOpportunities.length} TOTAL SESSIONS
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {clientOpportunities.length > 0 ? (
                  clientOpportunities.map(opp => (
                    <div 
                      key={opp.id} 
                      className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
                        selectedOppId === opp.id 
                          ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-2xl' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50'
                      }`}
                      onClick={() => setSelectedOppId(opp.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                              selectedOppId === opp.id
                                ? 'bg-indigo-500 text-white'
                                : opp.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 
                                  opp.status === 'Filled' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {opp.status}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedOppId === opp.id ? 'text-slate-400' : 'text-slate-400'}`}>
                              Created {new Date(opp.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className={`text-xl font-black tracking-tight mb-4 ${selectedOppId === opp.id ? 'text-white dark:text-slate-950' : 'text-slate-900 dark:text-white'}`}>
                            {opp.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
                            <span className={`flex items-center gap-2 ${selectedOppId === opp.id ? 'text-slate-400' : 'text-slate-500'}`}>
                              <MapPin className="w-4 h-4" /> {opp.location_city}
                            </span>
                            <span className={`flex items-center gap-2 ${selectedOppId === opp.id ? 'text-slate-400' : 'text-slate-500'}`}>
                              <Users className="w-4 h-4" /> {opp.models_accepted_count}/{opp.models_needed} HIRED
                            </span>
                            <span className={`px-3 py-1 rounded-lg ${selectedOppId === opp.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                              {applications.filter(a => a.opportunity_id === opp.id).length} APPLICANTS
                            </span>
                          </div>
                        </div>
                        <div className={`p-4 rounded-2xl transition-all ${selectedOppId === opp.id ? 'bg-white/10 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 group-hover:text-indigo-600'}`}>
                          <ArrowRight className={`w-6 h-6 transition-transform ${selectedOppId === opp.id ? 'rotate-90 md:rotate-0' : ''}`} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                     <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-xl shadow-slate-200/50 dark:shadow-none">
                       <Briefcase className="w-10 h-10" />
                     </div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Initialize Your First Casting</h3>
                     <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">Your casting calls will appear here. Start by creating a new session to find the perfect talent.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Targeted Booking History */}
            <div className="space-y-6 pt-10">
                <h2 className="text-2xl font-black dark:text-white tracking-tight flex items-center gap-3">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full" />
                  Direct Bookings
                </h2>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
                  {clientBookings.length > 0 ? (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                      {clientBookings.map(b => (
                        <div key={b.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                          <div className="flex items-center gap-6">
                            <img src={b.model_avatar} className="w-16 h-16 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500 shadow-lg" alt="" />
                            <div>
                               <div className="flex items-center gap-3 mb-1">
                                <p className="text-lg font-black dark:text-white">{b.model_name}</p>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                  b.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>{b.status}</span>
                               </div>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{b.event_name} • {b.booking_date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleViewModel(b.model_id)}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic">No direct bookings in register</div>
                  )}
                </div>
            </div>
          </section>

          {/* Right Aside: Applicant Management */}
          <aside className="space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="bg-slate-900 dark:bg-white p-10 rounded-[3rem] shadow-2xl">
                <h2 className="text-2xl font-black text-white dark:text-slate-900 tracking-tight mb-2">Talent Review</h2>
                {currentSelectedOpp ? (
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest line-clamp-2">{currentSelectedOpp.title}</p>
                ) : (
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Awaiting session selection...</p>
                )}

                <div className="mt-10 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                  <AnimatePresence mode="wait">
                    {selectedOppId ? (
                      appsForSelectedOpp.length > 0 ? (
                        <div className="space-y-6">
                          {appsForSelectedOpp.map(app => (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={app.id} 
                              className="bg-white/5 dark:bg-slate-50 p-6 rounded-2xl border border-white/10 dark:border-slate-100"
                            >
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-black/20 overflow-hidden shadow-inner flex-shrink-0">
                                  {app.portfolio_photos[0] ? (
                                     <img src={app.portfolio_photos[0]} className="w-full h-full object-cover" alt="" />
                                  ) : (
                                     <div className="w-full h-full flex items-center justify-center text-white/20"><Users className="w-8 h-8" /></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-lg font-black text-white dark:text-slate-950 truncate">{app.full_name}</h4>
                                  <a href={`https://instagram.com/${app.instagram_handle}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-400 dark:text-indigo-600 flex items-center gap-2 uppercase tracking-widest">
                                    <Instagram className="w-3.5 h-3.5" /> @{app.instagram_handle}
                                  </a>
                                </div>
                              </div>

                              <div className="mb-6">
                                <span className="text-[10px] font-black text-white/30 dark:text-slate-400 uppercase tracking-widest block mb-2">Message</span>
                                <p className="text-xs text-slate-300 dark:text-slate-500 font-medium italic leading-relaxed">"{app.message || 'Transmission silent.'}"</p>
                              </div>
                              
                              <div className="flex items-center justify-between gap-4 mt-6">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                  app.status === 'Pending' ? 'bg-amber-400/20 text-amber-400' :
                                  app.status === 'Accepted' ? 'bg-emerald-400/20 text-emerald-400 dark:bg-emerald-50 dark:text-emerald-600' : 'bg-rose-400/20 text-rose-400'
                                }`}>
                                  {app.status}
                                </span>
                                
                                {app.status === 'Pending' && (
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                                      className="p-3 bg-white/5 dark:bg-slate-100 rounded-xl text-white/40 dark:text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                                      className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-950 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
                                    >
                                      Approve
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <Users className="w-12 h-12 text-white/10 dark:text-slate-100 mx-auto mb-4" />
                          <p className="text-xs font-black text-white/30 dark:text-slate-400 uppercase tracking-widest">No candidates identified</p>
                        </div>
                      )
                    ) : (
                      <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 dark:bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Compass className="w-8 h-8 text-white/20 dark:text-slate-200" />
                        </div>
                        <p className="text-xs font-black text-white/30 dark:text-slate-400 uppercase tracking-[0.2em] px-8">Select a casting session to initiate review protocols.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {currentSelectedOpp && currentSelectedOpp.status !== 'Filled' && (
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Production Control</p>
                  <button 
                    onClick={() => onCloseOpportunity(currentSelectedOpp.id)}
                    className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 hover:border-rose-100 rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" /> Close Casting Early
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <OpportunityForm 
        isOpen={oppFormOpen}
        onClose={() => setOppFormOpen(false)}
        onSubmit={onPostOpportunity}
        businessName={currentUser.full_name}
        isVerified={true} // Defaulting for the dashboard
      />

      <EditBusinessProfileModal 
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={businessProfile}
        onUpdate={(updated) => onUpdateBusinessProfile({ ...businessProfile, ...updated })}
      />
    </div>
  );
}
