import React from "react";
import { View, Text, Image } from "react-native";








export default function ReviewLayout({data}){

    return (
        <View className="bg-white p-3 rounded-lg mb-0 border-2 border-slate-300 "  style={{ width: 250, }}>
        <Text className="text-20 font-medium text-gray-800 text-left ">{data.review}</Text>
        <Text className="text-gray-600 mt-0 mb-0 ">{data.name}</Text>
        <View className="flex-1 justify-end">
        <View className="flex-row items-center mt-4">
          <Image
            source={{ uri: data.image || "https://example.com/default-profile.jpg" }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-sm font-medium text-gray-800">{data.name}</Text>
            <Text className="text-xs text-gray-500">{data.date}</Text>
          </View>
        </View>
        </View>
      </View>
    );
  }