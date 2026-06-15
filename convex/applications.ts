import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listApplicationsByOpportunity = query({
  args: { opportunityId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('applications')
      .withIndex('by_opportunity_id', (q) => q.eq('opportunity_id', args.opportunityId))
      .collect();
  },
});

export const listApplicationsByModel = query({
  args: { modelId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('applications')
      .withIndex('by_model_id', (q) => q.eq('model_id', args.modelId))
      .collect();
  },
});

export const createApplication = mutation({
  args: {
    opportunity_id: v.string(),
    model_id: v.string(),
    full_name: v.string(),
    portfolio_photos: v.array(v.string()),
    bio: v.string(),
    instagram_handle: v.string(),
    experience_level: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('applications', {
      ...args,
      status: 'Pending',
    });
    return await ctx.db.get(id);
  },
});

export const updateApplicationStatus = mutation({
  args: {
    id: v.id('applications'),
    status: v.union(v.literal('Pending'), v.literal('Accepted'), v.literal('Rejected'), v.literal('Withdrawn')),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});
