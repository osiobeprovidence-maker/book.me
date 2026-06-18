/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-900 transition-colors duration-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-lg font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                BookMe <span className="font-light text-indigo-600 dark:text-indigo-400 normal-case tracking-widest pl-0.5 text-[10px]">Lite</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Connecting professional modeling talent with premium brands, photographers, and events around the world. Fully responsive. Production ready.
            </p>
          </div>

          {/* Directory Col */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase mb-4 font-sans">
              Find Talent
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Top Models & Runway
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Rising Star Talent
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Commercial & Activewear
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Fashion Editorial Specialists
                </span>
              </li>
            </ul>
          </div>

          {/* Platform Col */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase mb-4 font-sans">
              Platform Features
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Interactive Scheduler
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Secured Booking Request Flow
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Portfolio Image Galleries
                </span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                  Dual-Dashboard Interface
                </span>
              </li>
            </ul>
          </div>

          {/* Security & Integrity */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm tracking-wide uppercase mb-4 font-sans">
              Trust & Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Safeguarded by local storage encryption, verified user workflows, and state-driven profile protection.
            </p>
            <div className="flex items-center gap-1 text-[11px] font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/40 dark:border-indigo-900/30 w-fit px-2.5 py-1 rounded-lg">
              <Camera className="w-3.5 h-3.5" /> High-Art Curation
            </div>
          </div>

        </div>

        {/* Separator / Copyright */}
        <div className="border-t border-slate-200/80 dark:border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} BookMe Lite. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            
          </div>
        </div>
      </div>
    </footer>
  );
}
