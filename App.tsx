import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StatusBar, Platform, LogBox, View, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorar warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// Componente de fallback por si hay error
const ErrorFallback = ({error}: {error: Error}) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    }}>
    <Text style={{fontSize: 18, color: 'red', marginBottom: 10}}>
      Error en la app:
    </Text>
    <Text style={{color: '#333', textAlign: 'center'}}>{error.message}</Text>
  </View>
);

// Componente principal con Error Boundary
class AppContent extends React.Component {
  state = {hasError: false, error: null};

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }

    return <AppNavigator />;
  }
}

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#ffffff');
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
