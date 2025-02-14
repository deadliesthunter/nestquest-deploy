import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";

import useUserProfileStore from "@/store/userprofilestore";







export default function PostLayout({data}){
  const {room,setRoom} = useState({});
  const{fetchRoom} = useUserProfileStore();
    const firstImage = data.images && data.images.length > 0
    ? data.images[0]
    : "https://via.placeholder.com/300"; // Fallback image URL

    return (
        <View className="bg-white rounded-xl mx-1.5 my-0 overflow-hidden shadow-lg w-64 ">
          <Pressable onPress={() => fetchRoom(data)}>
          <Link href={"/pages/roomprofile"}>
        
          <Image
            source={{ uri: firstImage.image || "https://example.com/default-profile.jpg" }}
            className="w-full h-64"
            resizeMode="cover"
          />
        
            </Link>
            </Pressable>
          <View className="p-4">
            <View className="flex-row justify-between items-start">
              <View>
                 {/* post tittl */}
                <Text className="text-lg font-semibold text-black">
                  {data.title}
                </Text>
                {/* post description */}
                <Text className="text-gray-500 mt-1">
                  {data.description}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="size-100">★</Text>
                <Text className="ml-1 font-semibold text-black">5.0</Text>
              </View>
            </View>
          </View>
        
        </View>

       
      );
    };
    


/* 
    return (
        <View className="bg-green-100 p-3 rounded-lg mb-0  "  style={{ width: 300, }}>
        <View className="">
        <View className="flex-col items-center mt-4">
          <Image
            source={{ uri: data.image || "https://example.com/default-profile.jpg" }}
            className="w-60 h-60 rounded-md"
          />
          <View className="ml-0 mt-2 bg-blue-200">
            <Text className="text-sm font-medium text-gray-800 ">{data.name}</Text>
            <Text className="text-xs text-gray-500 ">{data.date}</Text>
          </View>
        </View>
        </View>
      </View>
    );
  } */