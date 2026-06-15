import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
export const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export { ConvexProvider };
