import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ReservationBottomSheetProps {
  delay?: number;
}

const ReservationBottomSheet: React.FC<ReservationBottomSheetProps> = ({
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            friction: 6,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, fadeAnim, translateY]);

  const handleReservation = () => {
    console.log("Réservation demandée");
  };

  const closeModal = () => {
    setIsVisible(false);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          closeModal();
        } else if (gestureState.dy < -50) {
          setIsExpanded(true);
        }
      },
    })
  ).current;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      swipeDirection={["down"]}
      style={styles.modal}
      backdropOpacity={0.3}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      useNativeDriverForBackdrop
    >
      <View
        style={[
          styles.bottomSheetContainer,
          isExpanded ? styles.expandedContainer : styles.collapsedContainer,
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.handleContainer}>
          <View style={styles.handleIndicator} />
        </View>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.animationContainer}>
            <LottieView
              source={require("../assets/taxi.json")}
              autoPlay
              loop
              style={styles.taxiAnimation}
            />
          </View>

          <Text style={styles.title}>🚕 Réservation Taxi</Text>
          <Text style={styles.subtitle}>Petits Taxis Rouges de Casablanca</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <Text style={styles.infoText}>Disponible 24/7</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>💳</Text>
              <Text style={styles.infoText}>Paiement facile</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reserveButton}
            activeOpacity={0.8}
            onPress={handleReservation}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.reserveButtonText}>Réserver maintenant</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
            <Text style={styles.footerText}>
              {isExpanded
                ? "Glissez vers le bas pour réduire"
                : "Glissez vers le haut pour plus d'options"}
            </Text>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedTitle}>Options supplémentaires</Text>
              <View style={styles.optionItem}>
                <Text style={styles.optionIcon}>📍</Text>
                <Text style={styles.optionText}>
                  Suivre votre trajet en temps réel
                </Text>
              </View>
              <View style={styles.optionItem}>
                <Text style={styles.optionIcon}>⭐</Text>
                <Text style={styles.optionText}>
                  Chauffeurs hautement qualifiés
                </Text>
              </View>
              <View style={styles.optionItem}>
                <Text style={styles.optionIcon}>🔒</Text>
                <Text style={styles.optionText}>Trajets sécurisés</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  bottomSheetContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  collapsedContainer: {
    height: SCREEN_HEIGHT * 0.45,
  },
  expandedContainer: {
    height: SCREEN_HEIGHT * 0.9,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handleIndicator: {
    backgroundColor: "#D1D5DB",
    width: 50,
    height: 5,
    borderRadius: 3,
  },
  contentContainer: {
    padding: 16,
    alignItems: "center",
  },
  animationContainer: {
    marginBottom: 16,
  },
  taxiAnimation: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  reserveButton: {
    width: "100%",
    backgroundColor: "#FFB800",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#FFB800",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
    marginBottom: 12,
  },
  reserveButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  expandButton: {
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  expandedContent: {
    width: "100%",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
});

export default ReservationBottomSheet;
