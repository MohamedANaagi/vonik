import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * دالة لجلب جميع المهام من قاعدة البيانات
 * تقوم بجلب جميع المهام وترتيبها حسب التاريخ (الأحدث أولاً)
 * @returns قائمة بجميع المهام
 */
export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("desc").collect();
    return todos;
  },
});

/**
 * دالة لإضافة مهمة جديدة إلى قاعدة البيانات
 * تقوم بإنشاء مهمة جديدة بنص محدد وحالة غير مكتملة افتراضياً
 * @param text - نص المهمة المراد إضافتها
 * @returns معرف المهمة الجديدة التي تم إنشاؤها
 */
export const addTodo = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
    });

    return todoId;
  },
});

/**
 * دالة لتبديل حالة المهمة (مكتملة / غير مكتملة)
 * تقوم بقراءة المهمة من قاعدة البيانات وتبديل حالتها
 * @param id - معرف المهمة التي سيتم تبديل حالتها
 * @throws ConvexError في حالة عدم وجود المهمة
 */
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError("Todo not found");

    await ctx.db.patch(args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

/**
 * دالة لحذف مهمة من قاعدة البيانات
 * تقوم بحذف المهمة بناءً على معرفها
 * @param id - معرف المهمة التي سيتم حذفها
 */
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * دالة لتحديث نص المهمة
 * تقوم بتعديل نص المهمة في قاعدة البيانات
 * @param id - معرف المهمة التي سيتم تحديثها
 * @param text - النص الجديد للمهمة
 */
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      text: args.text,
    });
  },
});

/**
 * دالة لحذف جميع المهام من قاعدة البيانات
 * تقوم بجلب جميع المهام ثم حذفها واحداً تلو الآخر
 * @returns عدد المهام التي تم حذفها
 */
export const clearAllTodos = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();

    // Delete all todos - حذف جميع المهام
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }

    return { deletedCount: todos.length };
  },
});