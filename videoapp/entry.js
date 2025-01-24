import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';

// Eğer geliştirme ortamındaysak
function App() {
    const ctx = require.context('./app');
    return React.createElement(ExpoRoot, { context: ctx });
}

export default registerRootComponent(App); 