import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
//import { AuthContext } from "@/store/authStore";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ReviewLayout from "@/components/layouts/reviewLayout"
import PostLayout from "@/components/layouts/postLayout";
import reviews from "@/assets/data/reviews.json";
import appartments from "@/assets/data/appartments.json";
import useUserProfileStore from "@/store/userprofilestore";
import useAuthStore from "@/store/authStore";




export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { user, logout,token } = useAuthStore();

  const {posts ,fetchUser,roomprofile}=useUserProfileStore();
  
   useEffect(()=>{
    fetchUser();
    },[]);
    
  //console.log("this is from zustand profilee",roomprofile) 
  //console.log("this is from zustand profilee posts fetch",posts) 

  const [name, setName] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [description, setDescription] = useState('');

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
  
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('firstname', name);
      formData.append('lastname', lastname);
      formData.append('description', description);
      
      // Append image if exists
      if (image) {
        const imageUri = image;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        
        formData.append('thumbnail', {
          uri: imageUri,
          name: filename,
          type: "image/jpeg",
        } as any);
      }

      const response = await fetch('http://127.0.0.1:8000/api/user/detail/', {
        method: 'post',
        headers: {
          'Content-Type': "multipart/form-data",
          'Authorization': `Token ${token}`,
          
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
      
      // Close modal and optionally refresh user data
      setModalVisible(false);
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user
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
      <View className=" rounded-2xl bg-white p-6 mb-6 shadow-white">
        <View className="flex-row justify-between">
          {/* Profile Picture */}
          <View className="items-center">
            <View className="w-32 h-32 bg-green-200 rounded-full justify-center items-center overflow-hidden">
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Text className="text-gray-400 font-semibold">No Image</Text>
              )}
            </View>
          </View>

          {/* User Info - Pushed to extreme right */}
          <View className="justify-center items-end pr-4">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {user.firstname} {user.lastname}
            </Text>
            <Text className="text-gray-600 text-base">Owner</Text>
          </View>
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          className="bg-slate-100 px-4 py-3 rounded-xl  mt-9 w-full "
          onPress={() => setModalVisible(true)}
        >
          <Text className=" font-medium text-center">Update Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-[90%] max-h-[90%]">
            {/* Header */}
            <View className="items-center border-b border-gray-200 pb-4 mb-4">
              <Text className="text-xl font-bold text-gray-800">Update Profile</Text>
            </View>
            
            {/* Profile Picture Section */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-3 shadow-sm">
                {image ? (
                  <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="w-full h-full justify-center items-center">
                    <Ionicons name="person-outline" size={40} color="#9ca3af" />
                  </View>
                )}
              </View>
              <TouchableOpacity
                className="bg-sky-100 px-6 py-2 rounded-full shadow-sm"
                onPress={pickImage}
              >
                <Text className="text-sky-700 font-semibold">Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <ScrollView className="space-y-4" showsVerticalScrollIndicator={false}>
              <View>
                <Text className="text-gray-700 font-medium mb-2">Name</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Last Name</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                  value={lastname}
                  onChangeText={setLastname}
                  placeholder="Enter your last name"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Description</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row space-x-4 mt-6 pt-4 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 bg-gray-100 p-3 rounded-xl"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-center font-semibold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-sky-500 p-3 rounded-xl"
                onPress={handleUpdateProfile}
              >
                <Text className="text-center font-semibold text-white">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
          data={posts.properties}
          horizontal
          keyExtractor={(id, index) => index.toString()}
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
