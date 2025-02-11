import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Character } from "@/assets/types";
import { ThemeContext } from "@/components/theme/ThemContext";
import { useContext } from "react";

type DayListItem = {
  day: number;
};
type CharacterListItem = {
  character: Character;
};
const RoomCard = ({ character }: CharacterListItem) => {
  const firstImage = character.images && character.images.length > 0
  ? character.images[0]
  : "https://via.placeholder.com/300"; // Fallback image URL


  const { colors } = useContext(ThemeContext);
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <SafeAreaView className="pb-10">
      <View style={{ backgroundColor: colors.background }}>
        <Link href={`/pages/roomprofile`} asChild>
          <Pressable
            style={styles.box}
            className="pt-2 pb-0 pl-4 pr-4 border-2 border-slate-200 rounded-2xl">

              <View className="relative"> 
            <Image
              source={{ uri: firstImage.image }}
              style={styles.image}
              className="border-gray-200 rounded-3xl"
            />
              {/* bookmark icon */}
        <TouchableOpacity className="absolute top-2 right-2  p-1  rounded-full shadow-sm" onPress={() => setIsFavorite(!isFavorite)} >
          <Ionicons 
          name={isFavorite ? 'bookmark' : 'bookmark-outline'}
           size={26} color={isFavorite ? '#ff395c' : 'white'}  />
        </TouchableOpacity>

            </View>
            <View style={styles.details}>
              <View style={styles.footer}>
                <Text style={styles.name}>{character.title}</Text>
                <Text style={styles.rating} className="text-black text-base">
                  ★ 4.0
                </Text>
              </View>

              <Text style={styles.distance}>2.7 kilometer close</Text>
              <Text style={styles.date}>April 3 - 9 </Text>
              <Text className="text-lg">Rs.1100</Text>
            </View>

            {/* <Link href={'/day/day1'}>to user</Link> */}
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    margin: 2,
    overflow: "hidden",
    shadowColor: "#f0f0f0",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  details: {
    padding: 15,
  },
  text: {
    color: "#9b4521",
    fontSize: 70,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: "#555",
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },

  image: {
    width: "100%", // Full width
    //height: 450,         // Fixed height
    aspectRatio: 1 / 1, // Maintain aspect ratio (16:9)
    resizeMode: "cover",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
});
