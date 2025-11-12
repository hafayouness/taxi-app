import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { popularPlaces } from "../utils/marker";
import { taxisData } from "../utils/taxiData";

interface AnimatedTaxi {
  id: number;
  name: string;
  phone: string;
  routeIndex: number;
  route: { lat: number; lng: number }[];
  animatedLat: Animated.Value;
  animatedLng: Animated.Value;
  rotation: Animated.Value;
}

const MapControls = () => {
  const INITIAL_REGION = {
    latitude: 33.5731,
    longitude: -7.5898,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const mapRef = useRef<MapView>(null);

  const [animatedTaxis] = useState<AnimatedTaxi[]>(
    taxisData.map((taxi) => {
      const firstPoint = taxi.route[0];
      return {
        id: taxi.id,
        name: taxi.name,
        phone: taxi.phone,
        routeIndex: 0,
        route: taxi.route,
        animatedLat: new Animated.Value(firstPoint.lat),
        animatedLng: new Animated.Value(firstPoint.lng),
        rotation: new Animated.Value(0),
      };
    })
  );

  useEffect(() => {
    const moveTaxis = () => {
      animatedTaxis.forEach((taxi) => {
        let nextIndex = taxi.routeIndex + 1;
        if (nextIndex >= taxi.route.length) nextIndex = 0;

        const nextPoint = taxi.route[nextIndex];

        Animated.parallel([
          Animated.timing(taxi.animatedLat, {
            toValue: nextPoint.lat,
            duration: 3500,
            useNativeDriver: false,
          }),
          Animated.timing(taxi.animatedLng, {
            toValue: nextPoint.lng,
            duration: 3500,
            useNativeDriver: false,
          }),
        ]).start();

        taxi.routeIndex = nextIndex;
      });
    };

    const interval = setInterval(moveTaxis, 3500);
    return () => clearInterval(interval);
  }, [animatedTaxis]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        initialRegion={INITIAL_REGION}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        showsTraffic={true}
        showsCompass
        loadingEnabled
      >
        {popularPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.coordinates.latitude,
              longitude: place.coordinates.longitude,
            }}
            title={place.name}
            pinColor="#4A90E2"
          />
        ))}

        {animatedTaxis.map((taxi) => (
          <Polyline
            key={`route-${taxi.id}`}
            coordinates={taxi.route.map((point) => ({
              latitude: point.lat,
              longitude: point.lng,
            }))}
            strokeColor="rgba(255, 184, 0, 0.3)"
            strokeWidth={2}
            lineDashPattern={[5, 5]}
          />
        ))}

        {animatedTaxis.map((taxi) => {
          const AnimatedMarker = Animated.createAnimatedComponent(Marker);

          return (
            <AnimatedMarker
              key={taxi.id}
              coordinate={{
                latitude: taxi.animatedLat,
                longitude: taxi.animatedLng,
              }}
              title={taxi.name}
              description={taxi.phone}
              anchor={{ x: 0.5, y: 0.5 }}
              flat={true}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: taxi.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <View style={styles.taxiMarker}>
                  <View style={styles.taxiIcon}>
                    <LottieView
                      source={require("../assets/taxi.json")}
                      autoPlay
                      loop
                      style={{ width: 50, height: 50 }}
                    />
                    <Text style={styles.taxiNumber}>{taxi.id}</Text>
                  </View>
                  <View style={styles.pulseOuter} />
                </View>
              </Animated.View>
            </AnimatedMarker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  taxiMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  taxiIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseOuter: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 184, 0, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 184, 0, 0.4)",
  },
  taxiNumber: {
    position: "absolute",
    top: -30,
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  bottomSheetContent: {
    padding: 20,
    alignItems: "center",
  },
  taxiName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taxiPhone: {
    fontSize: 16,
    marginTop: 8,
    color: "blue",
  },
  reserveButton: {
    marginTop: 20,
    backgroundColor: "#FFB800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  reserveButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapControls;
