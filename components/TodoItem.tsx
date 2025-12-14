import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Todo = Doc<"todos">;

interface TodoItemProps {
  item: Todo;
  index: number;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  onEdit: (todo: Todo) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  isNewTodo?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const TodoItem = ({
  item,
  index,
  isEditing,
  editText,
  setEditText,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  isNewTodo = false,
}: TodoItemProps) => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  // Animation values
  const opacity = useSharedValue(isNewTodo ? 0 : 1);
  const translateX = useSharedValue(isNewTodo ? 50 : 0);
  const scale = useSharedValue(isNewTodo ? 0.8 : 1);

  /**
   * تشغيل الأنيميشن عند ظهور المهمة الجديدة
   * تقوم بتطبيق ثلاث أنيميشن متزامنة:
   * 1. Fade In - ظهور تدريجي للمهمة (من الشفافية إلى الوضوح الكامل)
   * 2. Slide from Right - انزلاق المهمة من اليمين إلى المركز
   * 3. Scale - تكبير تدريجي للمهمة
   * يتم تأخير كل أنيميشن بناءً على فهرس العنصر لإنشاء تأثير متتالي (staggered)
   */
  useEffect(() => {
    if (isNewTodo) {
      // أنيميشن الشفافية - ظهور تدريجي
      opacity.value = withDelay(
        index * 50,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        })
      );
      // أنيميشن الانزلاق - من اليمين إلى المركز
      translateX.value = withDelay(
        index * 50,
        withSpring(0, {
          damping: 15,
          stiffness: 150,
        })
      );
      // أنيميشن التكبير - من 80% إلى 100%
      scale.value = withDelay(
        index * 50,
        withSpring(1, {
          damping: 12,
          stiffness: 150,
        })
      );
    }
  }, [isNewTodo, index]);

  /**
   * أنيميشن ستايل للمهمة
   * يجمع بين تأثيرات الشفافية والانزلاق والتكبير في ستايل واحد
   */
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  /**
   * دالة لتبديل حالة المهمة (مكتملة / غير مكتملة)
   * تقوم بتغيير حالة المهمة من مكتملة إلى غير مكتملة والعكس
   * تعرض رسالة خطأ في حالة فشل العملية
   * @param id - معرف المهمة التي سيتم تبديل حالتها
   */
  const handleToggleTodo = async (id: Id<"todos">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.log("Error toggling todo", error);
      Alert.alert("Error", "Failed to toggle todo");
    }
  };

  /**
   * دالة لحذف مهمة معينة
   * تعرض رسالة تأكيد للمستخدم قبل الحذف
   * إذا أكد المستخدم الحذف، تقوم بحذف المهمة من قاعدة البيانات
   * @param id - معرف المهمة التي سيتم حذفها
   */
  const handleDeleteTodo = async (id: Id<"todos">) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTodo({ id }),
      },
    ]);
  };

  return (
    <AnimatedView style={[homeStyles.todoItemWrapper, animatedStyle]}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={homeStyles.todoItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* مربع الاختيار لتبديل حالة المهمة */}
        <TouchableOpacity
          style={homeStyles.checkbox}
          activeOpacity={0.7}
          onPress={() => handleToggleTodo(item._id)}
        >
          <LinearGradient
            colors={
              item.isCompleted
                ? colors.gradients.success
                : colors.gradients.muted
            }
            style={[
              homeStyles.checkboxInner,
              {
                borderColor: item.isCompleted ? "transparent" : colors.border,
              },
            ]}
          >
            {item.isCompleted && (
              <Ionicons name="checkmark" size={20} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* عرض واجهة التعديل أو واجهة العرض العادية بناءً على حالة التعديل */}
        {isEditing ? (
          <View style={homeStyles.editContainer}>
            <TextInput
              style={homeStyles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              multiline
              placeholder="Edit your todo..."
              placeholderTextColor={colors.textMuted}
            />
            {/* أزرار الحفظ والإلغاء في وضع التعديل */}
            <View style={homeStyles.editButtons}>
              <TouchableOpacity onPress={onSaveEdit} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradients.success}
                  style={homeStyles.editButton}
                >
                  <Ionicons name="checkmark" size={18} color="#fff" />
                  <Text style={homeStyles.editButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={onCancelEdit} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradients.muted}
                  style={homeStyles.editButton}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                  <Text style={homeStyles.editButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // عرض نص المهمة وأزرار الإجراءات (تعديل وحذف)
          <View style={homeStyles.todoTextContainer}>
            <Text
              style={[
                homeStyles.todoText,
                item.isCompleted && {
                  textDecorationLine: "line-through",
                  color: colors.textMuted,
                  opacity: 0.6,
                },
              ]}
            >
              {item.text}
            </Text>

            {/* أزرار الإجراءات (تعديل وحذف) */}
            <View style={homeStyles.todoActions}>
              <TouchableOpacity
                onPress={() => onEdit(item)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={colors.gradients.warning}
                  style={homeStyles.actionButton}
                >
                  <Ionicons name="pencil" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTodo(item._id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={colors.gradients.danger}
                  style={homeStyles.actionButton}
                >
                  <Ionicons name="trash" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </AnimatedView>
  );
};
