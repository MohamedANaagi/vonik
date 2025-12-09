import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const todos = useQuery(api.todos.getTodos);
  console.log(todos);
  const addTodo = useMutation(api.todos.addTodos);
  const clearAllTodos = useMutation(api.todos.clearAllTodos);

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text onPress={() => addTodo({ text: "mahmed nagi" })}>add todos</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text
          onPress={() => {
            clearAllTodos();
          }}
        >
          clear
        </Text>
      </TouchableOpacity>
      <Text style={styles.content}>index.tsx to edit this screen.</Text>
      <Text>dcdcdcf</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e293b",
  },
  content: {
    color: "green",
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
