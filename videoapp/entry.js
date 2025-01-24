import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Eğer geliştirme ortamındaysak
export default function App() {
    return <ExpoRoot context={require.context('./', true, /\.(js|jsx|ts|tsx)$/)} />;
}

registerRootComponent(App); 