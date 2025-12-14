import { createSettingsStyles } from "@/assets/images/styles/sittings.home.styles";
import { DangerZone } from "@/components/DangerZone";
import Preferences from "@/components/Preferences";

import { ProgressStats } from "@/components/ProgressStats";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  // هذه هي شاشة الإعدادات
  const { colors } = useTheme(); // استدعاء hook الثيم للحصول على الألوان

  const settingsStyles = createSettingsStyles(colors); // دالة لإنشاء التنسيقات بناءً على ألوان الثيم

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={settingsStyles.container}
    >
      <SafeAreaView style={settingsStyles.safeArea}>
        {/* HEADER: قسم الرأس المخصص لهذه الشاشة */}
        <View style={settingsStyles.header}>
          <View style={settingsStyles.titleContainer}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={settingsStyles.iconContainer}
            >
              <Ionicons name="settings" size={28} color="#ffffff" />
            </LinearGradient>
            <Text style={settingsStyles.title}>Settings</Text>
          </View>
        </View>

        {/* ScrollView للسماح بتمرير المحتوى إذا كان أطول من الشاشة */}
        <ScrollView
          style={settingsStyles.scrollView}
          contentContainerStyle={settingsStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* عرض المكونات الفرعية داخل شاشة الإعدادات */}
          <ProgressStats />
          <Preferences />
          <DangerZone />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default SettingsScreen;
