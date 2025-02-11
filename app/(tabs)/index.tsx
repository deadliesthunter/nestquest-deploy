import { Text, View, FlatList, StyleSheet,useWindowDimensions, ActivityIndicator, } from "react-native";
import { Link } from "expo-router";
import Header from "@/components/Header";
import RoomCard from "@/components/RoomCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { SafeAreaView } from "react-native-safe-area-context";
import appartments from '@/assets/data/appartments.json';
import { ThemeContext } from '@/components/theme/ThemContext';


import { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';

const initialPage = 'http://127.0.0.1:8000/api/properties/feed/';

export default function Index() {

  const { colors } = useContext(ThemeContext);
  
  //const days = [...Array(24)].map((value, index) => index + 1)
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [nextPage, setNextPage] = useState('');

  const { width } = useWindowDimensions();

  const fetchPage = async (url: string) => {
    if (loading) {
      return;
    }

    setLoading(true);
    const response = await fetch(url);
    const responseJson = await response.json();
     setItems(responseJson);
  }

   /*  setItems((existingItems) => {
      const newItems = responseJson.results.filter(newItem => 
        !existingItems.some(existingItem => existingItem.id === newItem.id)
      );
      return [...existingItems, ...newItems];
    });
    


    setNextPage(responseJson.info.next);
    setLoading(false);
  };

  const onRefresh = () => {
    if (loading) {
      return;
    }
    setItems([]);
    
    fetchPage(initialPage);
  };

  useEffect(() => {
    fetchPage(initialPage);
  }, []); */

  useEffect(() => {
    fetchPage(initialPage);
  }, []); 

  const renderItem = useCallback(
    ({ item }) => <RoomCard character={item} />,
    []
  );
  return (
    <SafeAreaView style={{ backgroundColor: colors.background, }} className="pb-10">
     <View  className="pb-20 mb-10">
      <Header></Header>
      <SearchBar></SearchBar> 
       <FlatList
        contentContainerStyle={styles.content}
        data={items}
        renderItem={renderItem}
      onEndReached={() => fetchPage(nextPage)}
      onEndReachedThreshold={5}
      ListFooterComponent={() => loading && <ActivityIndicator />}
      refreshing={loading}
      //onRefresh={onRefresh}
     
      initialNumToRender={3}
      /> 
    </View> 
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
    gap: 2,

  },

  content: {
    gap: 1,

  },

  column: {
    gap: 10,
  },


});
