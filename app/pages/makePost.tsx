import React, { useContext, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { AuthContext } from "@/store/authStore";

import FontAwesome from '@expo/vector-icons/FontAwesome';

import * as ImagePicker from "expo-image-picker";

export default function MakePost() {

  const { user ,token} = useContext(AuthContext);

  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [hostFirstname, setHostFirstname] = useState('');
  const [hostLastname, setHostLastname] = useState('');
  const [facilities, setFacilities] = useState('');

  const uploadData = async () => {
    const data = {
      title: title,
      description: description,
      location: location,
      price: price,
      
      host_firstname: user.firstname,
      host_lastname: user.lastname,
      facilities: facilities,
      is_available: true,
      images: image ? [image] : [],
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/properties/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, // Ensure "Token" prefix
        },
        body: JSON.stringify(data),
        
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Data uploaded successfully!');
        console.log(result);
      } else {
        throw new Error('Failed to upload data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload data.');
      console.error(error);
    }
  };

  


  return (
    <ScrollView className="flex-1 p-4 bg-gray-100 mb-3">
      <View className="p-4 bg-white rounded-lg shadow">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Post's details
        </Text>

        {/* image pick */}
        <View className=" bg-white rounded-2xl p-4 pt-0" >
        <TouchableOpacity onPress={pickImage}>
          {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
         
          {image ? (
            <Image source={{ uri:image }} style={styles.image} className="rounded-2xl"/>
          ) : (
            <Image
              source={require("@/assets/images/imagereplace.png")}
              className= "rounded-2xl bg-slate-200 " style={styles.image}
            />
          )}
        </TouchableOpacity>
        </View>

        {/* Title */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold">Title</Text>
          <TextInput
            className="mt-2 p-3 border border-gray-300 rounded-lg"
            placeholder="Enter title (e.g., Bootleg Portal Chemist Rick)"
            value={title}
            onChangeText={setTitle} 
          />
        </View>

        {/* Distance */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold">Location</Text>
          <TextInput
            className="mt-2 p-3 border border-gray-300 rounded-lg"
            placeholder="Enter distance (e.g., 2.7 km)"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Date Range */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold">Description</Text>
          <TextInput
            className="mt-2 p-3 border border-gray-300 rounded-lg"
            placeholder="Enter date range (e.g., April 3 - 9)"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        {/* faciitiees */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold">Facilities</Text>
          <TextInput
            className="mt-2 p-3 border border-gray-300 rounded-lg"
            placeholder="Enter date range (e.g., April 3 - 9)"
            value={facilities}
            onChangeText={setFacilities}
          />
        </View>

        {/* Price */}
        <View className="mb-4">
          <Text className="text-gray-700 font-semibold">Price</Text>
          <TextInput
            className="mt-2 p-3 border border-gray-300 rounded-lg"
            placeholder="Enter price (e.g., Rs.1100)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-blue-600 p-3 rounded-lg"
          onPress={uploadData}
        >
          <Text className="text-center text-white font-bold">Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  image: {
   aspectRatio:1/1,
   width: 300,
   height: 300,
   
  },
});
