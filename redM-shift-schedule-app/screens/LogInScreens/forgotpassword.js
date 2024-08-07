import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../../../server/aspApiRoutes";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (email.trim() === "") {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const response = await apiClient.post("/api/authentication/forgot-password", {
        email,
      });

      if (response.status === 200) {
        Alert.alert(
          "Reset Password",
          "A password reset link has been sent to your email."
        );
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      let errorMessage = "An error occurred while processing your request.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Forgot your password?</Text>
        <Text style={styles.description}>Enter your email below</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInLink}>Sign in.</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.01,
    color: "#c82f2f",
  },
  description: {
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: Platform.OS === "ios" ? 60 : 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
  },
  button: {
    backgroundColor: "#c82f2f",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 5,
    marginVertical: height * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "300",
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInText: {
    fontSize: width * 0.04,
  },
  signInLink: {
    color: "rgba(200, 47, 47, 0.8)",
    fontSize: width * 0.04,
  },
});

export default ForgotPasswordScreen;
