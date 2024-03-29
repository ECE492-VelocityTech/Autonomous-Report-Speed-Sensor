import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  useColorScheme,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen.tsx";
import StyleUtil from "./components/util/StyleUtil.ts";
import SignInScreen from "./screens/SignInScreen.tsx";
import discoverDevice from "./components/DiscoverDevice.tsx";
import Constants from "./components/Constants.js";
import styleUtil from "./components/util/StyleUtil.ts";
import AddDeviceScreen from "./screens/AddDeviceScreen.tsx";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  StyleUtil.darkMode = isDarkMode;

  const navigatorOptions: NativeStackNavigationOptions = {
      headerStyle: styleUtil.getBackgroundColor(),
      headerTintColor: isDarkMode ? Constants.ThemeColor.DarkForeground : Constants.ThemeColor.LightForeground, // Set text color for the top bar
      headerTitleStyle: {
          fontWeight: 'bold',
      },
  }

  return (
      <NavigationContainer>
          <Stack.Navigator screenOptions={navigatorOptions}>
              <Stack.Screen
                  name="Home" component={HomeScreen} options={{title: 'CARSS'}}
              />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="AddDevice" component={AddDeviceScreen} options={{title: 'Add Device'}}/>
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
