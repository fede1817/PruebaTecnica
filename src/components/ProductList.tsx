import React, {useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import {Product} from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  favorites: Record<number, Product>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hasMore: boolean;
  isRefreshing?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductPress,
  onToggleFavorite,
  onLoadMore,
  onRefresh,
  favorites,
  status,
  error,
  hasMore,
  isRefreshing = false,
  searchQuery = '',
  onClearSearch,
}) => {
  const renderProduct: ListRenderItem<Product> = useCallback(
    ({item}) => (
      <ProductCard
        product={item}
        onPress={onProductPress}
        isFavorite={!!favorites[item.id]}
        onToggleFavorite={onToggleFavorite}
      />
    ),
    [favorites, onProductPress, onToggleFavorite],
  );

  const renderFooter = () => {
    if (!hasMore && products.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No hay más productos</Text>
        </View>
      );
    }

    if (status === 'loading' && products.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      );
    }

    return null;
  };

  const renderEmpty = () => {
    if (status === 'loading' && products.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Cargando productos...</Text>
        </View>
      );
    }

    if (status === 'failed' && products.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error || 'Error al cargar productos'}
          </Text>
          {onRefresh && (
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (products.length === 0 && searchQuery) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            No se encontraron productos para "{searchQuery}"
          </Text>
          {onClearSearch && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearSearch}>
              <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
          {onRefresh && (
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Refrescar</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return null;
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && status !== 'loading' && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, status, onLoadMore]);

  const handleRefresh = useCallback(() => {
    if (onRefresh && status !== 'loading') {
      onRefresh();
    }
  }, [onRefresh, status]);

  if (status === 'failed' && products.length === 0) {
    return <View style={styles.container}>{renderEmpty()}</View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={
          products.length === 0 ? styles.listContentEmpty : styles.listContent
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#3498db']}
              tintColor="#3498db"
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingVertical: 8,
  },
  listContentEmpty: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#95a5a6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductList;
