import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
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
