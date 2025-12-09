

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  handler: async (ctx) => {
    const todos =await ctx.db.query("todos").order("desc").collect();
    return todos;
  },
});

export const addTodos = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", { text: args.text, isCompleted: false });
  },
});

export const toggleTodos = mutation({
  args: {
    id: v.id("todos"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
   const todo = await ctx.db.get(args.id);
    if (!todo)   throw new ConvexError("Todo not found");
    await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
    
    
  },
});

export const deleteTask = mutation({
  args: { id: v.id("todos"), },
   
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

    export const clearAllTodos = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    // Delete all todos in parallel for better performance.
    await Promise.all(todos.map((todo) => ctx.db.delete(todo._id)));
    return { deleteCount: todos.length };
  },
});
