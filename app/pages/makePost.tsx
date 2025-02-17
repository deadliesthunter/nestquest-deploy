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
import MapViewing from "./mapviewing";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import useAuthStore from "@/store/authStore";
import {
  Config,
  openPicker,
} from "@baronha/react-native-multiple-image-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useRouter } from 'expo-router';
export default function MakePost() {
  const { user, isAuthenticated, logout, token } = useAuthStore();

  const [image, setImage] = useState<Array<{ uri: string; name: string; type: string }> | null>(null);
  const [imageView, setImageView] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

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
      processAllFiles();
     
    } catch (e) {
      // catch error for multiple image picker
      console.log(e);
    }
  };

  
  const processFile = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
  
      if (fileInfo.exists) {
        console.log('File info:', fileInfo);
        const fileName = uri.split('/').pop(); 
        const fileExtension = fileName?.split('.').pop(); 
        const mimeType = `image/${fileExtension}`;
  
        const blob = await (await fetch(uri)).blob(); 
        return {
          uri: uri,
          name: fileName || "upload.jpg",
          type: mimeType,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error processing file:", error);
      return null;
    }
  };
  
  
  const processAllFiles = async () => {
  
    const filesArray = await Promise.all(imageView.map(item => processFile(item.path)));
  
    const validFiles = filesArray.filter(file => file !== null);
  setImage(validFiles);
    console.log("the formated omages",image);
    return validFiles;
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
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

    if (image && image.length > 0) {
        image.forEach((file: { uri: string; name: string; type: string }, _index: number) => {
          formData.append("images", {
            uri: file.uri,
            name: file.name,
            type: file.type,
          } as any);
        });
      }
    if (user?.id) {
      // Ensure user.id exists
      formData.append("host_id", user.id.toString()); // Convert to string if needed
     
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Image Section */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Property Images
          </Text>
          
          <View className="rounded-xl overflow-hidden h-[200px]">
            {!imageView ? (
              <TouchableOpacity 
                onPress={onPicker}
                className="w-full h-full bg-gray-100 items-center justify-center"
              >
                <AntDesign name="camerao" size={40} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">Add photos of your property</Text>
                <Text className="text-gray-400 text-sm">Up to 10 photos</Text>
              </TouchableOpacity>
            ) : (
              <View className="relative h-full">
                <GestureHandlerRootView className="h-full">
                  <FlatList
                    data={imageView}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View className="mr-2">
                        <Image
                          source={{ uri: item.path }}
                          className="w-[180px] h-full rounded-lg"
                          resizeMode="cover"
                        />
                      </View>
                    )}
                  />
                </GestureHandlerRootView>
                <TouchableOpacity 
                  onPress={onPicker}
                  className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full shadow"
                >
                  <AntDesign name="plus" size={24} color="#0EA5E9" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Property Details Form */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Property Details
          </Text>

          <View className="space-y-4">
            {/* Title Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-1">Title</Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                placeholder="Enter property title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Location Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-1">Location</Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                placeholder="Enter property location"
                value={location}
                onChangeText={setLocation}
              />
            </View>
             {/* GEO-Location Input */}
             
        <View>
          <TouchableOpacity onPress={() => router.push('/pages/mapviewing')}>
            <Text className="text-gray-700 font-medium mb-1">GEO-Location</Text>
            <View className="border border-gray-200 rounded-xl p-3.5 bg-gray-50 flex-row items-center justify-between">
              <TextInput
                className="flex-1"
                placeholder="Select location from map"
                value={geoLocation}
                editable={false}
              />
              <AntDesign name="enviromento" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

            {/* Description Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-1">Description</Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                placeholder="Describe your property"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Facilities Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-1">Facilities</Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3.5 bg-gray-50"
                placeholder="List available facilities"
                value={facilities}
                onChangeText={setFacilities}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Price Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-1">Price</Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-200 rounded-xl p-3.5 bg-gray-50 pl-8"
                  placeholder="Enter price"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                <Text className="absolute left-3 top-3.5 text-gray-500">₹</Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-sky-500 mt-6 p-4 rounded-xl shadow-sm active:bg-sky-600"
            onPress={uploadData}
          >
            <Text className="text-center text-white font-semibold text-base">
              Post Property
            </Text>
          </TouchableOpacity>
        </View>

       
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
    width: 200,
    height: 200,
  },
  imagescontainer: {
    flex: 1,
    alignContent:'center',
    height: 200,
    width: 352,
    position: "relative",
  }
  ,
});
