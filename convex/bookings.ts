import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listBookingsByModel = query({
  args: { modelId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .withIndex('by_model_id', (q) => q.eq('model_id', args.modelId))
      .collect();
  },
});

export const listBookingsByClient = query({
  args: { clientId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .withIndex('by_client_id', (q) => q.eq('client_id', args.clientId))
      .collect();
  },
});

export const createBooking = mutation({
  args: {
    client_id: v.string(),
    client_name: v.string(),
    client_email: v.string(),
    model_id: v.string(),
    booking_date: v.string(),
    event_name: v.string(),
    event_location: v.string(),
    additional_notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('bookings', {
      ...args,
      status: 'Pending',
    });
    return await ctx.db.get(id);
  },
});

export const updateBookingStatus = mutation({
  args: {
    id: v.id('bookings'),
    status: v.union(v.literal('Pending'), v.literal('Accepted'), v.literal('Rejected'), v.literal('Paid')),
    payment_reference: v.optional(v.string()),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

export const deleteBooking = mutation({
  args: { id: v.id('bookings') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
