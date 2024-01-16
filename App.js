import * as React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./src/components/navigation/BottomNavigator";
// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Navigation Container
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home">{HomeScreen}</Stack.Screen>
    //   </Stack.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
