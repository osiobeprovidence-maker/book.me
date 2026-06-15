/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModelProfile } from '../types';
import { X, Calendar, MapPin, Film, AlignLeft, Info, HelpCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: ModelProfile;
  onSubmitBooking: (
    eventName: string,
    eventLocation: string,
    bookingDate: string,
    additionalNotes: string
  ) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  model,
  onSubmitBooking
}: BookingModalProps) {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!eventName.trim()) {
      setValidationError('Please specify a shoot or event name.');
      return;
    }
    if (!bookingDate) {
      setValidationError('Please select a calendar date.');
      return;
    }
    if (!eventLocation.trim()) {
      setValidationError('Please specify the event location (city, venue or studio).');
      return;
    }

    setSubmitting(true);
    // Mimic database query write lag
    setTimeout(() => {
      onSubmitBooking(
        eventName.trim(),
        eventLocation.trim(),
        bookingDate,
        additionalNotes.trim()
      );
      setSubmitting(false);
      onClose();
      // clean form
      setEventName('');
      setEventLocation('');
      setBookingDate('');
      setAdditionalNotes('');
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      id="booking-modal-overlay"
    >
      <div 
        id="booking-modal-container"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
              Book Model Talent
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sending schedule offer to <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{model.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            id="close-booking-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Snapshot Card */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl mb-6">
          <img 
            referrerPolicy="no-referrer"
            src={model.avatar} 
            alt={model.name} 
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{model.name}</div>
            <div className="text-xs text-slate-500">{model.location} • {model.experience_level}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold font-mono">Daily Rate</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-150">${model.daily_rate} USD</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* General Validation Alert */}
          {validationError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/30 text-rose-500 text-xs rounded-xl font-medium">
              {validationError}
            </div>
          )}

          {/* Event Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-slate-400" />
              Campaign / Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Summer Activewear Street Shoot"
              className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
              disabled={submitting}
            />
          </div>

          {/* Grid: Event Location & Target Booking Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Event Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Target Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Block previous dates
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
                disabled={submitting}
              />
            </div>

            {/* Event Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Shoot Location
              </label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g. Studio 5B / Miami Beach"
                className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white"
                disabled={submitting}
              />
            </div>

          </div>

          {/* Additional notes description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Additional Details & Deliverables
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Provide logistics such as outfits, expected shoots to complete, photography format, and makeup status..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-white resize-none"
              disabled={submitting}
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/40">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Submitting this form schedules the shoot date on your dashboard. Once the Model reviews and approves, status turns to <b>Accepted</b> and final calendar lock occurs.
            </p>
          </div>

          {/* Call to actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-2 border-t border-slate-100 dark:border-slate-800">
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
              id="submit-booking-offer-btn"
            >
              {submitting ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
