import React from "react";
import { Text, View, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "react-native-otp-entry";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ContinueButton from "../../components/Buttons/ContinueButton";
import { useNavigation } from "@react-navigation/native";
import UserNav from "../../components/Navigation/UserNav";

const OtpScreen = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate("UserNav");
  };

  return (
    <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={60}
        color="#D3D3D3"
      />
      <Text style={{ color: "#3D5A80", fontSize: 35 }}>Enter Code</Text>
      <Text>Your temporary login code was sent to</Text>
      {/* Number needs to come from back-end */}
      <Text style={{ fontWeight: "bold" }}>*** *** 1234</Text>
      <View style={{ marginVertical: 40, width: 300 }}>
        <OtpInput
          numberOfDigits={5}
          focusColor="#98C1D9"
          focusStickBlinkingDuration={500}
          onTextChange={(text) => console.log(text)}
          disabled={false}
          theme={{
            pinCodeContainerStyle: {
              backgroundColor: "white",
              width: 58,
              height: 58,
              borderRadius: 12,
            },
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <Text>Didn't receive a code?</Text>
        <TouchableOpacity>
          <Text style={{ fontStyle: "italic", color: "#98C1D9" }}> Resend</Text>
        </TouchableOpacity>
      </View>
      <ContinueButton text="Continue" onPress={handleContinue} />
    </View>
  );
};

const Authentication = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <OtpScreen />
    </SafeAreaView>
  );
};

export default Authentication;
