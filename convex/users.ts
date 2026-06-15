import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export const getUserByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid))
      .first();
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal('client'), v.literal('model'), v.literal('admin')),
    avatar: v.string(),
    firebaseUid: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_firebaseUid', (q) => q.eq('firebaseUid', args.firebaseUid))
      .first();
    if (existing) return existing;
    const id = await ctx.db.insert('users', {
      ...args,
      plan: 'Free',
    });
    return await ctx.db.get(id);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id('users'),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    plan: v.optional(v.union(v.literal('Free'), v.literal('Pro'), v.literal('Enterprise'))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

export const listUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  },
});
