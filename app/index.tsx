import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";

/**
 * مكون الصفحة الرئيسية للتطبيق
 * يعرض شاشة البداية (Splash Screen) لمدة 2.5 ثانية ثم ينتقل إلى الشاشة الرئيسية
 */
export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  /**
   * useEffect لإدارة عرض شاشة البداية
   * يقوم بعرض الشاشة لمدة 2.5 ثانية ثم إخفائها والانتقال للشاشة الرئيسية
   * يقوم بتنظيف المؤقت عند إلغاء المكون لمنع تسريب الذاكرة
   */
  useEffect(() => {
    // Show splash for a minimum time
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return <Redirect href="/(tabs)" />;
}
