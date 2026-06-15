import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listOpportunities = query({
  handler: async (ctx) => {
    return await ctx.db.query('opportunities').collect();
  },
});

export const listOpportunitiesByBusiness = query({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('opportunities')
      .withIndex('by_business_id', (q) => q.eq('business_id', args.businessId))
      .collect();
  },
});

export const createOpportunity = mutation({
  args: {
    business_id: v.string(),
    title: v.string(),
    business_name: v.string(),
    business_logo: v.optional(v.string()),
    business_description: v.string(),
    contact_info: v.string(),
    is_verified_business: v.boolean(),
    location_state: v.string(),
    location_city: v.string(),
    category: v.string(),
    gender_requirement: v.string(),
    age_requirement: v.string(),
    experience_requirement: v.string(),
    models_needed: v.number(),
    payment_type: v.string(),
    payment_amount: v.optional(v.number()),
    event_date: v.string(),
    deadline: v.string(),
    notes: v.optional(v.string()),
    rules: v.optional(v.string()),
    venue_address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('opportunities', {
      ...args,
      models_accepted_count: 0,
      models_applied_count: 0,
      status: 'Open',
    });
    return await ctx.db.get(id);
  },
});

export const updateOpportunityStatus = mutation({
  args: {
    id: v.id('opportunities'),
    status: v.string(),
    models_accepted_count: v.optional(v.number()),
    models_applied_count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});
