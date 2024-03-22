import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  useColorScheme,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from "./screens/HomeScreen.tsx";
import StyleUtil from "./components/util/StyleUtil.ts";
import SignInScreen from "./screens/SignInScreen.tsx";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  StyleUtil.darkMode = isDarkMode;

  return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen
                  name="Home" component={HomeScreen} options={{title: 'CARSS'}}
              />
              <Stack.Screen name="SignIn" component={SignInScreen} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
