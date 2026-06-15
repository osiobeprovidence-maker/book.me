/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelProfile, PortfolioImage } from '../types';

export const SEED_MODELS: ModelProfile[] = [
  {
    id: 'sofia_chen',
    user_id: 'user_sofia',
    name: 'Sofia Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    bio: 'Professional fashion and runway model with over 5 years of international experience across Paris, Milan, and Tokyo. Passionate about sustainable high-fashion campaigns and avant-garde editorials.',
    gender: 'Female',
    age: 24,
    height: 178,
    location: 'New York, NY',
    daily_rate: 1500,
    experience_level: 'Top Model',
    created_at: new Date().toISOString()
  },
  {
    id: 'marcus_vance',
    user_id: 'user_marcus',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    bio: 'Athletic, high-fashion model specialized in luxury dynamic activewear, editorials, and commercial campaigns. Represented by major worldwide agencies.',
    gender: 'Male',
    age: 27,
    height: 188,
    location: 'London, UK',
    daily_rate: 1800,
    experience_level: 'Top Model',
    created_at: new Date().toISOString()
  },
  {
    id: 'elena_rostova',
    user_id: 'user_elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800',
    bio: 'Fine art portrait and modern bridal campaign model. Editorial storyteller known for expressive features and adaptability in natural-light high-fashion shoots.',
    gender: 'Female',
    age: 22,
    height: 175,
    location: 'Paris, FR',
    daily_rate: 950,
    experience_level: 'Rising Star',
    created_at: new Date().toISOString()
  },
  {
    id: 'jordan_kim',
    user_id: 'user_jordan',
    name: 'Jordan Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    bio: 'Androgynous streetwear and editorial specialist. Bringing high energy and unique modern visual profiles to international lifestyle and shoe brand commercials.',
    gender: 'Non-binary',
    age: 21,
    height: 181,
    location: 'Los Angeles, CA',
    daily_rate: 800,
    experience_level: 'New Face',
    created_at: new Date().toISOString()
  },
  {
    id: 'taylor_sterling',
    user_id: 'user_taylor',
    name: 'Taylor Sterling',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    bio: 'Commercial print, beauty lifestyle, and swim catalogue model with a bright, welcoming energy. Regularly books for skincare brands and summer campaigns.',
    gender: 'Female',
    age: 25,
    height: 173,
    location: 'Miami, FL',
    daily_rate: 1200,
    experience_level: 'Professional',
    created_at: new Date().toISOString()
  },
  {
    id: 'dev_patel',
    user_id: 'user_dev',
    name: 'Dev Patel',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    bio: 'Tailored menswear, elegance editorials, and corporate luxury lifestyle modeling. Represented throughout Europe and Asia for premium advertisement campaigns.',
    gender: 'Male',
    age: 26,
    height: 185,
    location: 'Milan, IT',
    daily_rate: 1400,
    experience_level: 'Professional',
    created_at: new Date().toISOString()
  }
];

export const SEED_PORTFOLIO_IMAGES: PortfolioImage[] = [
  // Sofia Chen portfolio
  {
    id: 'p_sofia_1',
    model_id: 'sofia_chen',
    image_url: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_sofia_2',
    model_id: 'sofia_chen',
    image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_sofia_3',
    model_id: 'sofia_chen',
    image_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_sofia_4',
    model_id: 'sofia_chen',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },

  // Marcus Vance portfolio
  {
    id: 'p_marcus_1',
    model_id: 'marcus_vance',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_marcus_2',
    model_id: 'marcus_vance',
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_marcus_3',
    model_id: 'marcus_vance',
    image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },

  // Elena Rostova portfolio
  {
    id: 'p_elena_1',
    model_id: 'elena_rostova',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_elena_2',
    model_id: 'elena_rostova',
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_elena_3',
    model_id: 'elena_rostova',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },

  // Jordan Kim portfolio
  {
    id: 'p_jordan_1',
    model_id: 'jordan_kim',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_jordan_2',
    model_id: 'jordan_kim',
    image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },

  // Taylor Sterling portfolio
  {
    id: 'p_taylor_1',
    model_id: 'taylor_sterling',
    image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_taylor_2',
    model_id: 'taylor_sterling',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },

  // Dev Patel portfolio
  {
    id: 'p_dev_1',
    model_id: 'dev_patel',
    image_url: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  },
  {
    id: 'p_dev_2',
    model_id: 'dev_patel',
    image_url: 'https://images.unsplash.com/photo-1482849297070-f4fae2173efe?auto=format&fit=crop&q=80&w=800',
    created_at: new Date().toISOString()
  }
];

export const SEED_OPPORTUNITIES: any[] = [
  {
    id: 'opp_1',
    business_id: 'biz_ink',
    title: 'Need 2 Female Models For Tattoo Portfolio Shoot',
    business_name: 'Ink Masters Studio',
    business_logo: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=200',
    business_description: 'Award winning tattoo studio looking for models to showcase our recent sleeve work for our upcoming international portfolio launch.',
    contact_info: '+234 800 123 4567',
    is_verified_business: true,
    location_state: 'Delta State',
    location_city: 'Asaba',
    category: 'Tattoo/Body Art',
    gender_requirement: 'Female',
    age_requirement: '18-35',
    experience_requirement: 'Any Experience',
    models_needed: 2,
    models_accepted_count: 0,
    models_applied_count: 12,
    payment_type: 'Paid',
    payment_amount: '₦30,000 Per Model',
    event_date: '2026-07-20',
    deadline: '2026-06-25',
    notes: 'Models with clear skin on arms and back preferred. Photography will be high-contrast editorial style.',
    status: 'Open',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp_2',
    business_id: 'biz_vogue',
    title: 'Luxury Watch Campaign Editorial',
    business_name: 'Vogue Nigeria (Mock)',
    business_logo: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=200',
    business_description: 'Premier fashion publication shoot for a limited edition luxury Swiss watch brand.',
    contact_info: 'casting@vogue.ng',
    is_verified_business: true,
    location_state: 'Lagos State',
    location_city: 'Ikeja',
    category: 'Editorial',
    gender_requirement: 'Male',
    age_requirement: '25-45',
    experience_requirement: 'Professional (3yrs+)',
    models_needed: 1,
    models_accepted_count: 0,
    models_applied_count: 45,
    payment_type: 'Paid',
    payment_amount: '₦150,000 Total',
    event_date: '2026-08-05',
    deadline: '2026-07-01',
    notes: 'Must have strong hands and refined facial features. Suits will be provided.',
    status: 'Open',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp_3',
    business_id: 'biz_street',
    title: 'Urban Streetwear Launch Feed',
    business_name: 'Street Soul Co.',
    business_logo: 'https://images.unsplash.com/photo-1552061076-c3f501844b33?auto=format&fit=crop&q=80&w=200',
    business_description: 'Indie streetwear brand focusing on Lagos urban aesthetics.',
    contact_info: '@streetsoul_co',
    is_verified_business: false,
    location_state: 'Lagos State',
    location_city: 'Lekki',
    category: 'Fashion',
    gender_requirement: 'Any',
    age_requirement: '18-28',
    experience_requirement: 'Beginner (0-1yr)',
    models_needed: 4,
    models_accepted_count: 3,
    models_applied_count: 89,
    payment_type: 'Paid',
    payment_amount: '₦15,000 + Outfits',
    event_date: '2026-06-30',
    deadline: '2026-06-18',
    status: 'Almost Full',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp_4',
    business_id: 'biz_fashion_week',
    title: 'Runway Models for Lagos Fashion Week 2026',
    business_name: 'LFW Official',
    business_logo: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&q=80&w=200',
    business_description: 'Major runway event seeking fresh and experienced faces for various international designers.',
    contact_info: 'info@lfw.ng',
    is_verified_business: true,
    location_state: 'Lagos State',
    location_city: 'Victoria Island',
    category: 'Runway',
    gender_requirement: 'Any',
    age_requirement: '18-25',
    experience_requirement: 'Professional (3yrs+)',
    models_needed: 20,
    models_accepted_count: 5,
    models_applied_count: 340,
    payment_type: 'Paid',
    payment_amount: '₦200,000 + Travel',
    event_date: '2026-10-15',
    deadline: '2026-09-01',
    notes: 'Minimum height requirement: Female 5\'9", Male 6\'0". Physical casting is mandatory.',
    rules: 'No heavy makeup. Arrival 30 mins before call time. Professional attitude expected.',
    venue_address: 'Eko Convention Centre, Adetokunbo Ademola St, Victoria Island',
    status: 'Open',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp_5',
    business_id: 'biz_glow',
    title: 'Skincare Product Commercial - Radiant Skin',
    business_name: 'Glow Beauty Co.',
    business_logo: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=200',
    business_description: 'Beauty brand focusing on high-quality organic skincare products.',
    contact_info: 'hr@glowbeauty.com',
    is_verified_business: true,
    location_state: 'Abuja FCT',
    location_city: 'Maitama',
    category: 'Beauty/Commercial',
    gender_requirement: 'Female',
    age_requirement: '20-40',
    experience_requirement: 'Beginner (0-1yr)',
    models_needed: 3,
    models_accepted_count: 0,
    models_applied_count: 67,
    payment_type: 'Paid',
    payment_amount: '₦45,000 Total',
    event_date: '2026-07-12',
    deadline: '2026-06-30',
    notes: 'Must have extremely clear skin. No visible tattoos on face/neck.',
    rules: 'Strict hygiene protocols. Natural look required. No acrylic nails.',
    venue_address: 'Glow Studio, Transcorp Hilton, Abuja',
    status: 'Open',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp_6',
    business_id: 'biz_sport',
    title: 'Fitness App Launch - Commercial Models',
    business_name: 'Active Pulse',
    business_logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=200',
    business_description: 'Innovative fitness app launching a nationwide marketing campaign.',
    contact_info: 'hello@activepulse.fit',
    is_verified_business: false,
    location_state: 'Edo State',
    location_city: 'Benin City',
    category: 'Fitness',
    gender_requirement: 'Any',
    age_requirement: '21-35',
    experience_requirement: 'Professional (3yrs+)',
    models_needed: 2,
    models_accepted_count: 0,
    models_applied_count: 15,
    payment_type: 'Paid',
    payment_amount: '₦60,000 Per Model',
    event_date: '2026-08-01',
    deadline: '2026-07-15',
    notes: 'Must be athletic and able to perform basic fitness routines comfortably on camera.',
    status: 'Open',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp_7',
    business_id: 'biz_zen',
    title: 'Minimalist Interior Design Brochure',
    business_name: 'Zen Spaces',
    business_logo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200',
    business_description: 'High-end interior design firm creating their annual lookbook.',
    contact_info: '@zenspaces',
    is_verified_business: true,
    location_state: 'Lagos State',
    location_city: 'Ikoyi',
    category: 'Lifestyle',
    gender_requirement: 'Any',
    age_requirement: '30-50',
    experience_requirement: 'Any Experience',
    models_needed: 1,
    models_accepted_count: 1,
    models_applied_count: 32,
    payment_type: 'Paid',
    payment_amount: '₦25,000',
    event_date: '2026-06-25',
    deadline: '2026-06-10',
    notes: 'Mature look preferred. Will be posing in luxury apartment settings.',
    status: 'Filled',
    created_at: new Date().toISOString()
  }
];
