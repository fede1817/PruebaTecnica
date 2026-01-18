import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Product} from '../types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

const {width} = Dimensions.get('window');

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isFavorite,
  onToggleFavorite,
}) => {
  // Limitar el título a un máximo de caracteres
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      activeOpacity={0.7}>
      <Image
        source={{uri: product.thumbnail}}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {truncateTitle(product.title)}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.discount}>
              {product.discountPercentage}% OFF
            </Text>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => onToggleFavorite(product)}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Text
          style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
          {isFavorite ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginRight: 8,
  },
  discount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e74c3c',
    backgroundColor: '#ffeaea',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  ratingContainer: {
    backgroundColor: '#fff9e6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  favoriteActive: {
    color: '#e74c3c',
  },
});

export default ProductCard;
