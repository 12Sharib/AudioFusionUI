import React, { useState, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,

  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { Buffer } from "buffer";
import CommonButton from "../button/CommonButton";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import * as MediaLibrary from "expo-media-library";

const VideoPlayer = ({ segments }) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const video = useRef(null);
  const [loading, setLoading] = useState(false);
  const [downloadedSegment, setDownloadedSegment] = useState(null);

  const playCurrentSegment = async (index) => {
    try {
      if (!segments || segments.length === 0) {
        console.log("No segments to play.");
        return;
      }

      setPlayingIndex(index);
      setLoading(true);
     
      // Decode base64 to binary using Buffer
      const binaryData = Buffer.from(segments[index], "base64");

      // Create media source
      const mediaSource = {
        uri: `data:video/mp4;base64,${binaryData.toString("base64")}`,
      };

      // Load the video
      await video.current.loadAsync(mediaSource);

      // Play the video
      await video.current.playAsync();
    
    } catch (error) {
      console.error("Error playing segment:", error);
    }finally {
      setLoading(false); // Hide loader when playback finishes (success or error)
    }
  };

  const stopPlayback = async () => {
    
    setPlayingIndex(null);
    try {
      if (video.current) {
        await video.current.stopAsync();

        // Add a check before calling unloadAsync
        if (video.current) {
          await video.current.unloadAsync();
          video.current = null; // Clear the reference after unloading
        }
      }
    } catch (error) {
      console.error("Error stopping playback:", error);
    }
  };

  const downloadSegment = async (index) => {
    try {
      const segmentData = segments[index];
      const fileName = `segment_${index + 1}.mp4`;
  
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
        await Sharing.shareAsync(filePath, { mimeType: 'video/mp4', dialogTitle: 'Share Video' });
      } else {
        Alert.alert("Download Error", "Failed to download segment.");
      }
    } catch (error) {
      console.error("Error sharing video segment:", error);
    }
  };

  return (
    <ScrollView>
    
        <View>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <Video
            ref={video}
            useNativeControls
            style={styles.video}
            resizeMode="contain"
            isLooping={false}
            onPlaybackStatusUpdate={(status) => {
              if (!status.isPlaying && status.didJustFinish) {
                stopPlayback();
              }
            }}
          />
        </View>
     
      {segments.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={styles.segment}
        >
        {downloadedSegment === index + 1 ? (
            <Text>Song {index + 1} - Downloaded Successfully</Text>
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
              onPress={() => {
                if (playingIndex === index) {
                  stopPlayback();
                } else {
                  playCurrentSegment(index);
                }
              }}
            />
            <CommonButton
              title={<AntDesign name="download" size={18} color="black" />}
              onPress={() => downloadSegment(index)}
            />
            <CommonButton
              title={<Entypo name="share" size={18} color="black" />}
              onPress={() => shareSegment(index)}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  video: {
    alignSelf: "center",
    width: 400,
    height: 200,
    borderWidth: 0.5,
    margin: 2,
  },
});

export default VideoPlayer;
