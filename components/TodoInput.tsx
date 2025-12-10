import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";

const TodoInput = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);
  const [newTodo, setNewTodo] = useState("");
  const addTodo = useMutation(api.todos.addTodo);
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        await addTodo({ text: newTodo });
        setNewTodo("");
      } catch (error) {
        console.log(" error adding todo", error);
        Alert.alert("Error", "Failed to add todo", [{ text: "OK" }]);
      }
    }
  };

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={homeStyles.input}
          placeholder="What needs to be done?"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity
          style={homeStyles.addButton}
          activeOpacity={0.8}
          onPress={handleAddTodo}
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
            <Ionicons name="add-outline" size={24} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
