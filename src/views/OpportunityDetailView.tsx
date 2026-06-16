import React from 'react';
import { Opportunity, Application, User } from '../types';
import {
  ArrowLeft,
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
  AlertTriangle,
  Building,
  Users,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  currentUser: User | null;
  onApply: (opportunity: Opportunity) => void;
  onBack: () => void;
  onViewBrand: (businessId: string) => void;
}

export default function OpportunityDetailView({
  opportunity,
  currentUser,
  onApply,
  onBack,
  onViewBrand,
}: OpportunityDetailViewProps) {
  const isModel = currentUser?.role === 'model';
  const isFilled = opportunity.status === 'Filled' || opportunity.status === 'Expired';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'Almost Full': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'Filled': return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      case 'Expired': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const daysLeft = Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to opportunities
        </button>

        {/* Hero Section */}
        <div className="relative h-56 sm:h-72 rounded-[2rem] bg-slate-200 dark:bg-slate-800 overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(opportunity.status)}`}>
                {opportunity.status}
              </span>
              {opportunity.is_verified_business && (
                <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              {daysLeft > 0 && opportunity.status === 'Open' && (
                <span className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-bold">
                  <Clock className="w-3 h-3" /> {daysLeft}d left
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{opportunity.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Brand Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <button
                onClick={() => onViewBrand(opportunity.business_id)}
                className="flex items-center gap-4 group cursor-pointer w-full text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30 shrink-0">
                  {opportunity.business_logo ? (
                    <img src={opportunity.business_logo} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building className="w-6 h-6 text-indigo-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {opportunity.business_name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{opportunity.business_description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>
            </div>

            {/* Description & Details */}
            {opportunity.notes && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Project Brief</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{opportunity.notes}</p>
              </div>
            )}

            {opportunity.rules && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Rules & Guidelines</h3>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">{opportunity.rules}</p>
                </div>
              </div>
            )}

            {opportunity.venue_address && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Venue / Location</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">{opportunity.venue_address}</p>
                </div>
                <p className="text-xs text-slate-400 mt-1 ml-7">{opportunity.location_city}, {opportunity.location_state}</p>
              </div>
            )}

            {/* Contact */}
            {opportunity.contact_info && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-3">Contact Information</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  {opportunity.contact_info}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Opportunity Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Category</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Location</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.location_city}, {opportunity.location_state}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Event Date</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.event_date || 'TBD'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Deadline</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.deadline || 'TBD'}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Compensation</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {opportunity.payment_amount || opportunity.payment_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Talent Requirements */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Talent Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Models Needed</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.models_needed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Applied</span>
                  <span className={`text-xs font-bold ${opportunity.models_applied_count > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {opportunity.models_applied_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Gender</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.gender_requirement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Age Range</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.age_requirement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Experience</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{opportunity.experience_requirement}</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            {isModel && (
              <button
                onClick={() => onApply(opportunity)}
                disabled={isFilled}
                className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isFilled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 cursor-pointer'
                }`}
              >
                {isFilled ? (
                  <><CheckCircle2 className="w-4 h-4" /> {opportunity.status === 'Filled' ? 'Position Filled' : 'Expired'}</>
                ) : (
                  <><Briefcase className="w-4 h-4" /> Apply Now</>
                )}
              </button>
            )}

            {!currentUser && (
              <p className="text-xs text-slate-400 text-center">Log in as a model to apply for this opportunity.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}


