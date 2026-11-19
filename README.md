# Поиск книг и фильмов

React-приложение: поиск книг (Open Library API) и фильмов (OMDB API) по названию, карточки с обложкой, автором/режиссёром, годом и рейтингом, подробное описание по клику.

## Запуск

```bash
npm install
npm run dev
```

Ключ OMDB по умолчанию зашит в `src/api.js`; чтобы использовать свой, скопируйте `.env.example` в `.env` и укажите `VITE_OMDB_KEY`.

## Как выполнены требования

| Требование | Где |
|---|---|
| Функциональные и классовые компоненты | функциональные: `App`, `SearchBar`, `*Card`, `DetailsModal`, `Cover`; классовые: `BookList`, `MovieList` |
| Данные через props + деструктуризация | `App` → `*List` → `*Card` → `DetailsModal` |
| State и хуки | `useState`, `useEffect`, `useRef`, `useCallback` |
| `useEffect` для таймера | debounce 500 мс с очисткой таймера и `AbortController` в `App.jsx` |
| PropTypes | во всех компонентах, общие `shape` в `src/propTypes.js` |
| Управляемая форма и рефы | `SearchBar` (`value`/`onChange`, `useRef`, `forwardRef`, `useImperativeHandle`) |
