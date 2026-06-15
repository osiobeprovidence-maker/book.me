/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Define LocalStorage Namespaces for high-fidelity client-only state
const LS_KEYS = {
  USERS: 'bookme_lite_users',
  MODELS: 'bookme_lite_models',
  PORTFOLIO: 'bookme_lite_portfolio',
  BOOKINGS: 'bookme_lite_bookings',
  ACTIVE_USER: 'bookme_lite_active_user',
  OPPORTUNITIES: 'bookme_lite_opportunities',
  APPLICATIONS: 'bookme_lite_applications',
  BUSINESS_PROFILES: 'bookme_lite_business_profiles'
};

// Local storage helper functions
export const localDB = {
  getUsers: () => {
    const data = localStorage.getItem(LS_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  saveUsers: (users: any[]) => {
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));
  },
  getModels: () => {
    const data = localStorage.getItem(LS_KEYS.MODELS);
    if (!data) {
      // Seed initial models
      import('../data/seedData').then(({ SEED_MODELS }) => {
        localStorage.setItem(LS_KEYS.MODELS, JSON.stringify(SEED_MODELS));
      });
      return [];
    }
    return JSON.parse(data);
  },
  saveModels: (models: any[]) => {
    localStorage.setItem(LS_KEYS.MODELS, JSON.stringify(models));
  },
  getPortfolio: () => {
    const data = localStorage.getItem(LS_KEYS.PORTFOLIO);
    if (!data) {
      import('../data/seedData').then(({ SEED_PORTFOLIO_IMAGES }) => {
        localStorage.setItem(LS_KEYS.PORTFOLIO, JSON.stringify(SEED_PORTFOLIO_IMAGES));
      });
      return [];
    }
    return JSON.parse(data);
  },
  savePortfolio: (images: any[]) => {
    localStorage.setItem(LS_KEYS.PORTFOLIO, JSON.stringify(images));
  },
  getBookings: () => {
    const data = localStorage.getItem(LS_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },
  saveBookings: (bookings: any[]) => {
    localStorage.setItem(LS_KEYS.BOOKINGS, JSON.stringify(bookings));
  },
  getOpportunities: () => {
    const data = localStorage.getItem(LS_KEYS.OPPORTUNITIES);
    if (!data) {
      import('../data/seedData').then(({ SEED_OPPORTUNITIES }) => {
        localStorage.setItem(LS_KEYS.OPPORTUNITIES, JSON.stringify(SEED_OPPORTUNITIES));
      });
      return [];
    }
    return JSON.parse(data);
  },
  saveOpportunities: (opportunities: any[]) => {
    localStorage.setItem(LS_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  },
  getApplications: () => {
    const data = localStorage.getItem(LS_KEYS.APPLICATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveApplications: (applications: any[]) => {
    localStorage.setItem(LS_KEYS.APPLICATIONS, JSON.stringify(applications));
  },
  getBusinessProfiles: () => {
    const data = localStorage.getItem(LS_KEYS.BUSINESS_PROFILES);
    return data ? JSON.parse(data) : [];
  },
  saveBusinessProfiles: (profiles: any[]) => {
    localStorage.setItem(LS_KEYS.BUSINESS_PROFILES, JSON.stringify(profiles));
  },
  getActiveUser: () => {
    const data = localStorage.getItem(LS_KEYS.ACTIVE_USER);
    return data ? JSON.parse(data) : null;
  },
  setActiveUser: (user: any) => {
    if (user) {
      localStorage.setItem(LS_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_KEYS.ACTIVE_USER);
    }
  }
};

// Initialize seed data if they don't exist
if (!localStorage.getItem(LS_KEYS.MODELS)) {
  import('../data/seedData').then(({ SEED_MODELS }) => {
    localStorage.setItem(LS_KEYS.MODELS, JSON.stringify(SEED_MODELS));
  });
}
if (!localStorage.getItem(LS_KEYS.PORTFOLIO)) {
  import('../data/seedData').then(({ SEED_PORTFOLIO_IMAGES }) => {
    localStorage.setItem(LS_KEYS.PORTFOLIO, JSON.stringify(SEED_PORTFOLIO_IMAGES));
  });
}
