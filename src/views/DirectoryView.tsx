/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ModelProfile } from '../types';
import ModelCard from '../components/ModelCard';
import { Search, MapPin, SlidersHorizontal, Sliders, X, Filter, ChevronDown, DollarSign } from 'lucide-react';

interface DirectoryViewProps {
  models: ModelProfile[];
  onViewProfile: (modelId: string) => void;
}

export default function DirectoryView({ models, onViewProfile }: DirectoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [maxRate, setMaxRate] = useState<number>(3000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter logic
  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = model.location.toLowerCase().includes(locationTerm.toLowerCase());
      const matchesGender = selectedGender === 'All' || model.gender === selectedGender;
      const matchesExperience = selectedExperience === 'All' || model.experience_level === selectedExperience;
      const matchesRate = model.daily_rate <= maxRate;

      return matchesSearch && matchesLocation && matchesGender && matchesExperience && matchesRate;
    });
  }, [models, searchTerm, locationTerm, selectedGender, selectedExperience, maxRate]);

  const clearFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setSelectedGender('All');
    setSelectedExperience('All');
    setMaxRate(3000);
  };

  return (
    <div id="directory-page" className="w-full py-10 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Intro Header */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            High-Art Talent Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            Explore Professional Models
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Filter our premium roster of models and talent agents around the globe.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 p-4 sm:p-6 shadow-md shadow-slate-200/50 dark:shadow-none space-y-4">
          
          {/* Main search line */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Search by Name */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models by name..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                id="search-name"
              />
            </div>

            {/* Search by Location */}
            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                placeholder="Search by city (e.g. New York, Milano)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:border-indigo-500 focus:outline-none dark:text-white"
                id="search-location"
              />
            </div>

            {/* Mobile Filters Toggle trigger */}
            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex-1 md:flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                id="toggle-advanced-filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Filters</span>
                {showMobileFilters ? <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 transition-transform" />}
              </button>

              {(searchTerm || locationTerm || selectedGender !== 'All' || selectedExperience !== 'All' || maxRate < 3000) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-3 border border-rose-100 hover:bg-rose-50 text-rose-500 rounded-2xl cursor-pointer transition-colors"
                  title="Clear Filters"
                  id="clear-all-filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Advanced collapsible filter parameters */}
          {showMobileFilters && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-3 duration-200">
              
              {/* Gender Radio buttons */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-450 uppercase tracking-widest leading-none mb-1.5 font-sans">
                  Gender Customization
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Female', 'Male', 'Non-binary'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        selectedGender === gender
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-150 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Tier Levels selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest leading-none mb-1.5 font-sans">
                  Experience Tier
                </label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-4.5 py-3 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Tiers Combined</option>
                  <option value="New Face">New Face</option>
                  <option value="Rising Star">Rising Star</option>
                  <option value="Professional">Professional-grade</option>
                  <option value="Top Model">Top Model elite</option>
                </select>
              </div>

              {/* Slider for Daily rates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest leading-none font-sans">
                    Max Daily Rate (USD)
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    ${maxRate}/day
                  </span>
                </div>
                <div className="pt-2">
                  <input
                    type="range"
                    min="400"
                    max="3000"
                    step="50"
                    value={maxRate}
                    onChange={(e) => setMaxRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>$400</span>
                    <span>$1,700</span>
                    <span>$3,000+</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Directory Listings Count */}
        <div className="flex items-center justify-between text-left">
          <p className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
            Showing {filteredModels.length} models found
          </p>
        </div>

        {/* Results grid */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-[2rem] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-850 dark:text-white font-sans">
                No Model Profiles Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No talents match your exact filter configuration. Try broadening your maximum budget rate or typing a different city query.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
