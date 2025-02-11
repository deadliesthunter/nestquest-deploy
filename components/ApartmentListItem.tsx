import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import React from 'react';
import apartments from '@/assets/data/appartments.json';
import { Button } from 'react-native-paper';
import { Pressable } from 'react-native-gesture-handler';

type ApartmentListItem = {
  apartment: (typeof apartments)[0];
  containerStyle?: ViewStyle;
  onClose?: () => void; // Add an optional onClose prop
};

const ApartmentListItem = ({
  apartment,
  containerStyle,
  onClose,
}: ApartmentListItem) => {
  return (
    <View style={[styles.card, containerStyle]}>
     <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <Image source={{ uri: apartment.image }} style={styles.image} />
      {/* */}
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{apartment.title}</Text>
        <Text style={styles.description}>
          Stay at this apartment for an affordable price
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>$ {apartment.price} night</Text>
          <Text style={styles.price}>
            ★ {apartment.rating} ({apartment.numberOfStars})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',

    flexDirection: 'row',
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  image: {
    width: 150,
    aspectRatio: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rightContainer: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontFamily: 'InterBold',
    marginBottom: 10,
    fontSize: 16,
  },
  description: {
    color: 'gray',
  },
  price: {
    fontFamily: 'InterBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  closeButton:{
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#9c617e',
    borderRadius: 15,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,

  },
  closeButtonText:{
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  }

 
});

export default ApartmentListItem;
