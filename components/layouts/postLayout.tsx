import { Link } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import { Icon } from "react-native-paper";








export default function PostLayout({data}){
    return (
      
        <View className="bg-white rounded-xl mx-2 my-0 overflow-hidden shadow-lg">
          <Link href={"/pages/roomprofile"}>
          <Image
            source={{ uri: data.image || "https://example.com/default-profile.jpg" }}
            className="w-full h-64"
            resizeMode="cover"
          />
            </Link>
          <View className="p-4">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-lg font-semibold text-black">
                  Bed and breakfast
                </Text>
                <Text className="text-gray-500 mt-1">
                  Rana's Guest House - 1st floor-...
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