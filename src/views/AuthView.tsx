import React, { useState, useEffect } from 'react';
import { AppScreen, User } from '../types';
import { 
  Lock, Mail, User as UserIcon, Sparkles, Key, 
  AlertCircle, RefreshCw, Globe, ArrowLeft
} from 'lucide-react';
import { signUpWithEmail, loginWithEmail, loginWithGoogle, resetPassword, getFirebaseErrorMessage, getRedirectResultHandler } from '../lib/firebase';

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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!FIREBASE_ENABLED) return;
    getRedirectResultHandler().then(async (result) => {
      if (result?.user) {
        const fbUser = result.user;
        const authenticatedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || name || 'User',
          email: fbUser.email || email,
          roles: ['user'],
          activeRole: 'user',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          created_at: new Date().toISOString(),
          firebaseUid: fbUser.uid,
        };
        if (mode === 'login') {
          onAuthenticate(authenticatedUser);
        } else {
          setEmail(fbUser.email || '');
          setName(fbUser.displayName || '');
        }
      }
    }).catch(() => {});
  }, []);

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
        roles: ['user'],
        activeRole: 'user',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
        created_at: new Date().toISOString(),
        firebaseUid: fbUser.uid,
      };

      if (mode === 'login') {
        onAuthenticate(authenticatedUser);
      } else {
        setEmail(fbUser.email || '');
        setName(fbUser.displayName || '');
      }
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
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
    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    try {
      setLoading(true);

      let fbUser: any = null;
      if (FIREBASE_ENABLED) {
        if (mode === 'login') {
          fbUser = await loginWithEmail(email.trim(), password);
        } else {
          fbUser = await signUpWithEmail(name.trim(), email.trim().toLowerCase(), password);
        }
      }

      const uid = fbUser?.uid || 'u_' + Math.random().toString(36).substring(2, 9);
      const avatar = fbUser?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

      const authenticatedUser: User = {
        id: uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        roles: ['user'],
        activeRole: 'user',
        avatar,
        created_at: new Date().toISOString(),
        firebaseUid: uid,
      };

      onAuthenticate(authenticatedUser);
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(getFirebaseErrorMessage(err));
      setLoading(false);
    }
  };

  const fillDemo = (demoRole: string) => {
    if (demoRole === 'model') {
      setName('Sofia Chen');
      setEmail('sofia@model.com');
      setPassword('password123');
    } else if (demoRole === 'client') {
      setName('Agatha Bloom');
      setEmail('director@vogue.com');
      setPassword('password123');
    } else {
      setName('Admin Control');
      setEmail('admin@bookme.platform');
      setPassword('admin123');
    }
  };

  const handleFallbackAuth = () => {
    const authenticatedUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      roles: ['user'],
      activeRole: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      created_at: new Date().toISOString(),
    };
    onAuthenticate(authenticatedUser);
  };

  return (
    <div id="auth-portal" className="w-full min-h-screen py-10 md:py-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden text-left">
      
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
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans mt-2 tracking-tight">Welcome Back</h1>
                <p className="text-xs text-slate-500 font-sans">Sign in to your universal account</p>
              </>
            )}

            {mode === 'signup' && (
              <>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans mt-2 tracking-tight">Create Your Account</h1>
                <p className="text-xs text-slate-500 font-sans">One account. Use as a model, business, or both.</p>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white font-sans mt-2 tracking-tight">Forgot Password?</h1>
                <p className="text-xs text-slate-500 font-sans">We'll send you a reset link.</p>
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
                    Or use email
                  </span>
                  <div className="flex-grow border-t border-slate-200/70 dark:border-slate-800"></div>
                </div>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              
              {mode === 'signup' && (
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
              )}

              {mode === 'login' && (
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
              )}

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
                      Password
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
                      <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : mode === 'login' ? (
                    'Sign In'
                  ) : mode === 'signup' ? (
                    'Create Account'
                  ) : (
                    'Send Reset Link'
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

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs dark:text-slate-400 font-sans">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-indigo-500 hover:underline font-bold transition-all">
                  Register here
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-indigo-500 hover:underline font-bold transition-all font-sans">
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button onClick={() => setMode('login')} className="text-indigo-500 hover:underline font-bold transition-all">
                  Return to sign in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
