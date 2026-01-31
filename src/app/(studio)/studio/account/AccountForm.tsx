"use client";

import { useState } from 'react';
import { updateStudioSettings } from '@/app/actions';
import { 
  User, Mail, Lock, Sparkles, CreditCard, 
  Users, Bell, AlertCircle, CheckCircle2, Loader2, HelpCircle
} from "lucide-react";

interface AccountFormProps {
  teacher: any;
  studentCount: number;
  authEmail: string;
}

export default function AccountForm({ teacher, studentCount, authEmail }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: teacher.full_name || '',
    email: authEmail,
    password: '', // Empty by default
  });

  // Derived State
  const maxStudents = teacher.max_students || 5;
  const usagePercent = Math.min((studentCount / maxStudents) * 100, 100);
  const isNearLimit = usagePercent >= 80;
  const memberSince = new Date(teacher.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = new FormData();
    payload.append('fullName', formData.fullName);
    payload.append('email', formData.email);
    payload.append('password', formData.password);

    try {
      const result = await updateStudioSettings(payload);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: "Profile updated successfully." });
        setFormData(prev => ({ ...prev, password: '' })); // Clear password field
      }
    } catch (err) {
      setMessage({ type: 'error', text: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">Studio Settings</h1>
        <p className="text-zinc-500 font-medium">Manage your subscription and credentials.</p>
      </div>

      <div className="space-y-8">

        {/* 1. SUBSCRIPTION CARD (The Money Maker) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between mb-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase tracking-widest mb-2 border border-purple-200 dark:border-purple-800">
                <Sparkles size={12} /> {teacher.subscription_tier} Plan
              </div>
              <h3 className="text-xl font-bold">Student Capacity</h3>
            </div>
            
            {/* Upgrade Button (Only if not Enterprise) */}
            {teacher.subscription_tier !== 'enterprise' && (
              <a 
                href="/checkout"
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full shadow-sm shadow-amber-500/20 hover:scale-105 hover:shadow-amber-500/40 transition-all duration-300 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 text-black font-bold text-xs uppercase tracking-widest"
                >
                Upgrade <CreditCard size={14} />
              </a>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className={isNearLimit ? "text-red-500" : "text-zinc-500"}>
                {studentCount} / {maxStudents} Students Used
              </span>
              <span className="text-zinc-400">
                {Math.round(usagePercent)}%
              </span>
            </div>
            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${isNearLimit ? 'bg-red-500' : 'bg-zinc-900 dark:bg-white'}`} 
                style={{ width: `${usagePercent}%` }} 
              />
            </div>
            {isNearLimit && (
              <p className="text-xs text-red-500 font-bold flex items-center gap-2 animate-pulse">
                <AlertCircle size={12} /> You are reaching your limit. Upgrade to add more students.
              </p>
            )}
            <p className="text-[10px] text-zinc-400">
              *Additional students are billed at $5/month per 5-student block.
            </p>
          </div>
        </div>

        {/* 2. PROFILE FORM */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm space-y-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User size={20} className="text-zinc-400" /> Profile Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Full Name</label>
              <input 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 px-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Username (Locked) */}
            <div className="space-y-2 opacity-60 cursor-not-allowed group" title="Contact support to change your handle">
              <div className="flex justify-between items-center pr-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Studio Handle</label>
                <HelpCircle size={12} className="text-zinc-300 group-hover:text-purple-500 transition-colors" />
              </div>
              <input 
                disabled
                value={teacher.username}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-2xl py-3 px-4 font-bold text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-10 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="password"
                placeholder="Leave blank to keep current"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-10 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:font-normal"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button 
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* 3. NOTIFICATIONS (Placeholder) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Bell size={20} className="text-zinc-400" /> Notifications
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Coming Soon</span>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Manage your email and push notification preferences here.
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold pb-8">
          Member Since {memberSince}
        </div>

      </div>
    </div>
  );
}