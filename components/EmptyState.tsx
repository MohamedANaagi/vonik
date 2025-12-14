import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export const EmptyState = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  return (
    <View style={homeStyles.emptyContainer}>
      <LinearGradient
        colors={colors.gradients.empty}
        style={homeStyles.emptyIconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="clipboard-outline" size={64} color={colors.textMuted} />
      </LinearGradient>
      <Text style={homeStyles.emptyText}>No todos yet!</Text>
      <Text style={homeStyles.emptySubtext}>
        Add your first todo above to get started
      </Text>
    </View>
  );
};
