import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listPortfolioByModel = query({
  args: { modelId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('portfolio_images')
      .withIndex('by_model_id', (q) => q.eq('model_id', args.modelId))
      .collect();
  },
});

export const addPortfolioImage = mutation({
  args: {
    model_id: v.string(),
    image_url: v.string(),
    type: v.optional(v.union(v.literal('image'), v.literal('video'))),
    mux_playback_id: v.optional(v.string()),
    mux_asset_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('portfolio_images', args);
    return await ctx.db.get(id);
  },
});

export const deletePortfolioImage = mutation({
  args: { id: v.id('portfolio_images') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
