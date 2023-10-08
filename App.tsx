import React, { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigations/AppNavigation';
import { StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';
import _ from 'lodash';

import { DroneDataContext } from './DroneDataContext';
const { ConnectionModule } = NativeModules;

const App: React.FC = () => {
  const droneDataContext = useContext(DroneDataContext);

  if (!droneDataContext) {
    throw new Error("App must be used within a DroneDataProvider");
  }

  const { setData } = droneDataContext;


  useEffect(() => {
    let timeoutId;

    const receiveUDP = async () => {
      try {
        const data = await ConnectionModule.receiveUDP(14551);
        const jsonObject = JSON.parse(data);
        if (jsonObject.lat !== "0") {
          setData(jsonObject);
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setData(null);
          }, 1000);
        } else {
          setData(null);
        }
      } catch (error) {
        console.log("Clearing data...");
        console.error(error);
      }
    };

    const throttledReceiveUDP = _.throttle(receiveUDP, 500);
    const intervalId = setInterval(throttledReceiveUDP, 500);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});