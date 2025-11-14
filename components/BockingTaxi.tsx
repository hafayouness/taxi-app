import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useStore } from "../store/contentStore";
import {
  calculateDistance,
  calculateDuration,
  calculatePrice,
} from "../utils/calculation";
import { LOCATIONS, Location } from "../utils/location";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface BookingScreenProps {
  onClose?: () => void;
}

export default function BookingScreen({ onClose }: BookingScreenProps) {
  const router = useRouter();
  const { isNightMode, startRide, currentRide } = useStore();

  const [departure, setDeparture] = useState<Location>(LOCATIONS[1]);
  const [destination, setDestination] = useState<Location>(LOCATIONS[2]);
  const [selectPaiment, setSelectPaiment] = useState<"cash" | "card" | null>(
    null
  );

  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const cardAnimHeight = useRef(new Animated.Value(0)).current;
  const cardAnimOpacity = useRef(new Animated.Value(0)).current;

  const distance = calculateDistance(
    departure.latitude,
    departure.longitude,
    destination.latitude,
    destination.longitude
  );
  const price = calculatePrice(distance, isNightMode);
  const duration = calculateDuration(distance);
  useEffect(() => {
    if (selectPaiment === "card") {
      Animated.parallel([
        Animated.spring(cardAnimHeight, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.timing(cardAnimOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      cardAnimHeight.setValue(0);
      cardAnimOpacity.setValue(0);
    }
  }, [selectPaiment]);
  const handleConfirm = () => {
    const ride = {
      id: Date.now().toString(),
      departure,
      destination,
      distance,
      price,
      duration,
      startTime: new Date(),
      isNight: isNightMode,
    };

    startRide(ride);

    Alert.alert(
      "✅ Réservation Confirmée",
      `Trajet: ${ride.departure.name} → ${
        ride.destination.name
      }\n\nDistance: ${ride.distance.toFixed(1)} km\nDurée: ${
        ride.duration
      } min\nPrix: ${ride.price.toFixed(2)} DH${
        ride.isNight ? "\n\n🌙 Tarif de nuit appliqué (+50%)" : ""
      }`,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("✅ Ride sauvegardé dans currentRide");
            router.back();

            if (onClose) {
              setTimeout(() => onClose(), 500);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const LocationModal = ({
    visible,
    onClose,
    onSelect,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    onSelect: (loc: Location) => void;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.modalItem}
                onPress={() => {
                  onSelect(loc);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.locationIconContainer}>
                  <Text style={styles.locationIcon}>📍</Text>
                </View>
                <Text style={styles.modalItemText}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backBtn}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Réservation Taxi</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentRide && (
          <View style={styles.debugBanner}>
            <Text style={styles.debugIcon}>🚕</Text>
            <View style={styles.debugTextContainer}>
              <Text style={styles.debugTitle}>Course en cours</Text>
              <Text style={styles.debugText}>
                {currentRide.departure.name} → {currentRide.destination.name}
              </Text>
            </View>
          </View>
        )}

        {isNightMode && (
          <View style={styles.nightBadge}>
            <Text style={styles.nightBadgeText}>🌙 Mode Nuit (+50%)</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚕 Détails du Trajet</Text>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowDepartureModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconBox}>
              <Text style={styles.locationEmoji}>🔵</Text>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Départ</Text>
              <Text style={styles.locationName}>{departure.name}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowDestinationModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconBox}>
              <Text style={styles.locationEmoji}>🔴</Text>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Destination</Text>
              <Text style={styles.locationName}>{destination.name}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Résumé</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📏</Text>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>{distance.toFixed(1)} km</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>⏱️</Text>
              <Text style={styles.summaryLabel}>Durée</Text>
              <Text style={styles.summaryValue}>{duration} min</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💰</Text>
              <Text style={styles.summaryLabel}>Prix</Text>
              <Text style={styles.summaryValue}>{price.toFixed(2)} DH</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 Mode de Paiement</Text>

          <View>
            <TouchableOpacity
              onPress={() => setSelectPaiment("cash")}
              style={styles.paymentOptionCarte}
            >
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={styles.paymentText}>Espèces</Text>
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>Sélectionné</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.paymentOptionCarte}
              onPress={() => setSelectPaiment("card")}
            >
              <Text style={styles.paymentIcon}>💳</Text>
              <Text style={styles.paymentText}>Carte Bancaire</Text>
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>Sélectionné</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Les tarifs sont calculés selon la réglementation officielle des
            petits taxis de Casablanca
          </Text>
        </View>
      </ScrollView>

      {selectPaiment === "cash" && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>
              Confirmer la Réservation
            </Text>
            <Text style={styles.confirmButtonPrice}>{price.toFixed(2)} DH</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectPaiment === "card" && (
        <Animated.View
          style={{
            overflow: "hidden",
            maxHeight: cardAnimHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            opacity: cardAnimOpacity,
          }}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💳 Informations de Paiement</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de carte</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                maxLength={19}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Date d'expiration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/AA"
                  keyboardType="number-pad"
                  maxLength={5}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom sur la carte</Text>
              <TextInput
                style={styles.input}
                placeholder="JEAN DUPONT"
                autoCapitalize="characters"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.securityBanner}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>
                Paiement sécurisé. Vos données sont cryptées.
              </Text>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Payer par Carte</Text>
              <Text style={styles.confirmButtonPrice}>
                {price.toFixed(2)} DH
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <LocationModal
        visible={showDepartureModal}
        onClose={() => setShowDepartureModal(false)}
        onSelect={setDeparture}
        title="Choisir le point de départ"
      />
      <LocationModal
        visible={showDestinationModal}
        onClose={() => setShowDestinationModal(false)}
        onSelect={setDestination}
        title="Choisir la destination"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  backBtn: {
    fontSize: 16,
    color: "#FFB800",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  debugBanner: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  debugIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  debugTextContainer: {
    flex: 1,
  },
  debugTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  debugText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  nightBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "center",
  },
  nightBadgeText: {
    color: "#FFB800",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  locationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationEmoji: {
    fontSize: 20,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  chevron: {
    fontSize: 24,
    color: "#D1D5DB",
    fontWeight: "300",
  },
  divider: {
    alignItems: "center",
    paddingVertical: 8,
  },
  dividerLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFB800",
  },
  paymentOptionCarte: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFB800",
    marginTop: 20,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  selectedBadge: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    backgroundColor: "#FFB800",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#FFB800",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButtonPrice: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6B7280",
  },
  modalList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationIcon: {
    fontSize: 20,
  },
  modalItemText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
  },
  row: {
    flexDirection: "row",
  },
  securityBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  securityIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: "#065F46",
    fontWeight: "500",
  },
});
