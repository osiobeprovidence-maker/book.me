import { convexClient } from './convex';

const isConvexReady = () => !!convexClient && !!import.meta.env.VITE_CONVEX_URL;

export async function createUserInConvex(data: {
  name: string;
  email: string;
  role: string;
  avatar: string;
  firebaseUid: string;
}) {
  if (!isConvexReady()) return null;
  return convexClient!.mutation('users:createUser' as any, data);
}

export async function createModelInConvex(data: {
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
}) {
  if (!isConvexReady()) return null;
  return convexClient!.mutation('models:createModel' as any, data);
}

export async function upsertBusinessProfileInConvex(data: {
  user_id: string;
  brand_name?: string;
  description?: string;
  industry?: string;
  website?: string;
  address?: string;
  is_verified: boolean;
}) {
  if (!isConvexReady()) return null;
  return convexClient!.mutation('businessProfiles:upsertBusinessProfile' as any, data);
}
