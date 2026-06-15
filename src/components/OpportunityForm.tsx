/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Opportunity, OpportunityStatus } from '../types';
import { NIGERIAN_STATES, MODEL_CATEGORIES } from '../constants';
import { 
  X, 
  MapPin, 
  Briefcase, 
  Plus, 
  Calendar, 
  Clock, 
  CreditCard, 
  Users, 
  CheckCircle,
  Hash,
  Star,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface OpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunity: Partial<Opportunity>) => void;
  businessName: string;
  businessLogo?: string;
  isVerified: boolean;
  initialData?: Opportunity;
}

export default function OpportunityForm({
  isOpen,
  onClose,
  onSubmit,
  businessName,
  businessLogo,
  isVerified,
  initialData
}: OpportunityFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.business_description || '');
  const [contactInfo, setContactInfo] = useState(initialData?.contact_info || '');
  const [locationState, setLocationState] = useState(initialData?.location_state || '');
  const [locationCity, setLocationCity] = useState(initialData?.location_city || '');
  const [venueAddress, setVenueAddress] = useState(initialData?.venue_address || '');
  const [category, setCategory] = useState(initialData?.category || 'Fashion');
  const [gender, setGender] = useState(initialData?.gender_requirement || 'Any');
  const [age, setAge] = useState(initialData?.age_requirement || '18-25');
  const [experience, setExperience] = useState(initialData?.experience_requirement || 'Any Experience');
  const [modelsNeeded, setModelsNeeded] = useState(initialData?.models_needed || 1);
  const [paymentType, setPaymentType] = useState<'Paid' | 'Unpaid'>(initialData?.payment_type || 'Paid');
  const [paymentAmount, setPaymentAmount] = useState(initialData?.payment_amount || '');
  const [eventDate, setEventDate] = useState(initialData?.event_date || '');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [rules, setRules] = useState(initialData?.rules || '');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const opportunityData: Partial<Opportunity> = {
      title,
      business_name: businessName,
      business_logo: businessLogo,
      business_description: description,
      contact_info: contactInfo,
      is_verified_business: isVerified,
      location_state: locationState,
      location_city: locationCity,
      venue_address: venueAddress,
      category,
      gender_requirement: gender,
      age_requirement: age,
      experience_requirement: experience,
      models_needed: Number(modelsNeeded),
      payment_type: paymentType,
      payment_amount: paymentType === 'Paid' ? paymentAmount : 'No Payment',
      event_date: eventDate,
      deadline,
      notes,
      rules,
      status: 'Open'
    };

    setTimeout(() => {
      onSubmit(opportunityData);
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full min-h-screen"
      >
        <div className="flex items-center justify-between p-8 md:p-12 border-b border-slate-50 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-30 max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white font-sans tracking-tight leading-none">
              Cast a New Call
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{businessName}</p>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Requirement definition</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white">Cancel</span>
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-20 pb-40">
            {/* Section 01: Core Intent */}
            <section className="space-y-10">
              <div className="flex items-center gap-4 mb-4">
                 <span className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-600/30">01</span>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Project Identity</h3>
              </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Opportunity Title</label>
                <input 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Lead Editorial for SS24 Collection"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white text-lg font-black tracking-tight"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">State in Nigeria</label>
                  <select 
                    required
                    value={locationState}
                    onChange={e => setLocationState(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
                  >
                    <option value="">Select Region</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">City / Town</label>
                  <input 
                    required
                    value={locationCity}
                    onChange={e => setLocationCity(e.target.value)}
                    placeholder="e.g. Lekki Phase 1"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Exact Venue Address (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    value={venueAddress}
                    onChange={e => setVenueAddress(e.target.value)}
                    placeholder="Full physical address for production"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Talent Specs */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">02</span>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Talent Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Gender</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Any</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Age Range</label>
                  <input 
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 18-28"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity</label>
                  <div className="relative">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number"
                      min="1"
                      required
                      value={modelsNeeded}
                      onChange={e => setModelsNeeded(parseInt(e.target.value))}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-black dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    {MODEL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Experience</label>
                  <select 
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option>Any Experience</option>
                    <option>Beginner (0-1yr)</option>
                    <option>Intermediate (1-3yrs)</option>
                    <option>Professional (3yrs+)</option>
                  </select>
                </div>
            </div>
          </section>

          {/* Section 03: Commercials */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">03</span>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Compensation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Structure</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setPaymentType('Paid')}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentType === 'Paid' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md ring-1 ring-slate-100 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Paid
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentType('Unpaid')}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentType === 'Unpaid' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md ring-1 ring-slate-100 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      TFP / Trade
                    </button>
                  </div>
                </div>

                {paymentType === 'Paid' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Fee per Talent</label>
                    <div className="relative">
                      <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input 
                        required
                        value={paymentAmount}
                        onChange={e => setPaymentAmount(e.target.value)}
                        placeholder="₦50,000"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}
            </div>
          </section>

          {/* Section 04: Logistics */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
               <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">04</span>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Project brief</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Date</label>
                <div className="relative">
                   <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type="date"
                    required
                    value={eventDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Application Deadline</label>
                <div className="relative">
                   <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                    type="date"
                    required
                    value={deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Main Briefing</label>
                <textarea 
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the production vision, brand mood, and project goals..."
                  rows={4}
                  className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rules & Casting Guidelines</label>
                <textarea 
                  value={rules}
                  onChange={e => setRules(e.target.value)}
                  placeholder="e.g. No heavy makeup, arrive 30 mins early, follow safety protocols..."
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none text-sm italic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Point of Contact (Shortlisted Only)</label>
                <div className="relative">
                  <Star className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                  <input 
                    required
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder="WhatsApp Number or Email"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Actions */}
          <div className="pt-10 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl pb-4 z-20">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel Listing
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-12 py-5 bg-indigo-600 hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 transition-all flex items-center gap-3 cursor-pointer disabled:opacity-50"
            >
               {submitting ? 'Authenticating Post...' : initialData ? 'Submit Update' : 'Initialize Post'}
               <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  </div>
);
}
