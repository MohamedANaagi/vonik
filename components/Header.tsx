import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

/**
 * مكون Header يعرض معلومات عن المهام والإحصائيات
 * يوضح عدد المهام المكتملة والكلية ونسبة الإنجاز
 */
const Header = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  // جلب قائمة المهام من قاعدة البيانات
  const todos = useQuery(api.todos.getTodos);

  /**
   * حساب عدد المهام المكتملة
   * يقوم بفلترة المهام وإرجاع عدد المهام التي تم إنجازها
   */
  const completedCount = todos
    ? todos.filter((todo) => todo.isCompleted).length
    : 0;

  /**
   * حساب العدد الكلي للمهام
   */
  const totalCount = todos ? todos.length : 0;

  /**
   * حساب نسبة الإنجاز بالمئة
   * تقوم بحساب النسبة المئوية للمهام المكتملة من إجمالي المهام
   * ترجع 0 إذا لم تكن هناك مهام
   */
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={homeStyles.header}>
      <View style={homeStyles.titleContainer}>
        <LinearGradient
          colors={colors.gradients.primary}
          style={homeStyles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="flash" size={30} color="#fff" />
        </LinearGradient>

        <View style={homeStyles.titleTextContainer}>
          <Text style={homeStyles.title}>Today&apos;s Tasks 👀</Text>
          <Text style={homeStyles.subtitle}>
            {completedCount} of {totalCount} completed
          </Text>
        </View>
      </View>

      <View style={homeStyles.progressContainer}>
        <View style={homeStyles.progressBarContainer}>
          <View style={homeStyles.progressBar}>
            <LinearGradient
              colors={colors.gradients.success}
              style={[
                homeStyles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          <Text style={homeStyles.progressText}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
