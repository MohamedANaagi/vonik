import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { EmptyState } from "@/components/EmptyState";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadgindSpinner";
import TodoInput from "@/components/TodoInput";
import { TodoItem } from "@/components/TodoItem";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useTheme } from "@/hooks/useTheme";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = Doc<"todos">;
// هذه هي الشاشة الرئيسية للتطبيق التي تعرض قائمة المهام
export default function Index() {
  // استدعاء hook الثيم للحصول على الألوان
  const { colors } = useTheme();

  // حالة لتتبع المهمة التي يتم تعديلها حاليًا
  const [editingId, setEditingId] = useState<Id<"todos"> | null>(null);
  // حالة لتخزين النص الجديد للمهمة أثناء التعديل
  const [editText, setEditText] = useState("");
  // تتبع المهام الجديدة المضافة
  const [newTodoIds, setNewTodoIds] = useState<Set<Id<"todos">>>(new Set());
  const previousTodosLength = useRef(0);

  // دالة لإنشاء التنسيقات بناءً على ألوان الثيم
  const homeStyles = createHomeStyles(colors);

  // استعلام لجلب قائمة المهام من قاعدة البيانات (Convex)
  const todos = useQuery(api.todos.getTodos);
  // دوال لتعديل البيانات في قاعدة البيانات (Convex)
  const updateTodo = useMutation(api.todos.updateTodo);

  /**
   * تتبع المهام الجديدة المضافة لتطبيق الأنيميشن عليها
   * تقوم بفحص عدد المهام الحالي مقارنة بعدد المهام السابق
   * وإذا تمت إضافة مهمة جديدة، تضيفها إلى قائمة المهام الجديدة لعرض الأنيميشن
   */
  useEffect(() => {
    if (todos && todos.length > previousTodosLength.current) {
      // تمت إضافة مهمة جديدة
      const newTodo = todos[0]; // أول عنصر في القائمة (تم ترتيبها desc)
      if (newTodo && !newTodo.isCompleted) {
        setNewTodoIds((prev) => new Set([...prev, newTodo._id]));
        // إزالة المهمة من قائمة المهام الجديدة بعد انتهاء الأنيميشن
        setTimeout(() => {
          setNewTodoIds((prev) => {
            const updated = new Set(prev);
            updated.delete(newTodo._id);
            return updated;
          });
        }, 600);
      }
    }
    previousTodosLength.current = todos?.length || 0;
  }, [todos]);

  // التحقق إذا كانت البيانات لا تزال قيد التحميل
  const isLoading = todos === undefined;

  // عرض مؤشر تحميل إذا كانت البيانات لم تصل بعد
  if (isLoading) return <LoadingSpinner />;

  /**
   * دالة لتفعيل وضع التعديل لمهمة معينة
   * تقوم بتعيين نص المهمة الحالي في حقل التعديل وتعيين معرف المهمة التي يتم تعديلها
   * @param todo - المهمة التي سيتم تعديلها
   */
  const handleEditTodo = (todo: Todo) => {
    setEditText(todo.text);
    setEditingId(todo._id);
  };

  /**
   * دالة لحفظ التعديلات على المهمة
   * تقوم بتحديث نص المهمة في قاعدة البيانات ثم تنظيف حالة التعديل
   * تعرض رسالة خطأ في حالة فشل العملية
   */
  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await updateTodo({ id: editingId, text: editText.trim() });
        setEditingId(null);
        setEditText("");
      } catch (error) {
        console.log("Error updating todo", error);
        Alert.alert("Error", "Failed to update todo");
      }
    }
  };

  /**
   * دالة لإلغاء وضع التعديل
   * تقوم بإلغاء عملية التعديل ومسح البيانات المؤقتة
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  /**
   * دالة مسؤولة عن عرض كل عنصر في قائمة المهام
   * تقوم بتحديد حالة كل عنصر (إذا كان يتم تعديله أو إذا كان جديداً)
   * ثم تقوم بتمرير البيانات المناسبة إلى مكون TodoItem
   * @param item - عنصر المهمة من القائمة
   * @param index - الفهرس الخاص بالعنصر في القائمة
   * @returns مكون TodoItem مع البيانات المطلوبة
   */
  const renderTodoItem = ({ item, index }: { item: Todo; index: number }) => {
    const isEditing = editingId === item._id;
    const isNewTodo = newTodoIds.has(item._id);

    return (
      <TodoItem
        item={item}
        index={index}
        isEditing={isEditing}
        editText={editText}
        setEditText={setEditText}
        onEdit={handleEditTodo}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        isNewTodo={isNewTodo}
      />
    );
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      {/* تغيير لون شريط الحالة ليتناسب مع الثيم */}
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={homeStyles.safeArea}>
        {/* مكون الـ Header المخصص */}
        <Header />
        {/* مكون لإضافة مهمة جديدة */}
        <TodoInput />
        {/* قائمة المهام، يتم عرض مكون بديل في حال كانت القائمة فارغة */}
        <FlatList
          data={todos}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item._id}
          style={homeStyles.todoList}
          contentContainerStyle={homeStyles.todoListContent}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
