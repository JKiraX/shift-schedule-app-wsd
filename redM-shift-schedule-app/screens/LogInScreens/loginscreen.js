import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import ContinueButton from "../../components/Buttons/ContinueButton";
import Authentication from "./otp";
import ForgotPasswordScreen from "./forgotpassword";

const Stack = createNativeStackNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    // Add login logic here
    console.log("Login pressed");
    navigation.navigate("Authentication");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password");
    navigation.navigate("ForgotPassword");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../../assets/RedMPS-Logo_Black (1).png")}
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
      <ContinueButton text="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const AppLogin = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
      <Stack.Screen name="Authentication" component={Authentication} options={{headerTintColor: "#c82f2f"}} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerTintColor:"#c82f2f", headerTitle:"Forgot Password"}} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor:"white"
  },
  logo: {
    width: 270,
    height: 270,
    resizeMode: "center",
  },
  text: {
    fontSize: 22,
    marginBottom: 45,
    fontWeight: "bold",
    color:"#c82f2f"
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
    color: "rgba(200, 47, 47,0.8)",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

export default AppLogin;
