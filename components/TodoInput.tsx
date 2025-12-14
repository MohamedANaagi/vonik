import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const TodoInput = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);
  const [newTodo, setNewTodo] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const addTodo = useMutation(api.todos.addTodo);

  // Animation values
  const buttonScale = useSharedValue(1);
  const buttonRotation = useSharedValue(0);
  const iconScale = useSharedValue(1);

  /**
   * دالة لإضافة مهمة جديدة
   * تقوم بفحص إذا كان النص المدخل ليس فارغاً، ثم:
   * 1. تشغيل تأثير الاهتزاز (Haptic Feedback)
   * 2. تشغيل أنيميشن الزر (تكبير وتصغير)
   * 3. تشغيل أنيميشن الأيقونة (دوران وتكبير)
   * 4. إضافة المهمة إلى قاعدة البيانات
   * 5. مسح حقل الإدخال بعد الإضافة
   * تعرض رسالة خطأ في حالة فشل العملية
   */
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        // Haptic feedback - تأثير الاهتزاز عند الضغط على الزر
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Button press animation - أنيميشن تكبير وتصغير الزر عند الضغط
        buttonScale.value = withSequence(
          withSpring(0.9, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        );

        // Icon rotation animation - أنيميشن دوران الأيقونة 180 درجة ثم العودة
        buttonRotation.value = withSequence(
          withTiming(180, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(0, {
            duration: 0,
          })
        );

        // Icon scale animation - أنيميشن تكبير وتصغير الأيقونة
        iconScale.value = withSequence(
          withTiming(0.8, { duration: 150 }),
          withSpring(1, { damping: 8, stiffness: 200 })
        );

        await addTodo({ text: newTodo });
        setNewTodo("");
      } catch (error) {
        console.log(" error adding todo", error);
        Alert.alert("Error", "Failed to add todo", [{ text: "OK" }]);
      }
    }
  };

  /**
   * أنيميشن ستايل للزر
   * يطبق تأثيرات التكبير والدوران على الزر عند الضغط
   */
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { rotate: `${buttonRotation.value}deg` },
    ],
  }));

  /**
   * أنيميشن ستايل للأيقونة
   * يطبق تأثير التكبير والتصغير على الأيقونة داخل الزر
   */
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={[homeStyles.input, isFocused && homeStyles.inputFocused]}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textMuted + "80"}
          value={newTodo}
          onChangeText={setNewTodo}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <AnimatedTouchableOpacity
          style={[homeStyles.addButton, buttonAnimatedStyle]}
          activeOpacity={0.8}
          onPress={handleAddTodo}
          disabled={!newTodo.trim()}
        >
          <LinearGradient
            colors={
              newTodo.trim() ? colors.gradients.primary : colors.gradients.muted
            }
            style={[
              homeStyles.addButton,
              newTodo.trim() ? {} : homeStyles.addButtonDisabled,
            ]}
          >
            <Animated.View style={iconAnimatedStyle}>
              <Ionicons name="add" size={26} color="#fff" />
            </Animated.View>
          </LinearGradient>
        </AnimatedTouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
