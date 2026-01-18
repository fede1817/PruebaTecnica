import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native'; // ¡IMPORTANTE! Importar Text de react-native
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3498db',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Productos'}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{title: 'Detalle del Producto'}}
      />
    </Stack.Navigator>
  );
}

// Componente para íconos personalizados
const TabBarIcon = ({focused, color, size, iconName}: any) => {
  // Si no quieres instalar @expo/vector-icons, usa Text simple
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: size, color}}>{iconName}</Text>
    </View>
  );
};

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: 'Inicio',
            tabBarIcon: ({color, size, focused}) => (
              <TabBarIcon
                color={color}
                size={size}
                focused={focused}
                iconName={focused ? '🏠' : '🏠'}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            title: 'Favoritos',
            tabBarIcon: ({color, size, focused}) => (
              <TabBarIcon
                color={color}
                size={size}
                focused={focused}
                iconName={focused ? '⭐' : '☆'}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
