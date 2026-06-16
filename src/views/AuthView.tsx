import React, { useState } from 'react';
import { AppScreen, UserRole, User } from '../types';
import { 
  Camera, Briefcase, Lock, Mail, User as UserIcon, Sparkles, Key, 
  AlertCircle, RefreshCw, Globe, Award, Ruler, Check, ChevronRight, 
  ArrowLeft, Coins, CheckCircle2, ShieldCheck, MapPin
} from 'lucide-react';
import { signUpWithEmail, loginWithEmail, loginWithGoogle, resetPassword } from '../lib/firebase';

const FIREBASE_ENABLED = !!import.meta.env.VITE_FIREBASE_API_KEY;

interface AuthViewProps {
  initialMode: 'login' | 'signup';
  onAuthenticate: (user: User, profileSpecs?: any) => void;
  setCurrentScreen: (screen: AppScreen) => void;
}

export default function AuthView({
  initialMode,
  onAuthenticate,
  setCurrentScreen
}: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [subStage, setSubStage] = useState<'credentials' | 'profile-form'>('credentials');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  
  const [age, setAge] = useState<number>(23);
  const [height, setHeight] = useState<number>(175);
  const [gender, setGender] = useState<string>('Female');
  const [experienceLevel, setExperienceLevel] = useState<string>('New Face');
  const [location, setLocation] = useState('Paris, FR');
  const [dailyRate, setDailyRate] = useState<number>(1200);
  const [modelBio, setModelBio] = useState('Professional talent with runway, commercial and high-fashion experience.');

  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [sector, setSector] = useState('Fashion Design House');
  const [clientLocation, setClientLocation] = useState('Paris, FR');
  const [clientBio, setClientBio] = useState('Luxury curation group booking premium global campaigns.');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSSO = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!FIREBASE_ENABLED) {
      setErrorMsg('Firebase is not configured. Add VITE_FIREBASE_API_KEY to your .env file.');
      return;
    }
    try {
      setLoading(true);
      const fbUser = await loginWithGoogle();
      const authenticatedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || name || 'User',
        email: fbUser.email || email,
        role: role,
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
        created_at: new Date().toISOString(),
        firebaseUid: fbUser.uid,
      };

      if (mode === 'login') {
        onAuthenticate(authenticatedUser);
      } else {
        setEmail(fbUser.email || '');
        setName(fbUser.displayName || '');
        setSubStage('profile-form');
      }
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed');
      setLoading(false);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      if (!FIREBASE_ENABLED) {
        setSuccessMsg(`Password reset link sent to ${email.trim()} (simulated).`);
        return;
      }
      try {
        setLoading(true);
        await resetPassword(email.trim());
        setSuccessMsg(`Password reset link sent to ${email.trim()}.`);
        setLoading(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to send reset email');
        setLoading(false);
      }
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please complete all credential fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    if (mode === 'login') {
      if (!FIREBASE_ENABLED) {
        setErrorMsg('Firebase is not configured. Use demo accounts or add Firebase credentials.');
        return;
      }
      try {
        setLoading(true);
        const fbUser = await loginWithEmail(email.trim(), password);
        const authenticatedUser: User = {
          id: fbUser.uid,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          created_at: new Date().toISOString(),
          firebaseUid: fbUser.uid,
        };
        onAuthenticate(authenticatedUser);
        setLoading(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Login failed. Check your credentials.');
        setLoading(false);
      }
    } else {
      setSubStage('profile-form');
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let fbUser: any = null;

      if (FIREBASE_ENABLED) {
        fbUser = await signUpWithEmail(name.trim(), email.trim().toLowerCase(), password);
      }

      const uid = fbUser?.uid || 'u_' + Math.random().toString(36).substring(2, 9);
      const avatar = fbUser?.photoURL || (
        role === 'model'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
      );

      const authenticatedUser: User = {
        id: uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role,
        avatar,
        created_at: new Date().toISOString(),
        firebaseUid: uid,
      };

      const customSpecs = role === 'model' ? {
        bio: modelBio.trim(),
        age: Number(age),
        height: Number(height),
        gender,
        location: location.trim(),
        daily_rate: Number(dailyRate),
        experience_level: experienceLevel,
      } : {
        brandName: brandName.trim() || name.trim() + ' Agency',
        website: website.trim(),
        sector,
        location: clientLocation.trim(),
        bio: clientBio.trim(),
      };

      onAuthenticate(authenticatedUser, customSpecs);
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Account creation failed.');
      setLoading(false);
    }
  };

  const fillDemo = (demoRole: UserRole) => {
    if (demoRole === 'model') {
      setName('Sofia Chen');
      setEmail('sofia@model.com');
      setRole('model');
      setPassword('password123');
    } else if (demoRole === 'client') {
      setName('Agatha Bloom');
      setEmail('director@vogue.com');
      setRole('client');
      setPassword('password123');
    } else {
      setName('Admin Control');
      setEmail('admin@bookme.platform');
      setRole('admin');
      setPassword('admin123');
    }
  };

  const handleFallbackAuth = () => {
    const avatar = role === 'model'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

    const authenticatedUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      avatar,
      created_at: new Date().toISOString(),
    };

    onAuthenticate(authenticatedUser);
  };

  return (
    <div id="auth-portal" className="w-full min-h-screen py-10 md:py-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden text-left">
      
      <div className="absolute top-1/4 left-10 md:left-20 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
        <h2 className="text-[170px] font-bold leading-none font-sans select-none">PORTAL</h2>
      </div>
      <div className="absolute -right-20 bottom-1/4 opacity-[0.02] dark:opacity-[0.04] pointer-events-none select-none">
        <h2 className="text-[200px] font-bold leading-none font-sans select-none">B/M</h2>
      </div>

      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-lg px-4 sm:px-6 z-10">
        
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-150 dark:border-slate-850 p-6 sm:p-9 shadow-xl space-y-6 relative">
          
          <button 
            onClick={() => setCurrentScreen('home')}
            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer group"
            title="Cancel and return to Home"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-black font-sans tracking-tighter text-slate-900 dark:text-white mb-2">
              BOOKME
            </div>
            
            {mode === 'login' && (
              <>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans mt-2 tracking-tight">Log In to BookMe</h1>
                <p className="text-xs text-slate-500 font-sans">Access campaign monitors and filter elite talent</p>
                
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mt-4">
                  <button 
                    onClick={() => setRole('model')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${role === 'model' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    As Model
                  </button>
                  <button 
                    onClick={() => setRole('client')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${role === 'client' ? 'bg-white dark:bg-slate-950 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    As Client
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <>
                <div className="flex items-center justify-center gap-2 text-xs font-bold font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full w-max mx-auto">
                  <span>Step {subStage === 'credentials' ? '1 of 2' : '2 of 2'}</span>
                  <span>•</span>
                  <span>{subStage === 'credentials' ? 'Secure Login Registry' : 'Professional Profile Details'}</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans mt-2 tracking-tight">
                  {subStage === 'credentials' ? 'Create Your Account' : 'Complete Your Specifications'}
                </h1>
                <p className="text-xs text-slate-500 font-sans">
                  {subStage === 'credentials' 
                    ? 'Establish secure credentials then select your role.' 
                    : 'Select your account type and specify details for directory listings.'}
                </p>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans mt-2 tracking-tight">Forgot Access Key?</h1>
                <p className="text-xs text-slate-500 font-sans">Dispatches registered credentials reset token instantly</p>
              </>
            )}
          </div>

          {!FIREBASE_ENABLED && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 text-xs rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Firebase not configured. Using local fallback auth.
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-955 border border-rose-100 dark:border-rose-900/30 text-rose-500 text-xs rounded-xl flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-955 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
              {successMsg}
            </div>
          )}

          {subStage === 'credentials' && (
            <div className="space-y-5">
              
              {mode !== 'forgot' && FIREBASE_ENABLED && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSSO}
                    className="w-full py-3.5 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-wider text-slate-805 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm"
                    disabled={loading}
                    id="google-sso-cta"
                  >
                    <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 018 12.57a5.94 5.94 0 015.99-5.94c1.614 0 3.086.61 4.217 1.626l3.125-3.125A10.231 10.231 0 0013.99 2 10.27 10.27 0 003.7 12.285 10.27 10.27 0 0013.99 22.57c5.684 0 10.285-4.5 10.285-10.285 0-.693-.075-1.378-.2-2H12.24z"
                      />
                    </svg>
                    {mode === 'login' ? 'Sign In with Google' : 'Sign Up with Google'}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200/70 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                      Or use email credentials
                    </span>
                    <div className="flex-grow border-t border-slate-200/70 dark:border-slate-800"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Vance"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@agency.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Password Credentials
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Secure password key"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Verifying credentials...
                      </>
                    ) : mode === 'login' ? (
                      'Log In'
                    ) : mode === 'signup' ? (
                      <span className="flex items-center gap-1">Continue to Profile Setup <ChevronRight className="w-4 h-4" /></span>
                    ) : (
                      'Send Password Reset link'
                    )}
                  </button>

                  {mode === 'login' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                       <button
                         type="button"
                         onClick={() => fillDemo('model')}
                         className="py-2.5 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-500 hover:text-indigo-600 transition-all"
                       >
                         Demo Model
                       </button>
                       <button
                         type="button"
                         onClick={() => fillDemo('client')}
                         className="py-2.5 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-500 hover:text-indigo-600 transition-all"
                       >
                         Demo Client
                       </button>
                       <button
                         type="button"
                         onClick={() => fillDemo('admin')}
                         className="col-span-2 py-2.5 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                       >
                         <ShieldCheck className="w-3 h-3" /> Platform Admin
                       </button>
                    </div>
                  )}

                  {!FIREBASE_ENABLED && mode === 'login' && (
                    <button
                      type="button"
                      onClick={handleFallbackAuth}
                      className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      Continue without Firebase (Offline Mode)
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

          {mode === 'signup' && subStage === 'profile-form' && (
            <form onSubmit={handleStep2Submit} className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              
              <div className="flex items-center gap-2 bg-indigo-50/40 dark:bg-indigo-950/20 p-3 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-sans leading-normal">
                  Credentials locked in! Now select whether you are a Model/Talent or a Business/Brand Client, then provide your specs to complete setup.
                </span>
              </div>

              <div className="space-y-2.5 pt-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  <div
                    onClick={() => setRole('model')}
                    className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all col-span-1 ${
                      role === 'model'
                        ? 'border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <Camera className={`w-5 h-5 mx-auto mb-2 ${role === 'model' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="block text-xs font-bold dark:text-white leading-none">Model / Talent</span>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-normal">Publish comp-cards & apply to bookings</span>
                  </div>

                  <div
                    onClick={() => setRole('client')}
                    className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all col-span-1 ${
                      role === 'client'
                        ? 'border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 mx-auto mb-2 ${role === 'client' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="block text-xs font-bold dark:text-white leading-none">Business / Client</span>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-normal">Hire premium talent & book campaigns</span>
                  </div>

                </div>
              </div>

              {role === 'model' ? (
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min={16}
                        max={80}
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Height (cm)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={140}
                          max={220}
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                          required
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] tracking-wide text-slate-400 uppercase font-bold font-mono">cm</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Gender Designation
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white font-sans"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Experience Tier
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white font-sans"
                      >
                        <option value="New Face">New Face</option>
                        <option value="Rising Star">Rising Star</option>
                        <option value="Professional">Professional Tier</option>
                        <option value="Top Model">Executive Top Model</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Active Hub / City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Paris, FR"
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Expected Daily Rate
                      </label>
                      <div className="relative">
                        <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
                        <input
                          type="number"
                          min={200}
                          max={15000}
                          value={dailyRate}
                          onChange={(e) => setDailyRate(Number(e.target.value))}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] tracking-widest text-slate-400 font-mono font-bold">/DAY USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                      Professional Bio Snippet
                    </label>
                    <textarea
                      value={modelBio}
                      onChange={(e) => setModelBio(e.target.value)}
                      rows={3}
                      placeholder="Write 1-2 editorial sentences about your portfolio focus..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white font-sans leading-relaxed"
                      required
                    />
                  </div>

                </div>
              ) : (
                <div className="space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                      Corporate / Brand Curation Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Prada Styling Hub"
                      className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Brand URL / Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="vogue.com"
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                        Industry / Focus Sector
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white font-sans"
                      >
                        <option value="Fashion Design House">Fashion Design House</option>
                        <option value="Editorial Curators">Editorial & Magazines</option>
                        <option value="Modeling Agency">Agency Representatives</option>
                        <option value="Independent Photographer">Photographers Group</option>
                        <option value="Advertising Campaigns">Creative Production Ad</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                      Headquarters Hub Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={clientLocation}
                        onChange={(e) => setClientLocation(e.target.value)}
                        placeholder="e.g. Milan, IT"
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                      Corporate Campaign Summary / Mission
                    </label>
                    <textarea
                      value={clientBio}
                      onChange={(e) => setClientBio(e.target.value)}
                      rows={3}
                      placeholder="e.g. Curation agency booking international runway productions..."
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white font-sans leading-relaxed"
                      required
                    />
                  </div>

                </div>
              )}

              <div className="flex items-center gap-3 pt-3">
                
                <button
                  type="button"
                  onClick={() => setSubStage('credentials')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-705 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  disabled={loading}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  disabled={loading}
                  id="final-profile-submit"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={3} /> Setting up your profile...
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5">Create Professional Profile <Check className="w-4 h-4" /></span>
                  )}
                </button>

              </div>

            </form>
          )}

          {subStage === 'credentials' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs dark:text-slate-400 font-sans">
              {mode === 'login' && (
                <p>
                  Don't have an authentication key?{' '}
                  <button onClick={() => setMode('signup')} className="text-indigo-500 hover:underline font-bold transition-all">
                    Register here
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p>
                  Already have an active credentials key?{' '}
                  <button onClick={() => setMode('login')} className="text-indigo-500 hover:underline font-bold transition-all font-sans">
                    Log in
                  </button>
                </p>
              )}

              {mode === 'forgot' && (
                <p>
                  Remembered your password key?{' '}
                  <button onClick={() => setMode('login')} className="text-indigo-500 hover:underline font-bold transition-all">
                    Return to login
                  </button>
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
