import React from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Touchable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={25} color="#000" style={styles.icon} />
        
        <TextInput
          style={styles.input}
          editable={true} // Prevent typing if it's static
          placeholder="your destination"
        />
      </View>
      
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name="options-outline" size={18} color="#000" />
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
     paddingHorizontal: 10,
    paddingVertical: 7, 
  },
  icon: {
    marginRight: 1,
    //flex:1,
  },
  input: {
    //fontSize: 16,
    fontWeight: 500,
    //color: "#000",
    flex: 1,
    height:23,
    alignContent:'flex-start'
    ,//backgroundColor:'red',
    marginLeft:10
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 10,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
