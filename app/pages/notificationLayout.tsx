import React, { useState } from 'react';
import { View,Text, Image, FlatList, Button, Alert, Platform } from 'react-native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { openPicker, Config } from '@baronha/react-native-multiple-image-picker'
import MapViewing from './mapviewing';

const ImagePickerScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [images, setImages] = useState([]);


const config: Config = {
  maxSelect: 10,
  maxVideo: 10,
  primaryColor: '#FB9300',
  backgroundDark: '#2f2f2f',
  numberOfColumn: 4,
  mediaType: 'all',
  selectBoxStyle: 'number',
  selectMode: 'multiple',
  language: 'system', 
  theme: 'dark',
  isHiddenOriginalButton: false,
}

const onPicker = async () => {
  try {
    const response = await openPicker(config)
    setImages(response)
    console.log("this is selected images",response)
  } catch (e) {
    // catch error for multip
    // le image picker
    console.log(e)
  }
}



  return (

    <MapViewing onLocationSelect={() => {}} />
  );
};

export default ImagePickerScreen;
    {/* <View style={{ flex: 1, padding: 20 }}>
      <Button color={'blue'} title="Pick Images" onPress={onPicker} />
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <View>
          <Image 
            source={{ uri: item.path }} // Ensure 'path' is the correct property
            style={{ width: 100, height: 100, margin: 5 }} 

          />
          <Text>{item.path}</Text>
          </View>
        )}
      />
    </View> */}