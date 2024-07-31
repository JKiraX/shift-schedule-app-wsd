import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import SmallButton from "../../components/Buttons/smallButton";
import ContinueButton from "../../components/Buttons/ContinueButton";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePasswordScreen from "../changePassword";
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const ProfileScreenContent = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      const firstName = await SecureStore.getItemAsync('firstName');
      const lastName = await SecureStore.getItemAsync('lastName');
      const email = await SecureStore.getItemAsync('email');
      setUserInfo({ firstName, lastName, email });
    };
    loadUserInfo();
  }, []);

  const handleChangePassword = () => navigation.navigate("ChangePassword");
  
  const handleLogout = () => setModalVisible(true);
  
  const handleModalConfirm = async () => {
    try {
      // Clear all stored user data
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('email');
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('firstName');
      await SecureStore.deleteItemAsync('lastName');
      await SecureStore.deleteItemAsync('role');

      // Navigate to Login screen and reset the navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Logout Failed", "An unexpected error occurred. Please try again.");
    }
  };

  const handleModalCancel = () => setModalVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <InputField label="First Name" value={userInfo.firstName} />
        <InputField label="Last Name" value={userInfo.lastName} />
        <InputField label="Email" value={userInfo.email} />
        <View style={styles.buttonContainer}>
          <ContinueButton
            text="Change Password"
            onPress={handleChangePassword}
            style={styles.button}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SmallButton
            text="Logout"
            onPress={handleLogout}
            style={styles.button}
          />
        </View>
        <LogoutModal
          visible={modalVisible}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
        />
      </View>
    </SafeAreaView>
  );
};

const InputField = ({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      editable={false}
    />
  </View>
);

const LogoutModal = ({ visible, onConfirm, onCancel }) => (
  <Modal visible={visible} transparent={true} animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>
          You are logging out of your profile. Would you like to continue?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onCancel}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onConfirm}>
            <Text style={styles.modalButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ProfileScreen = () => (
  <Stack.Navigator initialRouteName="ProfileScreenContent">
    <Stack.Screen
      name="ProfileScreenContent"
      component={ProfileScreenContent}
      options={{
        title: "Profile",
        headerTintColor: "#c82f2f",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{
        title: "Change Password",
        headerTintColor: "#c82f2f",
        headerTitleAlign: "center",
      }}
    />
  </Stack.Navigator>
);

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 18,
    width: "100%",
    maxWidth: 350,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#e9ecef",
    width: "100%",
    fontSize: 17,
  },
  buttonContainer: {
    marginBottom:10,
  },
  button: {
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 15,
    width: Math.min(365, width * 0.9),
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    paddingTop: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#c82f2f",
    borderRadius: 15,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
