import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const categories = ['single', 'Double', 'Trible','Flat'];

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category

  const handlePress = (category) => {
    setSelectedCategory(category); // Update the selected category
  };

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(category)} // Pass the category to the handler
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedButton, // Apply selected style if category matches
          ]}
        >
          <Text style={styles.text}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EFF8FF', // Default yellow color
  },
  selectedButton: {
    backgroundColor: '#f59e0b', // Darker yellow for the selected category
  },
  text: {
    color: '#4b5563', // Gray text
    fontWeight: '500',
  },
});
