import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, ScrollView } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";
import CommonButton from "./button/CommonButton";
import { AntDesign } from "@expo/vector-icons";

const FetchDeviceSong = () => {
  const [songs, setSongs] = useState([]);
  const [soundObject, setSoundObject] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const media = await MediaLibrary.getAssetsAsync({ mediaType: "audio" });
        setSongs(media.assets);
      }
    })();
  }, []);

  const playSong = async (uri) => {
    // Stop all previous songs
    stopPlayback();

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSoundObject(sound);
    setCurrentlyPlaying(uri);
  };

  const stopPlayback = async () => {
    setCurrentlyPlaying(null);
    try {
      if (soundObject) {
        await soundObject.stopAsync(); // Stop the sound playback
        await soundObject.unloadAsync(); // Unload the sound object
        setSoundObject(null);
      }
    } catch (error) {
      console.error("Error stopping playback:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View  style={styles.segment}>
      <Text>{item.filename}</Text>
      <CommonButton
        title={
          currentlyPlaying === item.uri ? (
            <AntDesign name="pause" size={18} color="black" />
          ) : (
            <AntDesign name="play" size={18} color="black" />
          )
        }
        onPress={
          currentlyPlaying === item.uri
            ? stopPlayback
            : () => playSong(item.uri)
        }
      />
    </View>
  );

  return (
    <FlatList
      data={songs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text>No songs found</Text>}
    />
  );
};
const styles = StyleSheet.create({
  audioItem: {
    borderWidth: 1,
    margin: 3,
    padding: 2,
  },
  segment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
export default FetchDeviceSong;
