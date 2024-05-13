import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import ContinueButton from "./components/Buttons/ContinueButton";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add login logic here
    console.log("Login pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("./assets/RedMPS-Logo_Black (1).png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.text}>Log in to continue</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
      <ContinueButton text="Login" onPress={() => console.log("continue")} />
      <TouchableOpacity onPress={() => console.log("Forgot password pressed")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },

  logo: {
    width: 270,
    height: 270,
    resizeMode: "center",
  },
  text: {
    fontSize: 25,
    marginBottom: 45,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 40,
    width: "95%",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 22,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#98C1D9",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default login;
