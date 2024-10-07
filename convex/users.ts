import bcrypt from "bcrypt";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const authenticateUser = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.username))
      .first();

    if (!user || user.password !== args.password) {
      return { success: false, message: "Invalid username or password" };
    }
    const isValidPassword = user.password === args.password;
    console.log(isValidPassword);
    if (!isValidPassword) {
      return { success: false, message: "Invalid username or password" };
    }
    return { success: true, user };
  },
});
