import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import apartments from '@/assets/data/appartments.json';
import ApartmentListItem from '@/components/ApartmentListItem';
import { SafeAreaView } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location'; // Import expo-location
import Entypo from '@expo/vector-icons/Entypo';

type Apartment = (typeof apartments)[0];

export default function AirbnbScreen() {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);
  const snapPoints = useMemo(() => [30, '70%'], []);

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
          var map = L.map('map',{zoomControl: false}).setView([${userLocation?.latitude || 37.78825}, ${
            userLocation?.longitude || -122.4324
          }], 13); // Default coordinates
              var zoomControl = L.control.zoom({
            position: 'topleft', 
           
          
          }).addTo(map);

          // Reposition the zoom controls using JavaScript
          var zoomControlContainer = document.querySelector('.leaflet-control-zoom');
          if (zoomControlContainer) {
            zoomControlContainer.style.marginTop = '50px'; // Lower the zoom controls
            zoomControlContainer.style.marginLeft = '10px'; // Lower the zoom controls
          }
        
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }
            ).addTo(map);

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

          // Add markers for apartments
          ${apartments
            .map(
              (apartment) =>
                `L.marker([${apartment.latitude}, ${apartment.longitude}])
                  .addTo(map)
                  .bindPopup("${apartment.title}")
                  .on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify(${JSON.stringify(apartment)}));
                  });`
            )
            .join('\n')}
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
      setWebViewKey((prevKey) => prevKey + 1);
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
          key={webViewKey}
          style={styles.map}
          originWhitelist={['*']}
          source={{ html: getLeafletMapHTML() }}
          onMessage={(event) => {
            try {
              const apartment = JSON.parse(event.nativeEvent.data);
              setSelectedApartment(apartment);
              setUserLocation(null);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {/* Locate Me Button */}
        <TouchableOpacity className='mb-6' style={styles.locateButton} onPress={locateUser}>
          <Entypo name="location" size={28} color="green" />
        </TouchableOpacity>

        {/* Display selected Apartment */}
        {selectedApartment && (
          <ApartmentListItem
            apartment={selectedApartment}
            containerStyle={styles.selectedContainer}
            onClose={() => setSelectedApartment(null)}
          />
        )}

        {/* Bottom Sheet */}
        <BottomSheet index={0} snapPoints={snapPoints}>
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.listTitle}>Over {apartments.length} places</Text>
            <BottomSheetFlatList
              data={apartments}
              contentContainerStyle={{ gap: 10, padding: 10 }}
              renderItem={({ item }) => <ApartmentListItem apartment={item} />}
            />
          </View>
        </BottomSheet>
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
    borderRadius: 10,
    elevation: 5,
    

  },
  locateButtonText: {
    color: '#fff',
    fontWeight: 'bold',

  },
});