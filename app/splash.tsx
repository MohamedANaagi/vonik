import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface SplashScreenProps {
  autoNavigate?: boolean;
}

const SplashScreen = ({ autoNavigate = false }: SplashScreenProps = {}) => {
  const { colors } = useTheme();
  const router = useRouter();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const iconRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Start animations
    logoScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    titleOpacity.value = withDelay(
      400,
      withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      })
    );

    titleTranslateY.value = withDelay(
      400,
      withSpring(0, {
        damping: 12,
        stiffness: 100,
      })
    );

    // Continuous rotation animation
    iconRotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    // Navigate to main app after animation (only if autoNavigate is true)
    if (autoNavigate) {
      const timer = setTimeout(() => {
        router.replace("/(tabs)");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [autoNavigate]);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${iconRotation.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <LinearGradient colors={colors.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Main Logo Icon with Animation */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <LinearGradient
              colors={["#ffffff", "#f0f0f0"]}
              style={styles.logoGradient}
            >
              <Ionicons name="flash" size={80} color={colors.primary} />
            </LinearGradient>
          </Animated.View>

          {/* Pulse Ring Effect */}
          <Animated.View
            style={[
              styles.pulseRing,
              { borderColor: "#ffffff" },
              pulseAnimatedStyle,
            ]}
          />

          {/* App Title with Animation */}
          <Animated.View style={titleAnimatedStyle}>
            <Text style={styles.title}>Vonik</Text>
            <Text style={styles.subtitle}>Stay Organized, Get Things Done</Text>
          </Animated.View>
        </View>

        {/* Loading Indicator */}
        <View style={styles.footer}>
          <View style={[styles.dot, { backgroundColor: "#ffffff" }]} />
          <View
            style={[styles.dot, { backgroundColor: "#ffffff", opacity: 0.5 }]}
          />
          <View
            style={[styles.dot, { backgroundColor: "#ffffff", opacity: 0.3 }]}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  logoGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    opacity: 0.3,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
    textAlign: "center",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default SplashScreen;
