# Prueba Técnica - Frontend React Native

## Descripción
Aplicación React Native que lista productos desde DummyJSON API, con funcionalidades de búsqueda, favoritos y paginación.

## Características
- ✅ Listado de productos con paginación (infinite scroll)
- ✅ Búsqueda con debounce de 300ms
- ✅ Pantalla de detalle de producto
- ✅ Gestión de favoritos con Redux Toolkit
- ✅ Persistencia de favoritos con AsyncStorage
- ✅ Pull to refresh
- ✅ Manejo de estados: loading, error, empty states
- ✅ TypeScript para type safety

## Instalación

1. Clonar repositorio:
git clone https://github.com/fede1817/PruebaTecnica.git
cd PruebaTecnica

2. Instalar dependencias:
npm install

3. Para iOS:
cd ios && pod install && cd ..

4.Ejecutar aplicación:
Android:
npx react-native run-android
iOS:
npx react-native run-ios

Decisiones Técnicas
1. Por qué Redux Toolkit vs Context API?
Manejo complejo de estado asíncrono (paginación + búsqueda)

DevTools integradas para debugging

Código más mantenible con slices

Mejor performance con selectores memoizados

2. Por qué Axios vs Fetch?
Interceptores para logging/errors

Cancelación de requests

Timeout automático

Transformación de datos integrada

3. Por qué Paginación Real vs Simulada?
Demostración de integración con API real

Comportamiento más realista

Mejor manejo de grandes conjuntos de datos


