import React from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {removeFavorite} from '../store/favoritesSlice';
import ProductCard from '../components/ProductCard';
import {Product} from '../types';

const FavoritesScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {favorites, ids} = useSelector((state: RootState) => state.favorites);
  const favoriteProducts = ids.map(id => favorites[id]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', {product});
  };

  const handleToggleFavorite = (product: Product) => {
    dispatch(removeFavorite(product.id));
  };

  const renderEmpty = () => (
    <View style={styles.centered}>
      <Text style={styles.emptyText}>No hay favoritos aún</Text>
      <Text style={styles.emptySubtext}>
        Añade productos a favoritos desde la pantalla principal
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favoritos ({ids.length})</Text>
      <FlatList
        data={favoriteProducts}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            onPress={handleProductPress}
            isFavorite={true}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          favoriteProducts.length === 0 ? styles.emptyList : styles.list
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fondo blanco forzado
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#ffffff',
    color: '#000000', // Negro forzado
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    textAlign: 'center',
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333', // Gris oscuro
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666666', // Gris más claro
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default FavoritesScreen;
