import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen";
import FetchPhoneSongs from "../../screens/FetchPhoneSongs";
import MakeSegments from "../../screens/MakeSegments";
import { Feather } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; // Import the FontAwesome5 icon library

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}
      options={{
        tabBarIcon:({color, size}) =>(
          <Entypo name="home" size={24} color="black" />
        )
      }

      } />
      <Tab.Screen
        name="Fetch Phone Music"
        component={FetchPhoneSongs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="mobile-alt" size={size} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Create Short Videos/ Songs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="upload" size={size} color="black" />
          ),
        }}
        component={MakeSegments}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
