import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapControls from "../components/MapControls";
import SplashScreen from "../components/SplashScreen";
export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <SplashScreen />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MapControls />
    </View>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
