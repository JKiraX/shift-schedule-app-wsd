import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import ContinueButton from "../../components/Buttons/ContinueButton";
import { AuthContext } from "../../../server/AuthProvider";
import ForgotPasswordScreen from "./forgotpassword";


const Stack = createNativeStackNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate("AdminHome");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password");
    navigation.navigate("ForgotPassword");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/RedMPS-Logo_Black (1).png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.headerText}>Log in to continue</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerTintColor: "#3D5A80", headerTitle: "Forgot Password" }}
      />
    </Stack.Navigator>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: width * 0.06,
    marginBottom: height * 0.05,
    fontWeight: "bold",
    color: "#3D5A80",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: height * 0.04,
    width: "100%",
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    paddingHorizontal: 10,
    fontSize: width * 0.045,
  },
  forgotPasswordText: {
    fontSize: width * 0.04,
    color: "rgba(200, 47, 47, 0.8)",
    textDecorationLine: "underline",
    marginTop: height * 0.02,
  },
});

export default AppLogin;
