import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import FileUploader from "./nested-components/FileUploader";
import { View, ActivityIndicator } from "react-native";
import SongPlayer from "./nested-components/SongPlayer";

const Mp3Segments = ({pickLabel, uploadLabel}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilePick = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });
      //   console.log(res);
      setSelectedFile(res);
    } catch (err) {
      console.log("Error while picking the file", err);
    }
  };

  const uploadFile = async () => {
    console.log("Upload File");
    if (!selectedFile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.assets[0].uri,
        name: selectedFile.assets[0].name,
        type: selectedFile.assets[0].mimeType,
      });
      const response = await axios.post(
        "http://192.168.180.174:8082/api/songs/divide",
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
    <View>
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
        <SongPlayer segments={segments} />
      )}
    </View>
  );
};

export default Mp3Segments;
