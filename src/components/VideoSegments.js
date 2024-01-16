import React from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import VideoPlayer from "./nested-components/VideoPlayer";
import FileUploader from "./nested-components/FileUploader";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

const VideoSegments = ({ pickLabel, uploadLabel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      });
      setSelectedFile(res);
    } catch (err) {
      console.log("Error while picking the file", err);
    }
  };

  const uploadFile = async () => {
    console.log("Upload File");
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.assets[0].uri,
        name: selectedFile.assets[0].name,
        type: selectedFile.assets[0].mimeType,
      });

      const response = await axios.post(
        "http://192.168.180.174:8082/api/songs/divide/video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const segmentsData = response.data; // Assuming the response contains the segments data
      setSegments(segmentsData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading file:", error);
    }
  };

  return (
    <ScrollView>
      <FileUploader
        selectedFile={selectedFile}
        handleFilePick={handleFilePick}
        uploadFile={uploadFile}
        loading={loading}
        pickLabel={pickLabel}
        uploadLabel={uploadLabel}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <VideoPlayer segments={segments} />
      )}
    </ScrollView>
  );
};
export default VideoSegments;
