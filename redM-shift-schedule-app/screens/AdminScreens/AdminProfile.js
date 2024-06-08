import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from "react-native";
import SmallButton from "../../components/Buttons/smallButton";
import ContinueButton from "../../components/Buttons/ContinueButton";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePasswordScreen from "../changePassword";

const Stack = createNativeStackNavigator();

const ProfileScreenContent = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleLogout = () => {
    setModalVisible(true);
  };

  const handleModalConfirm = () => {
    console.log("Logout confirmed");
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="User's full name"
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Users phone number"
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Users email"
          keyboardType="email-address"
          editable={false}
        />
      </View>

      <View style={styles.button}>
        <ContinueButton
          text="Change Password"
          onPress={handleChangePassword}
          style={styles.button}
        />
      </View>
      <View style={styles.button}>
        <SmallButton
          text="Logout"
          onPress={handleLogout}
          style={styles.button}
        />
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#d3d3d3",
              padding: 20,
              borderRadius: 15,
              width: 365,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              You are logging out of your profile. Would you like to continue?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 15,
                paddingTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 50,
                  paddingVertical: 15,
                  backgroundColor: "#3D5A80",
                  borderRadius: 15,
                  marginHorizontal: 10,
                }}
                onPress={handleModalCancel}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 50,
                  paddingVertical: 15,
                  backgroundColor: "#3D5A80",
                  borderRadius: 15,
                  marginHorizontal: 10,
                }}
                onPress={handleModalConfirm}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const ProfileScreen = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreenContent">
      <Stack.Screen
        name="ProfileScreenContent"
        component={ProfileScreenContent}
        options={{
          title: "Profile",
          headerTintColor: "#3D5A80",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: "Change Password",
          headerTintColor: "#3D5A80",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 18,
    width: 350,
    borderRadius: 15,
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    marginBottom: 10,
  },
});

export default ProfileScreen;
