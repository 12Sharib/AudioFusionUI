import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import CommonButton from "../button/CommonButton";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Alert } from 'react-native';

const SongPlayer = ({ segments }) => {
  const [soundObject, setSoundObject] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [downloadedSegment, setDownloadedSegment] = useState(null);

  const playSegment = async (index) => {
    try {
      if (!segments || segments.length === 0) {
        console.log("No segments to play.");
        return;
      }

      stopPlayback(); // Stop previous playback before starting a new segment

      setPlayingIndex(index);
      const segment = segments[index];
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${segment}` },
        { shouldPlay: true }
      );

      setSoundObject(sound);
    } catch (error) {
      console.error("Error playing segment:", error);
    }
  };

  const stopPlayback = async () => {
    setPlayingIndex(null);
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

  const downloadSegment = async (index) => {
    try {
      const segmentData = segments[index];
      const fileName = `segment_${index + 1}.mp3`;
  
      const localUri = FileSystem.documentDirectory + fileName;
  
      await FileSystem.writeAsStringAsync(localUri, segmentData, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      await MediaLibrary.createAssetAsync(localUri);
  
      // Once the download is finished, update the state variable
      setDownloadedSegment(index + 1);
  
      console.log(`Segment ${index + 1} downloaded.`);
  
      // Return the localUri
      return localUri;
    } catch (error) {
      console.error("Error downloading segment:", error);
      return null; // Return null in case of an error
    }
  };
  
  const shareSegment = async (index) => {
    try {
      const filePath = await downloadSegment(index);
  
      if (filePath) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert("Download Error", "Failed to download segment.");
      }
    } catch (error) {
      console.error("Error sharing segment:", error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {segments.map((_, index) => (
        <View key={index} style={styles.segment}>
          {downloadInProgress && downloadedSegment === index + 1 && (
            <Text>Downloading...</Text>
          )}

          {!downloadInProgress && downloadedSegment === index + 1 ? (
            <Text>Song {index + 1} - Downloaded</Text>
          ) : (
            <Text>{`Segment ${index + 1}`}</Text>
          )}

          <View style={{ flexDirection: "row" }}>
            <CommonButton
              title={
                playingIndex === index ? (
                  <AntDesign name="pause" size={18} color="black" />
                ) : (
                  <AntDesign name="play" size={18} color="black" />
                )
              }
              onPress={
                playingIndex === index ? stopPlayback : () => playSegment(index)
              }
            />
            <CommonButton
              title={<AntDesign name="download" size={18} color="black" />}
              onPress={() => downloadSegment(index)} // Trigger download on button press
            />
            <CommonButton
              title={<Entypo name="share" size={18} color="black" />}
              onPress={() => shareSegment(index)}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 4,
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

export default SongPlayer;
