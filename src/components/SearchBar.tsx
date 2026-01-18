import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
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
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchRef = useRef<any>(null);

  // Inicializar debounce solo una vez
  useEffect(() => {
    console.log('🔧 [SearchBar] Inicializando debounce');
    debouncedSearchRef.current = debounce(onSearch, 500);
  }, [onSearch]);

  // Efecto para ejecutar búsqueda cuando query cambia
  useEffect(() => {
    if (debouncedSearchRef.current) {
      console.log(`🔍 [SearchBar] Query changed: "${query}"`);
      debouncedSearchRef.current(query);
    }
  }, [query]);

  const handleClear = () => {
    console.log('🗑️ [SearchBar] Clearing search');
    setQuery('');
    onSearch(''); // Notificar que se limpió la búsqueda
  };

  const handleSubmit = () => {
    console.log('↵ [SearchBar] Submit pressed');
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.focused]}>
        {/* Icono de búsqueda */}
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onFocus={() => {
            console.log(' [SearchBar] Input focused');
            setIsFocused(true);
          }}
          onBlur={() => {
            console.log('👋 [SearchBar] Input blurred');
            setIsFocused(false);
          }}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          enablesReturnKeyAutomatically={true}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          clearButtonMode="while-editing"
          // Forzar colores para modo oscuro
          color="#010000"
          cursorColor="#3498db"
          underlineColorAndroid="transparent"
          keyboardAppearance="light"
          selectionColor="#3498db"
        />

        {/* Botón de limpiar personalizado */}
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  focused: {
    borderColor: '#3498db',
    backgroundColor: '#ffffff',
    shadowColor: '#3498db',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  debugInfo: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    color: '#666',
  },
});

export default SearchBar;
