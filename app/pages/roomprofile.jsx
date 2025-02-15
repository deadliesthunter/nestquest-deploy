import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import  useUserProfileStore  from "@/store/userprofilestore";

const ListingScreen = () => {
  const { roomprofile } = useUserProfileStore();

  const [isReserved, setIsReserved] = useState(false);
  const handleReserve = () => {
    setIsReserved(!isReserved);
  };
  const iimage= roomprofile.images && roomprofile.images.length>0 ? roomprofile.images[0] : "https://as2.ftcdn.net/v2/jpg/09/03/07/47/1000_F_903074738_gATnSFaQqGQu7qJSAZhJxtjyud8FJjxn.jpg";
  console.log("Room Profile", roomprofile.images[0].image);
  console.log("Image", iimage);
  return (
    <ScrollView className="bg-slate-400" style={styles.container}>
      {/* Image Section */}
      <Image
        source={{
          uri:iimage.image
        }} // Replace with your image URL
        style={styles.image}
      />

      {/* Title and Location */}
      <View style={styles.section}>
        <Text style={styles.title}>
          {roomprofile.title}
        </Text>
        <Text style={styles.subtitle}>{roomprofile.location}</Text>
        <View style={styles.rating}>
          <FontAwesome name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>4.85 · 154 reviews</Text>
        </View>
      </View>

      {/* Host Info */}
      <View style={styles.section}>

        <Text className='bg-slate-300'  style={styles.hostedBy} >Hosted by {roomprofile.host.firstname} {roomprofile.host.lastname}</Text>
        <Text style={styles.subText}>Superhost · 9 years hosting</Text>
      </View>

      {/* Amenities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What this place offers</Text>
        <View style={styles.amenitiesList}>
          <View style={styles.amenity}>
            <MaterialIcons name="kitchen" size={20} />
            <Text style={styles.amenityText}>Kitchen</Text>
          </View>
          <View style={styles.amenity}>
            <MaterialIcons name="wifi" size={20} />
            <Text style={styles.amenityText}>WiFi</Text>
          </View>
          <View style={styles.amenity}>
            <MaterialIcons name="local-parking" size={20} />
            <Text style={styles.amenityText}>Free parking on premises</Text>
          </View>
          <View style={styles.amenity}>
            <MaterialIcons name="tv" size={20} />
            <Text style={styles.amenityText}>TV with cable</Text>
          </View>
        </View>
      </View>

      {/* Reserve Button */}
      <View style={styles.reserveContainer}>
        <Text style={styles.price}>$98 / night</Text>
        <TouchableOpacity
          style={isReserved ? styles.reservedButton : styles.reserveButton}
          onPress={handleReserve}
        >
          {isReserved ? (
            <Text style={styles.reserveButtonText}>Cancel</Text>
          ) : (
            <Text style={styles.reserveButtonText}>Reserve</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  hostedBy: {
    fontSize: 18,
    fontWeight: "600",
  },
  subText: {
    color: "#777",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: "column",
  },
  amenity: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 16,
  },
  reserveContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reservedButton: {
    backgroundColor: "#ff5a5f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  reserveButton: {
    backgroundColor: "#7ce87c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  reserveButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListingScreen;
