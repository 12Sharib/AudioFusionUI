import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Mp3Segments from '../components/Mp3Segments';
import VideoSegments from '../components/VideoSegments';

export default function MakeSegments() {
  const [isVideoMode, setVideoMode] = useState(false);

  const toggleMode = () => {
    setVideoMode(!isVideoMode);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Text style={{ marginRight: 12, fontSize: 15, fontWeight:'bold' }}>MP3</Text>
        <Switch
          value={isVideoMode}
          onValueChange={toggleMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isVideoMode ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} // Increase switch size
        />
        <Text style={{ marginLeft: 12, fontSize: 15, fontWeight:'bold' }}>Video</Text>
      </View>

      {isVideoMode ? (
        <VideoSegments pickLabel="Pick Video" uploadLabel="Upload Video/Make Segments" />
      ) : (
        <Mp3Segments pickLabel="Pick Mp3 Song" uploadLabel="Upload Mp3 Song/Make Segments" />
      )}
    </View>
  );
}

