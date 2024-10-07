import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    password: v.string(),
  }),
  pdfFiles: defineTable({
    language: v.string(),
    storageId: v.optional(v.id("_storage")),
  }),
});
