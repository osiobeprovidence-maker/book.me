/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, BarChart3, Shield, AlertTriangle, 
  Search, Filter, MoreHorizontal, ArrowUpRight,
  TrendingUp, DollarSign, UserCheck, Briefcase,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminViewProps {
  onBack: () => void;
}

export default function AdminView({ onBack }: AdminViewProps) {
  const [activeSegment, setActiveSegment] = useState<'overview' | 'users' | 'revenue' | 'content'>('overview');

  const stats = [
    { label: 'Total Users', value: '1,284', grow: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Revenue (MTD)', value: '$14,200', grow: '+24%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Active Jobs', value: '42', grow: '-2%', icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40' },
    { label: 'Verified Props', value: '412', grow: '+5%', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  ];

  const recentActivity = [
    { user: 'Elena Vance', action: 'Upgraded to Pro', time: '2m ago', type: 'revenue' },
    { user: 'Vogue Magazine', action: 'Posted new job', time: '14m ago', type: 'job' },
    { user: 'Sofia Chen', action: 'Updated portfolio', time: '45m ago', type: 'content' },
    { user: 'Marc Jacobs', action: 'Verified business', time: '1h ago', type: 'verification' },
    { user: 'System', action: 'Daily backup complete', time: '3h ago', type: 'system' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">
      
      {/* Top Admin Navigation */}
      <div className="border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                 <Shield className="w-6 h-6 text-indigo-600" />
                 <h1 className="text-xl font-black tracking-tight dark:text-white">Central Admin</h1>
              </div>
           </div>

           <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
              {['overview', 'users', 'revenue', 'content'].map((seg) => (
                <button
                  key={seg}
                  onClick={() => setActiveSegment(seg as any)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    activeSegment === seg 
                      ? 'bg-white dark:bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                  }`}
                >
                  {seg}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white dark:border-white/10 flex items-center justify-center text-xs font-black text-white">AD</div>
           </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-12">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {stats.map((stat, i) => (
             <motion.div 
               key={stat.label}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 }}
               className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-4"
             >
                <div className="flex items-center justify-between">
                   <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-black ${stat.grow.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      <TrendingUp className={`w-3 h-3 ${stat.grow.startsWith('-') && 'rotate-180'}`} />
                      {stat.grow}
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-3xl font-black dark:text-white">{stat.value}</h3>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
           
           {/* Detailed Table Placeholder / Activity Log */}
           <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black dark:text-white tracking-tight">Recent Activity Log</h2>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
                    View Full Audit Trail <ArrowUpRight className="w-3 h-3" />
                 </button>
              </div>

              <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[3rem] overflow-hidden">
                 <div className="max-h-[500px] overflow-y-auto">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${
                             activity.type === 'revenue' ? 'bg-emerald-100 text-emerald-600' : 
                             activity.type === 'job' ? 'bg-indigo-100 text-indigo-600' : 
                             'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60'
                           }`}>
                             {activity.user.charAt(0)}
                           </div>
                           <div>
                              <p className="text-sm font-bold dark:text-white">{activity.user}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{activity.action}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{activity.time}</p>
                           <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all">
                              <MoreHorizontal className="w-4 h-4 text-slate-400" />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Platform Status Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <h2 className="text-2xl font-black dark:text-white tracking-tight">System Status</h2>
              <div className="space-y-4">
                 {[
                   { label: 'API Gateway', status: 'Healthy', color: 'bg-emerald-500' },
                   { label: 'Authentication', status: 'Healthy', color: 'bg-emerald-500' },
                   { label: 'Media Storage', status: 'High Load', color: 'bg-amber-500' },
                   { label: 'Database Service', status: 'Healthy', color: 'bg-emerald-500' },
                 ].map((sys) => (
                   <div key={sys.label} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold dark:text-white">{sys.label}</p>
                         <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{sys.status}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${sys.color} shadow-lg shadow-emerald-500/20`} />
                   </div>
                 ))}
              </div>

              {/* Action Center */}
              <div className="p-8 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30">
                 <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-rose-600">Pending Safety Reviews</h4>
                 </div>
                 <p className="text-xs text-rose-500/80 font-medium mb-6">There are 12 profile reviews and 3 reported job postings that require attention.</p>
                 <button className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Enter Review Queue
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
