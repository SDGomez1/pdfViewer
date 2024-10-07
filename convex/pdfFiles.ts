import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendPdf = mutation({
  args: { storeId: v.id("_storage"), languaje: v.string() },
  handler: async (ctx, args) => {
    const languajeData = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("language"), args.languaje))
      .unique();
    if (languajeData) {
      await ctx.db.patch(languajeData._id, { storageId: args.storeId });
      return { success: true };
    }
  },
});

export const getpdfFile = query({
  args: { languaje: v.string() },
  handler: async (ctx, args) => {
    const languajeData = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("language"), args.languaje))
      .unique();
    if (languajeData) {
      if (languajeData.storageId)
        return await ctx.storage.getUrl(languajeData.storageId);
    }
  },
});
