import { useState, useEffect, useMemo } from 'react';
import { AppScreen, User, ModelProfile, PortfolioImage, Booking, Opportunity, Application, BusinessProfile } from './types';
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
        const existingUser = localDB.getActiveUser();
        if (existingUser?.id === base.id) {
          setCurrentUser(existingUser);
        } else {
          const newUser: User = {
            ...base,
            role: 'model',
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
    const activeU = localDB.getActiveUser();

    setUsers(seedU);
    setModels(seedM);
    setPortfolio(seedP);
    setBookings(seedB);
    setOpportunities(seedO);
    setApplications(seedA);
    setBusinessProfiles(seedBP);
    if (activeU && !currentUser) {
      setCurrentUser(activeU);
    }
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

  const handleAuthenticate = (authenticatedUser: User, profileSpecs?: any) => {
    setCurrentUser(authenticatedUser);
    localDB.setActiveUser(authenticatedUser);

    setUsers(prev => {
      const exists = prev.find(u => u.id === authenticatedUser.id);
      if (exists) return prev.map(u => u.id === authenticatedUser.id ? authenticatedUser : u);
      return [...prev, authenticatedUser];
    });

    // Save user to Convex
    createUserInConvex({
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      avatar: authenticatedUser.avatar,
      firebaseUid: authenticatedUser.firebaseUid || authenticatedUser.id,
    });

    if (authenticatedUser.role === 'model') {
      const exists = models.some((m) => m.user_id === authenticatedUser.id);
      if (!exists) {
        const generatedProfile: ModelProfile = {
          id: authenticatedUser.id,
          user_id: authenticatedUser.id,
          name: authenticatedUser.name,
          avatar: authenticatedUser.avatar,
          bio: profileSpecs?.bio || 'Versatile modeling talent newly registered on BookMe Lite.',
          gender: profileSpecs?.gender || 'Female',
          age: profileSpecs?.age || 23,
          height: profileSpecs?.height || 175,
          location: profileSpecs?.location || 'New York, NY',
          daily_rate: profileSpecs?.daily_rate || 1200,
          experience_level: profileSpecs?.experience_level || 'New Face',
          created_at: new Date().toISOString()
        };
        setModels((prev) => [...prev, generatedProfile]);
        // Save model profile to Convex
        createModelInConvex(generatedProfile);
        info('New candidate model profile bootstrapped!');
      } else if (profileSpecs) {
        setModels((prev) =>
          prev.map((m) => (m.user_id === authenticatedUser.id ? { ...m, ...profileSpecs } : m))
        );
      }
    } else if (authenticatedUser.role === 'client' && profileSpecs) {
      const newProfile: BusinessProfile = {
        user_id: authenticatedUser.id,
        brand_name: profileSpecs.brandName || authenticatedUser.name + ' Agency',
        description: profileSpecs.bio || '',
        industry: profileSpecs.sector || '',
        website: profileSpecs.website || '',
        address: profileSpecs.location || '',
        is_verified: false,
      };
      setBusinessProfiles(prev => {
        const exists = prev.find(p => p.user_id === authenticatedUser.id);
        const updated = exists
          ? prev.map(p => p.user_id === authenticatedUser.id ? newProfile : p)
          : [...prev, newProfile];
        localDB.saveBusinessProfiles(updated);
        return updated;
      });
      upsertBusinessProfileInConvex({
        user_id: authenticatedUser.id,
        brand_name: profileSpecs.brandName || authenticatedUser.name + ' Agency',
        description: profileSpecs.bio || '',
        industry: profileSpecs.sector || '',
        website: profileSpecs.website || '',
        address: profileSpecs.location || '',
        is_verified: false,
      });
      info(`Brand Custom Profile initialized: ${profileSpecs.brandName || authenticatedUser.name}`);
    }

    success(`Logged in as ${authenticatedUser.name}`);

    if (authenticatedUser.role === 'admin') {
      setCurrentScreen('admin');
    } else if (authenticatedUser.role === 'model') {
      setCurrentScreen('model-dashboard');
    } else if (authenticatedUser.role === 'client') {
      try {
        const stored = localDB.getBusinessProfiles();
        const hasProfile = Array.isArray(stored) && stored.some((p: any) => p.user_id === authenticatedUser.id);
        setCurrentScreen(hasProfile ? 'client-dashboard' : 'business-profile-setup');
      } catch (e) {
        setCurrentScreen('client-dashboard');
      }
    } else {
      setCurrentScreen('model-dashboard');
    }
  };

  const handleCreateBooking = (
    eventName: string,
    eventLocation: string,
    bookingDate: string,
    additionalNotes: string
  ) => {
    if (!currentUser || !bookingTargetModel) {
      error('You must be logged in to construct schedule reservations.');
      return;
    }

    const uniqueId = 'bk_' + Math.random().toString(36).substring(2, 9);
    const newBooking: Booking = {
      id: uniqueId,
      client_id: currentUser.id,
      client_name: currentUser.name,
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
      business_name: oppData.business_name || currentUser.name,
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
      full_name: appData.full_name || currentUser.name,
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
              return {
                ...opp,
                models_accepted_count: newAcceptedCount,
                status: newAcceptedCount >= opp.models_needed ? 'Filled' : opp.status
              };
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative select-none selection:bg-indigo-500/20">

      {currentScreen !== 'public-profile' && (
        <Header
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          currentUser={currentUser}
          logout={handleLogout}
          setSelectedModelId={setSelectedModelId}
          setSelectedBusinessId={setSelectedBusinessId}
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
                  if (currentUser?.id === selectedModelId) {
                    setCurrentScreen('model-dashboard');
                  } else {
                    setCurrentScreen('profile');
                  }
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

            {currentScreen === 'settings' && currentUser && (
              <SettingsView
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                onBack={() => {
                  if (currentUser.role === 'client') setCurrentScreen('client-dashboard');
                  else setCurrentScreen('model-dashboard');
                }}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
              />
            )}

            {currentScreen === 'admin' && (
              <AdminView
                onBack={() => setCurrentScreen('home')}
              />
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
              />
            )}

            {(currentScreen === 'login' || currentScreen === 'signup') && (
              <AuthView
                initialMode={currentScreen}
                onAuthenticate={handleAuthenticate}
                setCurrentScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'business-profile-setup' && currentUser && (
              <BusinessProfileSetupView
                currentUser={currentUser}
                onSave={(profile) => {
                  handleUpdateBusinessProfile(profile);
                  setCurrentScreen('client-dashboard');
                }}
                onSkip={() => setCurrentScreen('client-dashboard')}
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

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
