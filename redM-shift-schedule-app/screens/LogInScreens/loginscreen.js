import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ContinueButton from "../../components/Buttons/ContinueButton";
import * as SecureStore from 'expo-secure-store';
import apiClient from "../../../server/aspApiRoutes"; 
import ForgotPasswordScreen from "./forgotpassword";
import { CommonActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await apiClient.post("/api/authentication/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data) {
        const { id, email, token, userName, firstName, lastName, role } = response.data;

        await SecureStore.setItemAsync("userId", id.toString());
        await SecureStore.setItemAsync("email", email);
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("userName", userName);
        await SecureStore.setItemAsync("firstName", firstName);
        await SecureStore.setItemAsync("lastName", lastName);
        await SecureStore.setItemAsync("role", role);

        if (navigation) {
          let routeName = role === "Admin" 
            ? (email === "riza.mia@redmps.com" ? "AdminNav" : "AdminNav1") 
            : "UserNav";

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ 
                name: routeName,
                params: { userInfo: { firstName, lastName, email } }
              }],
            })
          );
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response && error.response.status === 401) {
        errorMessage = "Invalid email or password!";
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert("Login Failed", errorMessage);
    }
  };

  const handleForgotPassword = () => {
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
      <Text style={styles.text}>Log in to continue</Text>
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
        options={{ headerTintColor: "#c82f2f", headerTitle: "Forgot Password" }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  logoContainer: {
    width: width * 0.7,
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    fontSize: width * 0.055,
    marginBottom: height * 0.05,
    fontWeight: "bold",
    color: "#c82f2f",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: height * 0.04,
    width: width * 0.9,
  },
  input: {
    flex: 1,
    paddingLeft: width * 0.02,
    fontSize: width * 0.05,
    height: Platform.OS === "ios" ? 40 : 50,
  },
  forgotPasswordText: {
    fontSize: width * 0.04,
    color: "rgba(200, 47, 47, 0.8)",
    textDecorationLine: "underline",
    marginTop: height * 0.02,
  },
});

export default AppLogin;
