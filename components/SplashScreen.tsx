import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounce1 = useRef(new Animated.Value(0)).current;
  const bounce2 = useRef(new Animated.Value(0)).current;
  const bounce3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const createBounce = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createBounce(bounce1, 0);
    createBounce(bounce2, 100);
    createBounce(bounce3, 200);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#F5F5F5", "#E8E8E8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[styles.bgCircle1, { transform: [{ scale: pulseAnim }] }]}
      />
      <Animated.View
        style={[styles.bgCircle2, { transform: [{ scale: pulseAnim }] }]}
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.logoContainer}>
          <Animated.View
            style={[styles.logoGlow, { transform: [{ scale: pulseAnim }] }]}
          />

          <View style={styles.logoCircle}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Image
                source={require("../assets/images/taxi-logo.jpeg")}
                style={{ width: 100, height: 100, borderRadius: 50 }}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Taxi<Text style={styles.titleHighlight}>Drive</Text>
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Bienvenu a TaxiDrive , Toujours là pour vous emmener.
        </Text>

        <View style={styles.dotsContainer}>
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: bounce1 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: bounce2 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: bounce3 }] }]}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  bgCircle1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  bgCircle2: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: "rgba(0, 168, 107, 0.15)",
  },
  content: { alignItems: "center", paddingHorizontal: 20 },
  logoContainer: {
    marginBottom: 32,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 215, 0, 0.25)",
  },
  logoCircle: {
    // backgroundColor: "#1A1A1A",
    padding: 24,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: { flexDirection: "row", marginBottom: 12 },
  title: { fontSize: 48, fontWeight: "bold", color: "#212121" },
  titleHighlight: { color: "#e03131" },
  subtitle: {
    fontSize: 18,
    color: "#212121",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
    opacity: 0.7,
  },
  dotsContainer: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#00A86B" },
});
