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
import axios from 'axios';

const Stack = createNativeStackNavigator();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.6.93:3001/login', { email, password });

      if (response.data) {
        const { admin } = response.data;
        const destination = admin ? 'AdminNav' : 'UserNav';
        navigation.navigate(destination, { userDetails });
      }
    } catch (error) {
      Alert.alert("Login failed", "Invalid email or password");
      console.error("Login error", error);
    }
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
      <Stack.Screen name="Authentication" component={Authentication} options={{headerTintColor: "#3D5A80"}} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{headerTintColor:"#3D5A80", headerTitle:"Forgot Password"}} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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
    color:"#3D5A80"
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

export default AppLogin;
