import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {debounce} from '../utils/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar productos...',
}) => {
  const [query, setQuery] = useState('');
  const debouncedSearchRef = useRef<any>(null);

  useEffect(() => {
    debouncedSearchRef.current = debounce(onSearch, 500);
  }, [onSearch]);

  useEffect(() => {
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(query);
    }
  }, [query]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666" // Gris oscuro visible
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          returnKeyType="search"
          onSubmitEditing={() => onSearch(query)}
          // Forzar colores explícitos
          color="#000000" // Texto NEGRO forzado
          cursorColor="#3498db" // Cursor azul
          underlineColorAndroid="transparent"
          keyboardAppearance="light" // Teclado siempre claro
          selectionColor="#3498db" // Color de selección
        />
        {query.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff', // Fondo blanco forzado
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa', // Gris claro
    color: '#000000', // Negro forzado - ¡IMPORTANTE!
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#cccccc',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
});

export default SearchBar;
