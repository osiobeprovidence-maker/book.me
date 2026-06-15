import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getBusinessProfileByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('business_profiles')
      .withIndex('by_user_id', (q) => q.eq('user_id', args.userId))
      .first();
  },
});

export const upsertBusinessProfile = mutation({
  args: {
    user_id: v.string(),
    brand_name: v.optional(v.string()),
    description: v.optional(v.string()),
    industry: v.optional(v.string()),
    website: v.optional(v.string()),
    social_links: v.optional(v.array(v.string())),
    address: v.optional(v.string()),
    is_verified: v.boolean(),
    founded_year: v.optional(v.number()),
    cover_image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('business_profiles')
      .withIndex('by_user_id', (q) => q.eq('user_id', args.user_id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return await ctx.db.get(existing._id);
    }
    const id = await ctx.db.insert('business_profiles', args);
    return await ctx.db.get(id);
  },
});
