import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {
  fetchProducts,
  setSearchQuery,
  clearSearch,
} from '../store/productSlice';
import {toggleFavorite} from '../store/favoritesSlice';
import SearchBar from '../components/SearchBar';
import ProductList from '../components/ProductList';
import {Product} from '../types';

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {items, status, error, hasMore, searchQuery} = useSelector(
    (state: RootState) => state.products,
  );
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites,
  );

  // Carga inicial de productos
  useEffect(() => {
    console.log('HomeScreen mounted, loading products...');
    dispatch(fetchProducts(0));
  }, [dispatch]);

  // Manejo de búsqueda
  const handleSearch = useCallback(
    (query: string) => {
      console.log('Searching for:', query);
      dispatch(setSearchQuery(query));

      // Pequeño delay antes de hacer la búsqueda
      setTimeout(() => {
        dispatch(fetchProducts(0));
      }, 100);
    },
    [dispatch],
  );

  const handleClearSearch = useCallback(() => {
    console.log('Clearing search');
    dispatch(clearSearch());
    dispatch(fetchProducts(0));
  }, [dispatch]);

  const handleProductPress = useCallback(
    (product: Product) => {
      console.log('Product pressed:', product.title);
      navigation.navigate('ProductDetail', {product});
    },
    [navigation],
  );

  const handleToggleFavorite = useCallback(
    (product: Product) => {
      console.log('Toggle favorite:', product.title);
      dispatch(toggleFavorite(product));
    },
    [dispatch],
  );

  const handleLoadMore = useCallback(() => {
    if (hasMore && status !== 'loading') {
      const nextPage = Math.floor(items.length / 10);
      console.log('Loading more, page:', nextPage);
      dispatch(fetchProducts(nextPage));
    }
  }, [hasMore, status, items.length, dispatch]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing products...');
    dispatch(fetchProducts(0));
  }, [dispatch]);

  // Debug info - puedes comentar o remover esto después
  useEffect(() => {
    console.log('Current state:', {
      itemsCount: items.length,
      status,
      error,
      hasMore,
      searchQuery,
      favoritesCount: Object.keys(favorites).length,
    });
  }, [items, status, error, hasMore, searchQuery, favorites]);

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar productos por nombre..."
      />

      {/* Debug info - puedes comentar esto después */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Estado: {status}</Text>
          <Text style={styles.debugText}>Productos: {items.length}</Text>
          <Text style={styles.debugText}>Búsqueda: "{searchQuery}"</Text>
          <Text style={styles.debugText}>
            Favoritos: {Object.keys(favorites).length}
          </Text>
        </View>
      )}

      <ProductList
        products={items}
        onProductPress={handleProductPress}
        onToggleFavorite={handleToggleFavorite}
        onLoadMore={handleLoadMore}
        onRefresh={handleRefresh}
        favorites={favorites}
        status={status}
        error={error}
        hasMore={hasMore}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  debugInfo: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;
