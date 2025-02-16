import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import apartments from '@/assets/data/appartments.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location'; // Import expo-location
import Entypo from '@expo/vector-icons/Entypo';
import  { useState } from 'react';

type Apartment = (typeof apartments)[0];

export default function MapViewing() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Function to generate Leaflet map HTML
  const getLeafletMapHTML = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>OpenStreetMap with Leaflet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${userLocation?.latitude || 37.78825}, ${
            userLocation?.longitude || -122.4324
          }], 13); // Default coordinates
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add user location marker if available
          ${userLocation
            ? `L.marker([${userLocation.latitude}, ${userLocation.longitude}], { icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              }) })
                .addTo(map)
                .bindPopup("Your Location")
                .openPopup();`
            : ''}

          
        </script>
      </body>
    </html>
  `;

  // Request location permissions and fetch user's current location
  const locateUser = async () => {
    try {
      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      // Fetch the user's current location
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;

      // Update user location state
      setUserLocation({ latitude, longitude });

      // Optionally, re-render the map with the new location
      // You can reload the WebView or use JavaScript injection to update the map dynamically
    } catch (error) {
      console.error('Error fetching location:', error.message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Leaflet Map in WebView */}
        <WebView
          style={styles.map}
          originWhitelist={['*']}
          source={{ html: getLeafletMapHTML() }}
       
          
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {/* Locate Me Button */}
        <TouchableOpacity style={styles.locateButton} onPress={locateUser}>
          <Text style={styles.locateButtonText}><Entypo name="location" size={24} color="green" /></Text>
        </TouchableOpacity>

       

     
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listTitle: {
    textAlign: 'center',
    fontFamily: 'InterSemi',
    fontSize: 16,
    marginVertical: 5,
    marginBottom: 20,
  },
  selectedContainer: {
    position: 'absolute',
    bottom: 110,
    right: 10,
    left: 10,
  },
  bottomSheetContainer: {
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  locateButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    

  },
  locateButtonText: {
    color: '#fff',
    fontWeight: 'bold',

  },
});