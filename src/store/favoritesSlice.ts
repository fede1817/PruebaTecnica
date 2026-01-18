import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Product, FavoritesState} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

const loadFavorites = async (): Promise<FavoritesState> => {
  try {
    const saved = await AsyncStorage.getItem(FAVORITES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
  return {favorites: {}, ids: []};
};

const saveFavorites = async (state: FavoritesState) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

const initialState: FavoritesState = {
  favorites: {},
  ids: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const {id} = product;

      if (state.favorites[id]) {
        // Remover de favoritos
        delete state.favorites[id];
        state.ids = state.ids.filter(favId => favId !== id);
      } else {
        // Agregar a favoritos
        state.favorites[id] = product;
        state.ids.push(id);
      }

      // Persistir cambios
      saveFavorites(state);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      delete state.favorites[id];
      state.ids = state.ids.filter(favId => favId !== id);
      saveFavorites(state);
    },
    setFavorites: (state, action: PayloadAction<FavoritesState>) => {
      state.favorites = action.payload.favorites;
      state.ids = action.payload.ids;
    },
  },
});

export const {toggleFavorite, removeFavorite, setFavorites} =
  favoritesSlice.actions;

// Thunk para cargar favoritos iniciales
export const initializeFavorites = () => async (dispatch: any) => {
  try {
    const favorites = await loadFavorites();
    dispatch(setFavorites(favorites));
  } catch (error) {
    console.error('Error initializing favorites:', error);
  }
};

export default favoritesSlice.reducer;
