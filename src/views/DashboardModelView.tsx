/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { User, Booking, ModelProfile, PortfolioImage, AppScreen, Application, Opportunity } from '../types';
import EditProfileModal from '../components/EditProfileModal';
import { 
  Compass, Award, MapPin, Ruler, Inbox, CheckCircle2, XCircle, 
  Settings2, Plus, Sparkles, Image as ImageIcon, CalendarCheck, HelpCircle, FileCheck, Trash, PlusCircle,
  Briefcase, Send, Clock, AlertCircle, Share2, Upload
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardModelViewProps {
  currentUser: User;
  bookings: Booking[];
  models: ModelProfile[];
  portfolio: PortfolioImage[];
  applications: Application[];
  opportunities: Opportunity[];
  onAcceptBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onUpdateProfile: (updated: Partial<ModelProfile>) => void;
  onAddPortfolioImage: (imageUrl: string, type?: 'image' | 'video', muxPlaybackId?: string, muxAssetId?: string) => void;
  onDeletePortfolioImage: (imageId: string) => void;
  setSelectedModelId: (id: string | null) => void;
  setCurrentScreen: (screen: AppScreen) => void;
}

export default function DashboardModelView({
  currentUser,
  bookings,
  models,
  portfolio,
  applications,
  opportunities,
  onAcceptBooking,
  onRejectBooking,
  onUpdateProfile,
  onAddPortfolioImage,
  onDeletePortfolioImage,
  setSelectedModelId,
  setCurrentScreen
}: DashboardModelViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'applications'>('requests');
  const [uploadProgressSim, setUploadProgressSim] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  // Model profile specific lookup
  const modelProfile = useMemo(() => {
    return models.find((m) => m.user_id === currentUser.id) || null;
  }, [models, currentUser.id]);

  // Specific portfolio image lookup
  const modelPortfolio = useMemo(() => {
    if (!modelProfile) return [];
    return portfolio.filter((img) => img.model_id === modelProfile.id);
  }, [portfolio, modelProfile]);

  // Capture bookings targeted to this model
  const incomingBookings = useMemo(() => {
    if (!modelProfile) return [];
    return bookings
      .filter((b) => b.model_id === modelProfile.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [bookings, modelProfile]);

  // Calculate stats metrics
  const stats = useMemo(() => {
    const acceptedCount = applications.filter(a => a.status === 'Accepted').length;
    const pendingCount = applications.filter(a => a.status === 'Pending').length;
    return { accepted: acceptedCount, pending: pendingCount, totalApps: applications.length };
  }, [applications]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5MB.'); return; }
    setFileUploading(true);
    setUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      onAddPortfolioImage(reader.result as string);
      setFileUploading(false);
    };
    reader.onerror = () => { setUploadError('Failed to read file.'); setFileUploading(false); };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  // Simulated upload
  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setUploadProgressSim(true);
    setTimeout(() => {
      onAddPortfolioImage(newImageUrl.trim());
      setNewImageUrl('');
      setUploadProgressSim(false);
    }, 900);
  };

  return (
    <div id="model-dashboard-page" className="w-full py-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img 
              referrerPolicy="no-referrer"
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 border"
            />
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                Model Registry Account
              </span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                {currentUser.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                {modelProfile && (
                  <>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> {modelProfile.location}</span>
                    <span className="flex items-center gap-1"><Ruler className="w-4 h-4 text-slate-400" /> {modelProfile.height} cm</span>
                    <span className="flex items-center gap-1"><Award className="w-4 h-4 text-slate-400" /> ${modelProfile.daily_rate}/day</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button 
              onClick={() => {
                if (modelProfile) {
                  setSelectedModelId(modelProfile.id);
                  setCurrentScreen('public-profile');
                }
              }}
              className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              <Share2 className="w-4 h-4" /> Share Bio-Link
            </button>
            <button
                onClick={() => setProfileModalOpen(true)}
                className="px-5 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Settings2 className="w-4 h-4" /> Edit Specs
              </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
             <Briefcase className="w-6 h-6 text-indigo-600 mb-2" />
             <p className="text-2xl font-black dark:text-white">{stats.totalApps}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Applications Submitted</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
             <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-2" />
             <p className="text-2xl font-black dark:text-white">{stats.accepted}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accepted Applications</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
             <Clock className="w-6 h-6 text-amber-600 mb-2" />
             <p className="text-2xl font-black dark:text-white">{stats.pending}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Responses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="flex border-b border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setActiveTab('requests')}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'requests' ? 'text-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Targeted Requests ({incomingBookings.length})
                </button>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'applications' ? 'text-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Wall Applications ({applications.length})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'requests' ? (
                  <div className="space-y-4">
                    {incomingBookings.length > 0 ? (
                      incomingBookings.map(b => (
                        <div key={b.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                           <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</p>
                                <p className="text-sm font-bold dark:text-white">{b.client_name || b.client_email}</p>
                              </div>
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${
                                 b.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 
                                 b.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                              }`}>{b.status}</span>
                           </div>
                           <h4 className="font-bold text-slate-800 dark:text-white mb-2">{b.event_name}</h4>
                           <div className="flex gap-4 text-xs text-slate-500 mb-4">
                              <span className="flex items-center gap-1.5"><CalendarCheck className="w-3.5 h-3.5" /> {b.booking_date}</span>
                              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {b.event_location}</span>
                           </div>
                           {b.status === 'Pending' && (
                             <div className="flex gap-2">
                                <button onClick={() => onRejectBooking(b.id)} className="flex-1 py-2 text-rose-600 bg-rose-50 dark:bg-rose-950/20 text-xs font-bold rounded-lg cursor-pointer">Decline</button>
                                <button onClick={() => onAcceptBooking(b.id)} className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer">Accept Offer</button>
                             </div>
                           )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                         <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                         <p className="text-sm text-slate-400 font-medium">No targeted requests yet.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.length > 0 ? (
                      applications.map(app => {
                        const opp = opportunities.find(o => o.id === app.opportunity_id);
                        return (
                          <div key={app.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                             <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-slate-300" />
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{opp?.business_name || 'Business'}</p>
                                </div>
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                                   app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 
                                   app.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                                }`}>{app.status}</span>
                             </div>
                             <h4 className="font-bold text-slate-900 dark:text-white mb-1">{opp?.title || 'Unknown Casting'}</h4>
                             <p className="text-[11px] text-slate-500 line-clamp-1 italic mb-3">Your message: "{app.message || '...'}"</p>
                             <div className="flex items-center justify-between">
                                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                   <Clock className="w-3 h-3" /> {new Date(app.created_at).toLocaleDateString()}
                                </div>
                                {app.status === 'Accepted' && (
                                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                      <CheckCircle2 className="w-3 h-3" /> Shortlisted
                                   </div>
                                )}
                             </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                         <Send className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                         <p className="text-sm text-slate-400 font-medium">You haven't applied to any opportunities yet.</p>
                         <button onClick={() => setCurrentScreen('opportunities')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Browse Opportunity Wall</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-base font-bold dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-indigo-500" />
                  Portfolio Highlights
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                   {modelPortfolio.slice(0, 4).map(img => (
                     <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 dark:border-slate-800">
                        <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                     </div>
                   ))}
                </div>
                {uploadError && <p className="text-[11px] text-rose-500 font-medium">{uploadError}</p>}
                <form onSubmit={handleSimulateUpload} className="space-y-2">
                   <input 
                      value={newImageUrl}
                      onChange={e => { setNewImageUrl(e.target.value); setUploadError(''); }}
                      placeholder="Paste image URL..."
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                   />
                   <button type="submit" disabled={uploadProgressSim} className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">
                      {uploadProgressSim ? 'Adding...' : 'Add from URL'}
                   </button>
                </form>
                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                   </div>
                   <div className="relative flex justify-center">
                      <span className="px-2 text-[10px] text-slate-400 bg-white dark:bg-slate-900 font-medium">or</span>
                   </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileUploading}
                  className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-500 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {fileUploading ? 'Uploading...' : 'Upload from Device'}
                </button>
            </section>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/20">
                <Sparkles className="w-8 h-8 mb-4 text-indigo-200" />
                <h3 className="text-lg font-bold mb-2">Get Verified</h3>
                <p className="text-xs text-indigo-100 mb-6 leading-relaxed">Verified models get 5x more visibility and higher response rates from luxury brand clients.</p>
                <button className="w-full py-3 bg-white text-indigo-600 text-xs font-bold rounded-xl shadow-lg cursor-pointer">Verify My Account</button>
            </div>
          </div>
        </div>
      </div>

      {modelProfile && (
        <EditProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          profile={modelProfile}
          onUpdateProfile={onUpdateProfile}
        />
      )}
    </div>
  );
}
