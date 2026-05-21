import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, SafeAreaView, StatusBar
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// ==================== SCREEN 1: WELCOME ====================
function WelcomeScreen({ onStart }) {
  return (
    <SafeAreaView style={styles.welcomeContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.welcomeContent}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🗺️</Text>
        </View>
        <Text style={styles.appTitle}>Finder App</Text>
        <Text style={styles.appSubtitle}>
          Track your live location and explore the world with real-time accuracy.
        </Text>
      </View>
      <TouchableOpacity style={styles.getStartedBtn} onPress={onStart}>
        <Text style={styles.getStartedText}>Get Started  →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ==================== SCREEN 2: DASHBOARD ====================
function DashboardScreen({ onOpenMap, onOpenSettings, onBack }) {
  return (
    <SafeAreaView style={styles.dashContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerBack}>‹ Welcome</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={{ width: 70 }} />
      </View>

      {/* Body */}
      <View style={styles.dashBody}>
        <Text style={styles.dashHeading}>Welcome Back!</Text>
        <Text style={styles.dashSub}>What would you like to do today?</Text>

        {/* Card 1 */}
        <TouchableOpacity style={styles.card} onPress={onOpenMap}>
          <Text style={styles.cardIcon}>📍</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Live Location Map</Text>
            <Text style={styles.cardDesc}>Check your GPS coordinates on Google Maps</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        {/* Card 2 */}
        <TouchableOpacity style={styles.card} onPress={onOpenSettings}>
          <Text style={styles.cardIcon}>⚙️</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>App Settings</Text>
            <Text style={styles.cardDesc}>Manage permissions and map types</Text>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==================== SCREEN 3: LIVE MAP ====================
function MapScreen({ onBack }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission chahiye!');
      setLoading(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerBack}>‹ Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Map</Text>
        <View style={{ width: 70 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 10, color: '#555' }}>Location dhundh raha hai...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={location}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {location && (
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="Aap Yahan Hain!"
                description="Yeh aapki current location hai"
              />
            )}
          </MapView>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📍 Aapki Location</Text>
            <Text style={styles.infoText}>Lat:  {location?.latitude.toFixed(6)}</Text>
            <Text style={styles.infoText}>Lng: {location?.longitude.toFixed(6)}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ==================== SCREEN 4: SETTINGS ====================
function SettingsScreen({ onBack }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerBack}>‹ Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 70 }} />
      </View>
      <View style={styles.center}>
        <Text style={{ fontSize: 40 }}>⚙️</Text>
        <Text style={{ fontSize: 18, marginTop: 10, color: '#555' }}>Settings Coming Soon!</Text>
      </View>
    </SafeAreaView>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState('welcome');

  if (screen === 'welcome') return <WelcomeScreen onStart={() => setScreen('dashboard')} />;
  if (screen === 'dashboard') return <DashboardScreen onBack={() => setScreen('welcome')} onOpenMap={() => setScreen('map')} onOpenSettings={() => setScreen('settings')} />;
  if (screen === 'map') return <MapScreen onBack={() => setScreen('dashboard')} />;
  if (screen === 'settings') return <SettingsScreen onBack={() => setScreen('dashboard')} />;
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  // Welcome
  welcomeContainer: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'space-between', paddingBottom: 50 },
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#DCEEFF', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  iconEmoji: { fontSize: 55 },
  appTitle: { fontSize: 32, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  appSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
  getStartedBtn: { backgroundColor: '#2196F3', marginHorizontal: 40, paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  getStartedText: { color: '#fff', fontSize: 17, fontWeight: '600' },

  // Dashboard
  dashContainer: { flex: 1, backgroundColor: '#f2f2f2' },
  dashBody: { padding: 20 },
  dashHeading: { fontSize: 26, fontWeight: 'bold', color: '#111', marginTop: 10 },
  dashSub: { fontSize: 14, color: '#888', marginBottom: 25 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  cardIcon: { fontSize: 30, marginRight: 15 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  cardDesc: { fontSize: 13, color: '#888', marginTop: 3 },
  cardArrow: { fontSize: 24, color: '#bbb' },

  // Header
  header: { backgroundColor: '#2196F3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12 },
  headerBack: { color: '#fff', fontSize: 16, width: 90 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Map Info Box
  infoBox: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: '#fff', borderRadius: 14, padding: 15, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  infoText: { fontSize: 14, color: '#555', marginTop: 2 },

  // General
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});