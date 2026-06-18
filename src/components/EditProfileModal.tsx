/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModelProfile } from '../types';
import { X, Save, ShieldCheck, MapPin, DollarSign, BadgeCheck, Ruler } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ModelProfile;
  onUpdateProfile: (updated: Partial<ModelProfile>) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}: EditProfileModalProps) {
  const [bio, setBio] = useState(profile.bio || '');
  const [location, setLocation] = useState(profile.location || '');
  const [dailyRate, setDailyRate] = useState(profile.daily_rate || 1000);
  const [height, setHeight] = useState(profile.height || 175);
  const [age, setAge] = useState(profile.age || 21);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Non-binary' | 'Other'>(profile.gender || 'Female');
  const [experienceLevel, setExperienceLevel] = useState<'New Face' | 'Rising Star' | 'Professional' | 'Top Model'>(
    profile.experience_level || 'New Face'
  );
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!location.trim()) {
      setErrorMsg('Location is required so clients can browse by area.');
      return;
    }
    if (dailyRate <= 0) {
      setErrorMsg('Please specify a positive daily rate.');
      return;
    }
    if (height < 50 || height > 280) {
      setErrorMsg('Please input a valid height in cm.');
      return;
    }
    if (age < 16) {
      setErrorMsg('Minimum model talent registry age is 16.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onUpdateProfile({
        bio: bio.trim(),
        location: location.trim(),
        daily_rate: Number(dailyRate),
        height: Number(height),
        age: Number(age),
        gender,
        experience_level: experienceLevel,
        ...(avatarUrl !== profile.avatar ? { avatar: avatarUrl } : {}),
      });
      setSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      id="edit-profile-modal-overlay"
    >
      <div 
        id="edit-profile-modal"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              Customize Portfolio Bio & Stats
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage details presented on your high-art public model comp-card.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            id="close-edit-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation error */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-500 text-xs rounded-xl mb-4 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 shrink-0">
              <ImageUploader
                currentImage={avatarUrl}
                onImageSelect={setAvatarUrl}
                aspectRatio="square"
              />
            </div>
            <div>
              <p className="text-sm font-bold dark:text-white">Profile Photo</p>
              <p className="text-[11px] text-slate-400 font-medium">Upload a professional headshot</p>
            </div>
          </div>

          {/* Bio statement */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Professional Comp-Card Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell brands and talent agents about your editorial background, specialized runway, unique photoshoot adaptabilities..."
              rows={4}
              className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white resize-none"
              disabled={submitting}
            />
          </div>

          {/* Grid Layout Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Daily Rate */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Daily Rate (USD $)
              </label>
              <input
                type="number"
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                placeholder="Daily Rate"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
                disabled={submitting}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location City & Country
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Milan, IT"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
                disabled={submitting}
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-slate-400" />
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="in cm"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
                disabled={submitting}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="Age"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
                disabled={submitting}
              />
            </div>

            {/* Gender identity selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                Gender Identity
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white cursor-pointer"
                disabled={submitting}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Experience level tier */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
                Experience Tier Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white cursor-pointer"
                disabled={submitting}
              >
                <option value="New Face">New Face</option>
                <option value="Rising Star">Rising Star</option>
                <option value="Professional">Professional</option>
                <option value="Top Model">Top Model</option>
              </select>
            </div>

          </div>

          {/* Secure lock notice */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Profile parameters must match visual headshots. Verification reviews are conducted regularly.
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/15 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              disabled={submitting}
              id="save-profile-btn"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving Stats...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
