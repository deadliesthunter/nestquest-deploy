import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet,Button } from "react-native";
import notificationLayout from '@/app/pages/notificationLayout';
import { Link } from "expo-router";


export default function Profile() {
  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL

  // Function to fetch data
  const getMoviesFromApiAsync = async () => {
    try {
      const response = await fetch('https://rickandmortyapi.com/api/character/2');
      const result = await response.json();
      setImageUrl(result.image); // Set the image URL in state
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    getMoviesFromApiAsync();
  }, []);

  return (
    <View style={styles.container}>
      {/* Check if imageUrl is available before rendering */}
     
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text>Loading...</Text> // Placeholder while loading the image
      )}
      <Text>This is notifications</Text>
      <Link href={'/pages/notificationLayout'}>
     <Text>kdjgkj</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Optional background color
  },
  image: {
    width: 300,       // Fixed width
    height: 300,      // Fixed height
    borderRadius: 10, // Optional: Rounded corners
    resizeMode: "cover",
  },
});
