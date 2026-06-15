import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listModels = query({
  handler: async (ctx) => {
    return await ctx.db.query('models').collect();
  },
});

export const getModelByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('models')
      .withIndex('by_user_id', (q) => q.eq('user_id', args.userId))
      .first();
  },
});

export const createModel = mutation({
  args: {
    user_id: v.string(),
    name: v.string(),
    avatar: v.string(),
    bio: v.string(),
    gender: v.string(),
    age: v.number(),
    height: v.number(),
    location: v.string(),
    daily_rate: v.number(),
    experience_level: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('models', args);
    return await ctx.db.get(id);
  },
});

export const updateModel = mutation({
  args: {
    id: v.id('models'),
    bio: v.optional(v.string()),
    gender: v.optional(v.string()),
    age: v.optional(v.number()),
    height: v.optional(v.number()),
    location: v.optional(v.string()),
    daily_rate: v.optional(v.number()),
    experience_level: v.optional(v.string()),
    avatar: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});
