import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "@/store/authStore";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ReviewLayout from "@/components/layouts/reviewLayout"
import PostLayout from "@/components/layouts/postLayout";
import reviews from "@/assets/data/reviews.json";
import appartments from "@/assets/data/appartments.json";

import RoomCard from "@/components/RoomCard";
import characters  from "@/assets/data/characters.json";
import Button1 from "@/components/Button1";

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4  pb-4 mb-2 ">
      {/* Header Navigation */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }}>
              <Link href="/pages/setting">
                <Ionicons name="settings-outline" size={25} color="black" />
              </Link>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Profile Section */}
      <View className=" rounded-2xl bg-white p-6 mb-6 shadow-white flex-row items-center justify-between">
        {/* Profile Picture */}
        <View className="items-center mr-4">
          <View className="w-32 h-32 bg-green-200 rounded-full justify-center items-center overflow-hidden">
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-gray-400 font-semibold">No Image</Text>
            )}
          </View>
          <TouchableOpacity
            className="px-1 py-2 rounded-full shadow mt-2"
            onPress={pickImage}
          >
            <Text className="text-slate-600 font-medium">Change Profile</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View>
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {user.firstname} {user.lastname}
          </Text>
          <Text className="text-gray-600">Owner</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-evenly rounded-2xl bg-white p-6 mb-6">
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-800">600</Text>
          <Text className="text-gray-600">Reviews</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-800">4.5</Text>
          <Text className="text-gray-600">Rating</Text>
        </View>
      </View>

      {/* Bio Section */}
      <View className="mb-6">
        <Text className="text-gray-800 text-center">Speaks Nepali and English</Text>
        <Text className="text-gray-800 text-center">Lives in Pokhara, Nepal</Text>
        <Text className="text-gray-600 mt-4 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed justo at orci
          hendrerit posuere.
        </Text>
      </View>

      {/* Reviews Section */}
      <Text className="text-lg font-bold text-gray-800 mb-2">Reviews</Text>
      <GestureHandlerRootView>
        <FlatList
          data={reviews}
          horizontal
          //keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <ReviewLayout data={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 7,
            gap:6
          }}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </GestureHandlerRootView>

      {/* Posts Section */}
      <Text className="text-lg font-bold text-gray-800 mt-8 mb-4">{user.firstname}'s Posts</Text>
      <GestureHandlerRootView className="flex-1  p-0 mb-3 " >
        <FlatList
        contentContainerClassName="w-200"
          data={appartments}
          horizontal
          //keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <PostLayout data={item}  />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 0,
            gap:0
          }}
          
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </GestureHandlerRootView>

    {/*   <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <View
              key={i}
              className="w-48 h-40 bg-gray-400 m-0.5 rounded-lg"
            ></View>
          ))}
        </View>
      </ScrollView> */}


  <TouchableOpacity className="w-full" >
  <Link href="/pages/makePost" className="w-full">
      <View className="bg-sky-200 px-4 py-3 rounded-lg flex items-center justify-center">
        <Text className="text-center font-semibold">add post</Text>
      </View>
      </Link>
  </TouchableOpacity>
  



    </ScrollView>
  );
}
