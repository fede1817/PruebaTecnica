import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {toggleFavorite} from '../store/favoritesSlice';
import {Product} from '../types';

const ProductDetailScreen = ({route, navigation}: any) => {
  const {product} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites,
  );
  const isFavorite = !!favorites[product.id];

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.headerButton}>
          <Text
            style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <Image
        source={{
          uri:
            product.images && product.images.length > 0
              ? product.images[0]
              : product.thumbnail,
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.brand}>{product.brand}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.discount}>
              {product.discountPercentage}% OFF
            </Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Rating:</Text>
            <Text style={styles.statValue}>
              ⭐ {product.rating ? product.rating.toFixed(1) : 'N/A'}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Stock:</Text>
            <Text style={[styles.statValue, styles.stock]}>
              {product.stock || 0} units
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Category:</Text>
            <Text style={styles.statValue}>{product.category || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || 'No description available.'}
          </Text>
        </View>

        {/* Sección de imágenes - CORREGIDA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Images</Text>
          {product.images &&
          Array.isArray(product.images) &&
          product.images.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesScroll}
              contentContainerStyle={styles.imagesContainer}>
              {product.images.map((image: string, index: number) => (
                <Image
                  key={`image-${index}`}
                  source={{uri: image}}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noImagesText}>
              No additional images available
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 32,
  },
  brand: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 16,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginRight: 12,
  },
  discount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  stock: {
    color: '#3498db',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'justify',
  },
  imagesScroll: {
    marginTop: 10,
  },
  imagesContainer: {
    paddingRight: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  noImagesText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  headerButton: {
    marginRight: 16,
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
  },
  favoriteActive: {
    color: '#e74c3c',
  },
});

export default ProductDetailScreen;
