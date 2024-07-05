import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import SmallButton from "../../components/Buttons/smallButton";
import ContinueButton from "../../components/Buttons/ContinueButton";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePasswordScreen from "../changePassword";

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

const ProfileScreenContent = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleChangePassword = () => navigation.navigate("ChangePassword");
  const handleLogout = () => setModalVisible(true);
  const handleModalConfirm = () => {
    console.log("Logout confirmed");
    setModalVisible(false);
  };
  const handleModalCancel = () => setModalVisible(false);

  const renderInputField = (label, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        editable={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderInputField("Name", "User's full name")}
      {renderInputField("Contact Number", "User's phone number")}
      {renderInputField("Email", "User's email")}

      <View style={styles.buttonContainer}>
        <ContinueButton
          text="Change Password"
          onPress={handleChangePassword}
          style={styles.button}
        />
        <SmallButton
          text="Logout"
          onPress={handleLogout}
          style={styles.button}
        />
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You are logging out of your profile. Would you like to continue?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalConfirm}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    marginBottom: height * 0.02,
    width: width * 0.9,
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
    width: "100%",
    alignItems: "center",
    flexDirection:"column",
  },
  button: {
    marginVertical: height * 0.02,
    width: width * 0.9,
    maxWidth: 350,
    alignSelf:"center",
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
    width: width * 0.9,
    maxWidth: 365,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: width * 0.1,
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