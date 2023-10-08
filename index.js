import { AppRegistry } from 'react-native';
import React from 'react';  // Make sure to import React
import App from './App';
import { name as appName } from './app.json';
import { DroneDataProvider } from './DroneDataContext';  // Update the path if needed

// This RootComponent wraps App with the DroneDataProvider
const RootComponent = () => (
    <DroneDataProvider>
        <App />
    </DroneDataProvider>
);

// Register the RootComponent instead of just App
AppRegistry.registerComponent(appName, () => RootComponent);
