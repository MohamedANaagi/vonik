import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  // هذا الملف هو المسؤول عن تخطيط شاشات التبويب (Tabs)
  const { colors } = useTheme(); // استدعاء hook مخصص للحصول على ألوان الثيم الحالي (فاتح/داكن)

  return (
    <Tabs
      screenOptions={{
        // إعدادات عامة تطبق على جميع الشاشات داخل الـ Tabs
        tabBarActiveTintColor: colors.primary, // لون الأيقونة والنص للتبويب النشط
        tabBarInactiveTintColor: colors.textMuted, // لون الأيقونة والنص للتبويب غير النشط
        tabBarStyle: {
          // تنسيقات شريط التبويبات نفسه
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          // تنسيقات نص التبويب
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false, // إخفاء الـ Header الافتراضي لكل شاشة
      }}
    >
      {/* تعريف شاشة "Todos" الرئيسية */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Todos",
          // دالة لعرض أيقونة التبويب
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />
      {/* تعريف شاشة "Settings" */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
