import { useState, useEffect, useMemo } from 'react';
import { AppScreen, User, ModelProfile, PortfolioImage, Booking, Opportunity, Application, BusinessProfile, UserRole } from './types';
import { localDB } from './lib/db';
import { onAuthChange, mapFirebaseUser, logout as firebaseLogout } from './lib/firebase';
import { createUserInConvex, createModelInConvex, upsertBusinessProfileInConvex } from './lib/convexMutations';
import { ToastProvider, useToast } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingView from './views/LandingView';
import DirectoryView from './views/DirectoryView';
import ModelProfileView from './views/ModelProfileView';
import BusinessProfileView from './views/BusinessProfileView';
import PublicProfileView from './views/PublicProfileView';
import DashboardClientView from './views/DashboardClientView';
import DashboardModelView from './views/DashboardModelView';
import OpportunityWallView from './views/OpportunityWallView';
import AuthView from './views/AuthView';
import AccountTypeSelectionView from './views/AccountTypeSelectionView';
import SettingsView from './views/SettingsView';
import AdminView from './views/AdminView';
import BusinessProfileSetupView from './views/BusinessProfileSetupView';
import OpportunityDetailView from './views/OpportunityDetailView';
import BookingModal from './components/BookingModal';
import { AnimatePresence, motion } from 'motion/react';

const FIREBASE_ENABLED = !!import.meta.env.VITE_FIREBASE_API_KEY;

function AppContent() {
  const { success, error, info } = useToast();

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);

  const [bookingTargetModel, setBookingTargetModel] = useState<ModelProfile | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('bookme_theme') === 'dark' ||
      (!localStorage.getItem('bookme_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Firebase auth listener
  useEffect(() => {
    if (!FIREBASE_ENABLED) return;
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const base = mapFirebaseUser(firebaseUser);
        let existingUser = localDB.getActiveUser();
        // Migrate old-format user
        if (existingUser) {
          let changed = false;
          if (existingUser.name && !existingUser.full_name) {
            existingUser.full_name = existingUser.name;
            delete existingUser.name;
            changed = true;
          }
          if (!existingUser.roles && existingUser.role) {
            const oldRole = existingUser.role;
            delete existingUser.role;
            if (oldRole === 'model') { existingUser.roles = ['model']; existingUser.activeRole = 'model'; }
            else if (oldRole === 'admin') { existingUser.roles = ['admin']; existingUser.activeRole = 'admin'; }
            else { existingUser.roles = ['user']; existingUser.activeRole = 'user'; }
            changed = true;
          }
          if (changed) localDB.setActiveUser(existingUser);
        }
        if (existingUser?.id === base.id) {
          setCurrentUser(existingUser);
        } else {
          const newUser: User = {
            ...base,
            auth_provider: 'google',
            roles: ['user'],
            activeRole: 'user',
            created_at: new Date().toISOString(),
          };
          setCurrentUser(newUser);
          localDB.setActiveUser(newUser);
        }
      }
    });
    return () => unsub();
  }, []);

  // Load local storage fallback DB values
  useEffect(() => {
    const seedU = localDB.getUsers();
    const seedM = localDB.getModels();
    const seedP = localDB.getPortfolio();
    const seedB = localDB.getBookings();
    const seedO = localDB.getOpportunities();
    const seedA = localDB.getApplications();
    const seedBP = localDB.getBusinessProfiles();
    let activeU = localDB.getActiveUser();

    // Migrate old-format users (singular `role`) to new format (`roles` + `activeRole`)
    const migrateUser = (u: any) => {
      if (!u) return u;
      // Migrate name -> full_name
      if (u.name && !u.full_name) {
        u.full_name = u.name;
        delete u.name;
      } else if (!u.full_name) {
        u.full_name = 'User';
      }
      // Migrate role -> roles + activeRole
      if (!u.roles && u.role) {
        const oldRole = u.role;
        delete u.role;
        if (oldRole === 'model') {
          u.roles = ['model'];
          u.activeRole = 'model';
        } else if (oldRole === 'admin') {
          u.roles = ['admin'];
          u.activeRole = 'admin';
        } else {
          u.roles = ['user'];
          u.activeRole = 'user';
        }
      } else if (!u.roles) {
        u.roles = ['user'];
        u.activeRole = 'user';
      }
      return u;
    };

    const migratedUsers = seedU.map(migrateUser);
    if (activeU) activeU = migrateUser(activeU);

    setUsers(migratedUsers);
    setModels(seedM);
    setPortfolio(seedP);
    setBookings(seedB);
    setOpportunities(seedO);
    setApplications(seedA);
    setBusinessProfiles(seedBP);
    if (activeU && !currentUser) {
      setCurrentUser(activeU);
    }

    // Persist migrated users if any were changed
    const needsSave = seedU.some((u: any) => !u.roles);
    if (needsSave) localDB.saveUsers(migratedUsers);
  }, []);

  // Sync to localStorage whenever state changes
  useEffect(() => { if (users.length > 0) localDB.saveUsers(users); }, [users]);
  useEffect(() => { if (models.length > 0) localDB.saveModels(models); }, [models]);
  useEffect(() => { if (portfolio.length > 0) localDB.savePortfolio(portfolio); }, [portfolio]);
  useEffect(() => { localDB.saveBookings(bookings); }, [bookings]);
  useEffect(() => { localDB.saveOpportunities(opportunities); }, [opportunities]);
  useEffect(() => { localDB.saveApplications(applications); }, [applications]);
  useEffect(() => { localDB.saveBusinessProfiles(businessProfiles); }, [businessProfiles]);

  // Dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('bookme_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('bookme_theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    setCurrentUser(null);
    localDB.setActiveUser(null);
    setCurrentScreen('home');
    if (FIREBASE_ENABLED) {
      try { await firebaseLogout(); } catch {}
    }
    success('Logged out successfully.');
  };

  const getDashboardScreen = (role: UserRole) => {
    if (role === 'model') return 'model-dashboard';
    if (role === 'business') return 'client-dashboard';
    return 'home';
  };

  const handleSwitchRole = (role: UserRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, activeRole: role };
    setCurrentUser(updated);
    localDB.setActiveUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    setCurrentScreen(getDashboardScreen(role));
    success(`Switched to ${role} mode`);
  };

  const handleAuthenticate = (authenticatedUser: User, profileSpecs?: any) => {
    setCurrentUser(authenticatedUser);
    localDB.setActiveUser(authenticatedUser);

    setUsers(prev => {
      const exists = prev.find(u => u.id === authenticatedUser.id);
      if (exists) return prev.map(u => u.id === authenticatedUser.id ? authenticatedUser : u);
      return [...prev, authenticatedUser];
    });

    createUserInConvex({
      name: authenticatedUser.full_name,
      email: authenticatedUser.email,
      role: authenticatedUser.activeRole,
      avatar: authenticatedUser.avatar,
      firebaseUid: authenticatedUser.firebaseUid || authenticatedUser.id,
    });

    success(`Welcome, ${authenticatedUser.full_name}!`);

    const isNewSignup = profileSpecs?.isNewSignup || false;
    setCurrentScreen(isNewSignup ? 'account-type-selection' : 'home');
  };

  const handleAccountTypeUserOnly = () => {
    setCurrentScreen('home');
  };

  const handleAccountTypeBecomeModel = () => {
    setCurrentScreen('model-onboarding');
  };

  const handleAccountTypeBecomeBusiness = () => {
    setCurrentScreen('business-profile-setup');
  };

  const handleActivateModelRole = (modelData: {
    name: string; bio: string; gender: string; age: number; height: number;
    location: string; daily_rate: number; experience_level: string;
  }) => {
    if (!currentUser) return;
    const newProfile: ModelProfile = {
      id: currentUser.id,
      user_id: currentUser.id,
      name: modelData.name,
      avatar: currentUser.avatar,
      bio: modelData.bio,
      gender: modelData.gender,
      age: modelData.age,
      height: modelData.height,
      location: modelData.location,
      daily_rate: modelData.daily_rate,
      experience_level: modelData.experience_level,
      created_at: new Date().toISOString(),
    };
    setModels(prev => [...prev, newProfile]);
    createModelInConvex(newProfile);

    const roles = currentUser.roles.includes('model') ? currentUser.roles : [...currentUser.roles, 'model'];
    const updated = { ...currentUser, roles, activeRole: 'model' as UserRole };
    setCurrentUser(updated);
    localDB.setActiveUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    setCurrentScreen('model-dashboard');
    success('Model profile activated! Welcome to the talent network.');
  };

  const handleActivateBusinessRole = (businessData: {
    brand_name: string; description: string; industry: string; address: string; website: string;
  }) => {
    if (!currentUser) return;
    const newProfile: BusinessProfile = {
      user_id: currentUser.id,
      brand_name: businessData.brand_name || currentUser.full_name + ' Agency',
      description: businessData.description,
      industry: businessData.industry,
      website: businessData.website,
      address: businessData.address,
      is_verified: false,
    };
    setBusinessProfiles(prev => {
      const exists = prev.find(p => p.user_id === currentUser.id);
      const updated = exists ? prev.map(p => p.user_id === currentUser.id ? newProfile : p) : [...prev, newProfile];
      localDB.saveBusinessProfiles(updated);
      return updated;
    });
    upsertBusinessProfileInConvex({ ...newProfile });

    const roles = currentUser.roles.includes('business') ? currentUser.roles : [...currentUser.roles, 'business'];
    const updated = { ...currentUser, roles, activeRole: 'business' as UserRole };
    setCurrentUser(updated);
    localDB.setActiveUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    setCurrentScreen('client-dashboard');
    success('Business profile activated! Start hiring talent.');
  };

  const handleCreateBooking = (
    eventName: string, eventLocation: string, bookingDate: string, additionalNotes: string
  ) => {
    if (!currentUser || !bookingTargetModel) {
      error('You must be logged in to create bookings.');
      return;
    }
    const uniqueId = 'bk_' + Math.random().toString(36).substring(2, 9);
    const newBooking: Booking = {
      id: uniqueId,
      client_id: currentUser.id,
      client_name: currentUser.full_name,
      client_email: currentUser.email,
      model_id: bookingTargetModel.id,
      booking_date: bookingDate,
      event_name: eventName,
      event_location: eventLocation,
      additional_notes: additionalNotes,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    setBookings((prev) => [newBooking, ...prev]);
    success(`Booking request raised for ${bookingTargetModel.name}!`);
    setCurrentScreen('client-dashboard');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    info('Booking proposal withdrawn.');
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Accepted' } : b))
    );
    success('Schedule offer accepted!');
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Rejected' } : b))
    );
    info('Schedule proposal declined.');
  };

  const handlePostOpportunity = (oppData: Partial<Opportunity>) => {
    if (!currentUser) return;
    const newOpp: Opportunity = {
      id: 'opp_' + Math.random().toString(36).substring(2, 9),
      business_id: currentUser.id,
      title: oppData.title || 'Untitled Opportunity',
      business_name: oppData.business_name || currentUser.full_name,
      business_logo: oppData.business_logo,
      business_description: oppData.business_description || '',
      contact_info: oppData.contact_info || '',
      is_verified_business: oppData.is_verified_business || false,
      location_state: oppData.location_state || '',
      location_city: oppData.location_city || '',
      category: oppData.category || 'Fashion',
      gender_requirement: oppData.gender_requirement || 'Any',
      age_requirement: oppData.age_requirement || 'Any',
      experience_requirement: oppData.experience_requirement || 'Any',
      models_needed: oppData.models_needed || 1,
      models_accepted_count: 0,
      models_applied_count: 0,
      payment_type: oppData.payment_type || 'Paid',
      payment_amount: oppData.payment_amount,
      event_date: oppData.event_date || '',
      deadline: oppData.deadline || '',
      notes: oppData.notes,
      rules: oppData.rules,
      venue_address: oppData.venue_address,
      status: 'Open',
      created_at: new Date().toISOString()
    };
    setOpportunities(prev => [newOpp, ...prev]);
    success('New casting opportunity posted to the wall!');
  };

  const handleApplyToOpportunity = (appData: Partial<Application>) => {
    if (!currentUser) return;
    const newApp: Application = {
      id: 'app_' + Math.random().toString(36).substring(2, 9),
      opportunity_id: appData.opportunity_id || '',
      model_id: currentUser.id,
      full_name: appData.full_name || currentUser.full_name,
      portfolio_photos: appData.portfolio_photos || [],
      bio: appData.bio || '',
      instagram_handle: appData.instagram_handle || '',
      experience_level: appData.experience_level || '',
      message: appData.message,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === appData.opportunity_id) {
        return { ...opp, models_applied_count: opp.models_applied_count + 1 };
      }
      return opp;
    }));
    success('Application submitted successfully!');
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: 'Accepted' | 'Rejected') => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const updatedApp = { ...app, status: newStatus };
        if (newStatus === 'Accepted') {
          setOpportunities(opps => opps.map(opp => {
            if (opp.id === app.opportunity_id) {
              const newAcceptedCount = opp.models_accepted_count + 1;
              return { ...opp, models_accepted_count: newAcceptedCount, status: newAcceptedCount >= opp.models_needed ? 'Filled' : opp.status };
            }
            return opp;
          }));
        }
        return updatedApp;
      }
      return app;
    }));
    if (newStatus === 'Accepted') success('Talent accepted for the role!');
    else info('Application declined.');
  };

  const handleCloseOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.map(opp => opp.id === oppId ? { ...opp, status: 'Filled' } : opp));
    info('Opportunity closed to new applicants.');
  };

  const handleUpdateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfiles(prev => {
      const exists = prev.find(p => p.user_id === profile.user_id);
      if (exists) return prev.map(p => p.user_id === profile.user_id ? profile : p);
      return [...prev, profile];
    });
    upsertBusinessProfileInConvex({
      user_id: profile.user_id,
      brand_name: profile.brand_name,
      description: profile.description,
      industry: profile.industry,
      website: profile.website,
      address: profile.address,
      is_verified: profile.is_verified,
    });
    success('Business verification details saved.');
  };

  const handleUpdateProfile = (updatedSpecs: Partial<ModelProfile>) => {
    if (!currentUser) return;
    setModels((prev) =>
      prev.map((m) => (m.user_id === currentUser.id ? { ...m, ...updatedSpecs } : m))
    );
    success('Portfolio specification successfully updated.');
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...userData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    localDB.saveUsers(users.map(u => u.id === currentUser.id ? updated : u));
    localDB.setActiveUser(updated);
    if (userData.plan) {
      success(`Subscription successfully updated to ${userData.plan}!`);
    } else {
      success('Account information updated.');
    }
  };

  const handleAddPortfolioImage = (imageUrl: string, type?: 'image' | 'video', muxPlaybackId?: string, muxAssetId?: string) => {
    if (!currentUser) return;
    const modelProfile = models.find((m) => m.user_id === currentUser.id);
    if (!modelProfile) return;

    const uniqueId = 'img_' + Math.random().toString(36).substring(2, 9);
    const newAsset: PortfolioImage = {
      id: uniqueId,
      model_id: modelProfile.id,
      image_url: imageUrl,
      type: type || 'image',
      mux_playback_id: muxPlaybackId,
      mux_asset_id: muxAssetId,
      created_at: new Date().toISOString()
    };
    setPortfolio((prev) => [...prev, newAsset]);
    success(type === 'video' ? 'Video added to portfolio!' : 'Asset added to portfolio!');
  };

  const handleDeletePortfolioImage = (imageId: string) => {
    setPortfolio((prev) => prev.filter((img) => img.id !== imageId));
    info('Asset deleted from portfolio.');
  };

  const featuredModels = useMemo(() => {
    return models.slice(0, 3);
  }, [models]);

  // Active role helpers
  const activeRole = currentUser?.activeRole || 'user';
  const canActAsModel = currentUser?.roles?.includes('model') ?? false;
  const canActAsBusiness = currentUser?.roles?.includes('business') ?? false;
  const canActAsAdmin = currentUser?.roles?.includes('admin') ?? false;

  const handleGoToProfile = () => {
    if (!currentUser) return;
    if (activeRole === 'model') {
      setSelectedModelId(currentUser.id);
      setCurrentScreen('profile');
    } else if (activeRole === 'business') {
      setSelectedBusinessId(currentUser.id);
      setCurrentScreen('business-profile');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative select-none selection:bg-indigo-500/20">

      {currentScreen !== 'public-profile' && currentScreen !== 'account-type-selection' && (
        <Header
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          currentUser={currentUser}
          logout={handleLogout}
          setSelectedModelId={setSelectedModelId}
          setSelectedBusinessId={setSelectedBusinessId}
          activeRole={activeRole}
          canActAsModel={canActAsModel}
          canActAsBusiness={canActAsBusiness}
          canActAsAdmin={canActAsAdmin}
          onSwitchRole={handleSwitchRole}
          onGoToProfile={handleGoToProfile}
        />
      )}

      <main className="flex-grow pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen + (selectedModelId || '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {currentScreen === 'home' && (
              <LandingView
                featuredModels={featuredModels}
                onViewProfile={(id) => {
                  setSelectedModelId(id);
                  setCurrentScreen('profile');
                }}
                setCurrentScreen={setCurrentScreen}
                onExplore={() => setCurrentScreen('directory')}
              />
            )}

            {currentScreen === 'directory' && (
              <DirectoryView
                models={models}
                onViewProfile={(id) => {
                  setSelectedModelId(id);
                  setCurrentScreen('profile');
                }}
              />
            )}

            {currentScreen === 'profile' && selectedModelId && (
              <ModelProfileView
                modelId={selectedModelId}
                models={models}
                portfolio={portfolio}
                onOpenBooking={(m) => setBookingTargetModel(m)}
                currentUser={currentUser}
                setCurrentScreen={setCurrentScreen}
                onBackToDirectory={() => {
                  setSelectedModelId(null);
                  setCurrentScreen('directory');
                }}
                onUpdateProfile={handleUpdateProfile}
                onAddPortfolioImage={handleAddPortfolioImage}
                onDeletePortfolioImage={handleDeletePortfolioImage}
              />
            )}

            {currentScreen === 'public-profile' && selectedModelId && (
              <PublicProfileView
                model={models.find(m => m.id === selectedModelId)!}
                portfolio={portfolio.filter(p => p.model_id === selectedModelId)}
                onBack={() => {
                  setCurrentScreen(getDashboardScreen(activeRole));
                }}
              />
            )}

            {currentScreen === 'business-profile' && selectedBusinessId && (
              <BusinessProfileView
                businessId={selectedBusinessId}
                users={users}
                businessProfiles={businessProfiles}
                opportunities={opportunities}
                onBack={() => {
                  setSelectedBusinessId(null);
                  setCurrentScreen('opportunities');
                }}
                onViewOpportunity={(opp) => {
                  setSelectedOpportunity(opp);
                  setCurrentScreen('opportunity-detail');
                }}
                onApplyToOpportunity={(opp) => handleApplyToOpportunity({ opportunity_id: opp.id })}
                currentUser={currentUser}
              />
            )}

            {currentScreen === 'client-dashboard' && currentUser && (
              <DashboardClientView
                currentUser={currentUser}
                bookings={bookings}
                models={models}
                opportunities={opportunities}
                applications={applications}
                businessProfiles={businessProfiles}
                onCancelBooking={handleCancelBooking}
                onPostOpportunity={handlePostOpportunity}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onCloseOpportunity={handleCloseOpportunity}
                onUpdateBusinessProfile={handleUpdateBusinessProfile}
                setCurrentScreen={setCurrentScreen}
                setSelectedModelId={setSelectedModelId}
              />
            )}

            {currentScreen === 'model-dashboard' && currentUser && (
              <DashboardModelView
                currentUser={currentUser}
                bookings={bookings}
                models={models}
                portfolio={portfolio}
                onAcceptBooking={handleAcceptBooking}
                onRejectBooking={handleRejectBooking}
                onUpdateProfile={handleUpdateProfile}
                onAddPortfolioImage={handleAddPortfolioImage}
                onDeletePortfolioImage={handleDeletePortfolioImage}
                applications={applications.filter(a => a.model_id === currentUser.id)}
                opportunities={opportunities}
                setSelectedModelId={setSelectedModelId}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'model-onboarding' && currentUser && (
              <ModelOnboardingView
                currentUser={currentUser}
                onComplete={handleActivateModelRole}
                onSkip={() => setCurrentScreen(getDashboardScreen(activeRole))}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'business-profile-setup' && currentUser && (
              <BusinessProfileSetupView
                currentUser={currentUser}
                onSave={(profile) => {
                  handleActivateBusinessRole({
                    brand_name: profile.brand_name || '',
                    description: profile.description || '',
                    industry: profile.industry || '',
                    address: profile.address || '',
                    website: profile.website || '',
                  });
                }}
                onSkip={() => {
                  const roles = currentUser.roles.includes('business') ? currentUser.roles : [...currentUser.roles, 'business'];
                  const updated = { ...currentUser, roles, activeRole: 'business' as UserRole };
                  setCurrentUser(updated);
                  localDB.setActiveUser(updated);
                  setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
                  setCurrentScreen('client-dashboard');
                }}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'settings' && currentUser && (
              <SettingsView
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                onBack={() => setCurrentScreen(getDashboardScreen(activeRole))}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onActivateModel={() => {
                  if (canActAsModel) {
                    handleSwitchRole('model');
                  } else {
                    setCurrentScreen('model-onboarding');
                  }
                }}
                onActivateBusiness={() => {
                  if (canActAsBusiness) {
                    handleSwitchRole('business');
                  } else {
                    setCurrentScreen('business-profile-setup');
                  }
                }}
              />
            )}

            {currentScreen === 'admin' && (
              <AdminView onBack={() => setCurrentScreen('home')} />
            )}

            {currentScreen === 'opportunities' && (
              <OpportunityWallView
                currentUser={currentUser}
                opportunities={opportunities}
                onApply={handleApplyToOpportunity}
                onPostOpportunity={handlePostOpportunity}
                onNavigate={setCurrentScreen}
                onViewBrand={(id) => {
                  setSelectedBusinessId(id);
                  setCurrentScreen('business-profile');
                }}
                isModel={canActAsModel}
              />
            )}

            {(currentScreen === 'login' || currentScreen === 'signup') && (
              <AuthView
                initialMode={currentScreen}
                onAuthenticate={handleAuthenticate}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'account-type-selection' && currentUser && (
              <AccountTypeSelectionView
                currentUser={currentUser}
                onSelectUserOnly={handleAccountTypeUserOnly}
                onBecomeModel={handleAccountTypeBecomeModel}
                onBecomeBusiness={handleAccountTypeBecomeBusiness}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'opportunity-detail' && selectedOpportunity && (
              <OpportunityDetailView
                opportunity={selectedOpportunity}
                currentUser={currentUser}
                onApply={(opp) => handleApplyToOpportunity({ opportunity_id: opp.id })}
                onBack={() => setCurrentScreen('opportunities')}
                onViewBrand={(businessId) => {
                  setSelectedBusinessId(businessId);
                  setCurrentScreen('business-profile');
                }}
                isModel={canActAsModel}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {bookingTargetModel && (
        <BookingModal
          isOpen={!!bookingTargetModel}
          onClose={() => setBookingTargetModel(null)}
          model={bookingTargetModel}
          onSubmitBooking={handleCreateBooking}
        />
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ArrowLeft, User as UserIcon, MapPin, DollarSign, BadgeCheck, Ruler, RefreshCw, Check } from 'lucide-react';
import { motion } from 'motion/react';

function ModelOnboardingView({ currentUser, onComplete, onSkip, setCurrentScreen }: {
  currentUser: User;
  onComplete: (data: any) => void;
  onSkip: () => void;
  setCurrentScreen: (s: AppScreen) => void;
}) {
  const [displayName, setDisplayName] = useState(currentUser.full_name);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState(23);
  const [height, setHeight] = useState(175);
  const [dailyRate, setDailyRate] = useState(500);
  const [experienceLevel, setExperienceLevel] = useState('New Face');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onComplete({ name: displayName, bio: bio.trim(), gender, age: Number(age), height: Number(height), location: location.trim(), daily_rate: Number(dailyRate), experience_level: experienceLevel });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCurrentScreen('settings')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-full border border-indigo-100 dark:border-indigo-900/30">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Model Onboarding</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/30">
              <UserIcon className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Become a Model</h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">Set up your model profile so brands and agencies can discover you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Display Name</label>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell brands about your style, experience, and specializations..." className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="New York, NY" className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Daily Rate ($)</label>
                <input type="number" value={dailyRate} onChange={e => setDailyRate(Number(e.target.value))} className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><Ruler className="w-3 h-3" /> Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Age</label>
                <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Level</label>
                <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white">
                  <option>New Face</option>
                  <option>Rising Star</option>
                  <option>Professional</option>
                  <option>Top Model</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none dark:text-white">
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button type="button" onClick={onSkip} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer">Skip for now</button>
              <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Activating...</> : <><Check className="w-4 h-4" /> Activate Model Profile</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
