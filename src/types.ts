export type UserRole = 'client' | 'model' | 'admin';
export type SubscriptionPlan = 'Free' | 'Pro' | 'Enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  created_at: string;
  plan?: SubscriptionPlan;
  firebaseUid?: string;
}

export interface ModelProfile {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  bio: string;
  gender: string;
  age: number;
  height: number;
  location: string;
  daily_rate: number;
  experience_level: string;
  created_at?: string;
}

export interface PortfolioImage {
  id: string;
  model_id: string;
  image_url: string;
  type?: 'image' | 'video';
  mux_playback_id?: string;
  mux_asset_id?: string;
  created_at?: string;
}

export interface Booking {
  id: string;
  client_id: string;
  model_id: string;
  booking_date: string;
  event_name: string;
  event_location: string;
  additional_notes?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Paid';
  created_at: string;
  client_name?: string;
  client_email?: string;
  model_name?: string;
  model_location?: string;
  model_avatar?: string;
  payment_reference?: string;
  amount?: number;
}

export type AppScreen =
  | 'home'
  | 'directory'
  | 'profile'
  | 'client-dashboard'
  | 'model-dashboard'
  | 'login'
  | 'signup'
  | 'opportunities'
  | 'opportunity-detail'
  | 'business-profile'
  | 'public-profile'
  | 'settings'
  | 'admin'
  | 'business-profile-setup';

export type OpportunityStatus = 'Open' | 'Almost Full' | 'Filled' | 'Expired' | 'Still Looking For Applicants';

export interface Opportunity {
  id: string;
  business_id: string;
  title: string;
  business_name: string;
  business_logo?: string;
  business_description: string;
  contact_info: string;
  is_verified_business: boolean;
  location_state: string;
  location_city: string;
  category: string;
  gender_requirement: string;
  age_requirement: string;
  experience_requirement: string;
  models_needed: number;
  models_accepted_count: number;
  models_applied_count: number;
  payment_type: string;
  payment_amount?: string;
  event_date: string;
  deadline: string;
  notes?: string;
  rules?: string;
  venue_address?: string;
  reference_images?: string[];
  status: OpportunityStatus;
  created_at: string;
}

export interface Application {
  id: string;
  opportunity_id: string;
  model_id: string;
  full_name: string;
  portfolio_photos: string[];
  bio: string;
  instagram_handle: string;
  experience_level: string;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
  created_at: string;
}

export interface BusinessProfile {
  user_id: string;
  brand_name?: string;
  registration_details?: string;
  website?: string;
  social_links?: string;
  address?: string;
  is_verified: boolean;
  description?: string;
  industry?: string;
  founded_year?: string;
  cover_image?: string;
}
