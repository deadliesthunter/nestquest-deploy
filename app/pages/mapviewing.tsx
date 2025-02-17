import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React, { useMemo, useState, useEffect } from 'react';
import { router, Stack } from 'expo-router';
import apartments from '@/assets/data/appartments.json';
import ApartmentListItem from '@/components/ApartmentListItem';
import { SafeAreaView } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location'; // Import expo-location
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

type Apartment = (typeof apartments)[0];

export default function AirbnbScreen() {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null); // State for draggable marker position
  const snapPoints = useMemo(() => [65, '70%'], []);
  const [webviewkey, setwebviewkey]= useState(0);

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

        

          // Add draggable marker
          var draggableMarker = L.marker([${markerPosition?.latitude || 37.78825}, ${
            markerPosition?.longitude || -122.4324
          }], { draggable: true }).addTo(map);
          draggableMarker.bindPopup("Drag me!").openPopup();

          // Listen for dragend event to capture new coordinates
          draggableMarker.on('dragend', function(event) {
            var marker = event.target;
            var position = marker.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerMoved', position }));
          });
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
      setwebviewkey((prevKey) => prevKey + 1);
      // Update user location state
      setUserLocation({ latitude, longitude });

      // Optionally, re-render the map with the new location
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
          key={webviewkey}
          originWhitelist={['*']}
          source={{ html: getLeafletMapHTML() }}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);

              // Handle marker drag events
              if (data.type === 'markerMoved') {
                const { position } = data;
                setMarkerPosition(position); // Update marker position state
                console.log('New Marker Position:', position); // Log the new coordinates
              } 
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        {/* Locate Me Button */}
        <TouchableOpacity className='m-5 mb-10' style={styles.locateButton} onPress={locateUser}>
         <Entypo name="location" size={28} color="#ff395c" />
        </TouchableOpacity>

       
            <TouchableOpacity 
              onPress={() => router.back()}
              className="absolute bottom-10 right-52 p-2 rounded-full shadow-md"
            >
              <AntDesign name="checkcircleo" size={44} color="green" />
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
    paddingTop: 20,
  },
  locateButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
   // backgroundColor: '#FF',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  locateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});