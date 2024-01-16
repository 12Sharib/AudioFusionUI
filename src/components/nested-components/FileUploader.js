import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import CommonButton from '../button/CommonButton'; 
import SongPlayer from './SongPlayer'; 

const FileUploader = ({
  selectedFile,
  handleFilePick,
  uploadFile,
  pickLabel,
  uploadLabel,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Select a file to upload:</Text>
        {selectedFile && (
          <Text>Selected File: {selectedFile.assets[0].name}</Text>
        )}
        <CommonButton title={pickLabel} onPress={handleFilePick} />
      </View>
      <CommonButton title={uploadLabel} onPress={uploadFile} />
      
    </View>
  );
};
const styles = StyleSheet.create({
    box: {
      alignSelf: "center",
      borderWidth: 1,
      borderColor: "black",
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
      margin: 2,
    },
    label: {
      marginBottom: 10,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default FileUploader;
