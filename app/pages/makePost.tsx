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
  FlatList,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import useAuthStore from "@/store/authStore";
import {
  Config,
  openPicker,
} from "@baronha/react-native-multiple-image-picker";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function MakePost() {
  const { user, isAuthenticated, logout, token } = useAuthStore();

  const [image, setImage] = useState<string | null>(null);
  const [imageView, setImageView] = useState<string | null>(null);

  const config: Config = {
    maxSelect: 10,
    maxVideo: 10,
    primaryColor: "#FB9300",
    backgroundDark: "#2f2f2f",
    numberOfColumn: 4,
    mediaType: "all",
    selectBoxStyle: "number",
    selectMode: "multiple",
    language: "system",
    theme: "dark",
    isHiddenOriginalButton: false,
  };

  const onPicker = async () => {
    try {
      const response = await openPicker(config);
      setImageView(response);
      console.log("this is selected images", response);
    } catch (e) {
      // catch error for multiple image picker
      console.log(e);
    }
  };

  /*   const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const { uri } = result.assets[0]; 
      setImageView(uri); 
  
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        console.log('File info:', fileInfo);
  
        const fileName = uri.split('/').pop(); 
        const fileExtension = fileName?.split('.').pop(); 
        const mimeType = `image/${fileExtension}`;
  
        const blob = await (await fetch(uri)).blob(); // Fetching as blob
  
        setImage({
          uri: uri,
          name: fileName || "upload.jpg",
          type: mimeType,
        }); // Set image properly
      }
    }
  }; */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [hostFirstname, setHostFirstname] = useState("");
  const [hostLastname, setHostLastname] = useState("");
  const [facilities, setFacilities] = useState("");

  const uploadData = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("facilities", facilities);
    formData.append("is_available", "true");

    if (image) {
      formData.append("images", image); // Ensure correct format
    }
    if (user?.id) {
      // Ensure user.id exists
      formData.append("host_id", user.id.toString()); // Convert to string if needed
      console.log(user.id);
    } else {
      Alert.alert("Error", "Host ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/properties/create/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Success", "Data uploaded successfully!");
        console.log(result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload data");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to upload data.");
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
        <View className=" bg-slate-300 rounded-2xl p-0 pt-0" style={styles.imagescontainer}>
          {!imageView?
        <TouchableOpacity onPress={ onPicker}>
            {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}

          
              <Image
                source={require("@/assets/images/imagereplace.png")}
                className="rounded-2xl bg-slate-200 "
                style={styles.image}
              />
  
          </TouchableOpacity>
          :    <FlatList 
          
          data={imageView}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
        scrollEnabled
        
          renderItem={({ item }) => (
            <View className="pl-1">
              <Image
              className="rounded-2xl bg-slate-200"
                source={{ uri: item.path }} // Ensure 'path' is the correct property
                style={{ width: 105, height: 105, margin: 3 }}
              />
            </View>
          )}
        />}
        <View className="absolute bottom-0 right-0 pb-1 pr-1">
          <TouchableOpacity onPress={onPicker}>
        <AntDesign name="plussquareo" size={70} color="gray" />
        </TouchableOpacity>
        </View>
      
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
    aspectRatio: 1 / 1,
    width: 300,
    height: 300,
  },
  imagescontainer: {
    flex: 1,

    height: 300,
    width: 350,
    position: "relative",
  }
  ,
});
