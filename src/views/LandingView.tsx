/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ModelProfile, AppScreen } from '../types';
import ModelCard from '../components/ModelCard';
import { ArrowRight, Camera, ShieldCheck, HeartPulse, UserCheck, Play, Clapperboard, Star } from 'lucide-react';

interface LandingViewProps {
  featuredModels: ModelProfile[];
  onViewProfile: (modelId: string) => void;
  setCurrentScreen: (screen: AppScreen) => void;
  onExplore: () => void;
}

export default function LandingView({
  featuredModels,
  onViewProfile,
  setCurrentScreen,
  onExplore
}: LandingViewProps) {
  return (
    <div className="w-full" id="landing-page">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Soft background light/glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-150/40 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-150/40 dark:bg-sky-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col text */}
            <div className="text-left space-y-6 max-w-xl">
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs uppercase tracking-widest mb-2 block">
                Elite Talent Marketplace
              </span>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter mb-4 uppercase">
                Find & <br/> 
                <span className="text-white dark:text-transparent bg-indigo-600 dark:bg-clip-text dark:bg-gradient-to-r dark:from-white/10 dark:to-white/80 border-t border-b border-indigo-600/30 dark:border-white/25 px-3.5 py-1.5 my-2 inline-block">Book</span> <br/> 
                Talent.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-sans italic">
                The industry-standard luxury portal connecting high-end brands, designers, and curators with verified professional modeling talent worldwide.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setCurrentScreen('signup')}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2 group font-sans"
                  id="hero-get-started"
                >
                  Get Started 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  onClick={onExplore}
                  className="px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-full text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm font-sans"
                  id="hero-browse"
                >
                  Browse Models
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/40 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans">2.4k+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Verified Models</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans">850+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Active Agencies</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans">99.4%</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Expert Score</div>
                </div>
              </div>

            </div>

            {/* Right Col preview images layout */}
            <div className="relative flex justify-center items-center">
              
              {/* Main Image Frame (Overlap design) */}
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 bg-slate-200 z-10">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200" 
                  alt="High fashion showcase" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating visual indicators */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/70 text-white backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-sans">Sofia Chen</div>
                    <div className="text-[10px] text-slate-300 font-mono uppercase tracking-wider">Top Model • Milan, IT</div>
                  </div>
                  <div className="px-3 py-1.5 bg-indigo-500 rounded-lg text-xs font-semibold">$1,500/day</div>
                </div>
              </div>

              {/* Secondary Floating Image */}
              <div className="absolute -left-10 -bottom-8 w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-900 hidden sm:block z-20">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" 
                  alt="Menswear editorial" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative badges */}
              <div className="absolute -right-6 top-10 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-100 dark:border-slate-850 z-20">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-white leading-none">Instant Secure Booking</div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Verified escrow-backed terms</span>
                </div>
              </div>

              <div className="absolute left-1/2 -top-6 -translate-x-1/2 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-850 z-20">
                <Clapperboard className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-white font-sans">Runway & Editorial Audits</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Models Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div className="text-left max-w-lg">
              <h2 className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Our Curated Roster
              </h2>
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white block mt-2 font-sans">
                Featured Professional Model Profiles
              </span>
            </div>
            
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-all font-sans cursor-pointer group"
              id="landing-explore-more"
            >
              Explore Complete Directory 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredModels.map((model) => (
              <ModelCard 
                key={model.id} 
                model={model} 
                onViewProfile={onViewProfile} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-lg mx-auto space-y-3">
            <h2 className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Simple Logistics
            </h2>
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white block font-sans">
              How BookMe Lite Works
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl relative text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mb-4 font-sans text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Create Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Register as a <b>Client</b> to find talent, or as a <b>Model</b> to display your specialized portfolio and receive requests.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl relative text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mb-4 font-sans text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Browse Models
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Filter and browse models by geographical area, physical stats, gender identity, pricing tiers, and expertise level.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl relative text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold mb-4 font-sans text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Submit Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Specify shoot name, location, and dates. Let the candidate model review logistical needs and confirm availability.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl relative text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-4 font-sans text-lg">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Confirm Booking
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Once the model clicks <b>Accept</b>, details lock on both dashboards and your production schedule is set.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transiton-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="max-w-lg mx-auto space-y-3">
            <h2 className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Industry Approval
            </h2>
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white block font-sans">
              Loved by Top Brands and Creatives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100/80 dark:border-slate-900 flex flex-col justify-between text-left">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "Finding verified talent with precise heights and schedules for our winter catalogue is traditionally stressful. BookMe Lite allowed us to search, filter, and lock three professional models within an afternoon."
              </p>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-850">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="Sarah J" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-sans">Sarah Jenkins</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">Alt Fashion Dir • Paris</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100/80 dark:border-slate-900 flex flex-col justify-between text-left">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "I registered as a professional model profile three months ago. Having a secured dashboard where I can directly accept, decline, and log specific photoshoots gives me immense control over my calendar."
              </p>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-850">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Sofia C" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-sans">Sofia Chen</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">Top Model • Milan</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100/80 dark:border-slate-900 flex flex-col justify-between text-left">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "Direct communication and transparency in daily rates make booking photography sessions remarkably straightforward. The glassmorphism design and responsiveness are incredibly satisfying."
              </p>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-850">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="David K" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-sans">Dave Knight</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">Chief Photographer • NY</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Call To Action Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 dark:from-indigo-950 dark:via-slate-900 dark:to-indigo-950 border border-slate-800 p-8 sm:p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
            
            {/* Background glowing ring */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-xl mx-auto space-y-6">
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight leading-tight">
                Ready to Find Your <br />Next Visual Visual Standard?
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Join thousands of designers, creative agencies, and professional modeling professionals today. Access secure calendars, profile filters, and interactive request dashboards.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setCurrentScreen('signup')}
                  className="px-8 py-3.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl font-bold font-sans transition-all cursor-pointer shadow-lg shadow-black/10"
                >
                  Create Account
                </button>
                <button
                  onClick={onExplore}
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl font-bold font-sans transition-all cursor-pointer"
                >
                  Explore Models
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
