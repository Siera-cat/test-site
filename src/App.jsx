import { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import MovieList from './components/MovieList';
import DetailsModal from './components/DetailsModal';
import { searchBooks, searchMovies } from './api';
import './App.css';

const DEBOUNCE_MS = 500;

function App() {
  const [mode, setMode] = useState('books'); // 'books' | 'movies'
  const [query, setQuery] = useState('');
  const [result, setResult] = useState({ key: '', items: [], error: '' });
  const [selected, setSelected] = useState(null);
  const searchBarRef = useRef(null);

  const trimmed = query.trim();
  const requestKey = `${mode}:${trimmed}`;

  // Debounce-таймер поиска: useEffect с очисткой таймера и отменой запроса
  useEffect(() => {
    if (!trimmed) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const search = mode === 'books' ? searchBooks : searchMovies;
        const items = await search(trimmed, controller.signal);
        setResult({ key: requestKey, items, error: items.length ? '' : 'Ничего не найдено.' });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setResult({ key: requestKey, items: [], error: err.message });
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort(); // устаревший запрос больше не перетрёт результат
    };
  }, [trimmed, mode, requestKey]);

  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setSelected(null);
    searchBarRef.current?.focus();
  };

  const closeModal = useCallback(() => setSelected(null), []);

  // Результат актуален, только если он относится к текущему запросу и режиму
  const current = result.key === requestKey ? result : null;
  const loading = Boolean(trimmed) && !current;
  const items = current?.items ?? [];

  let content;
  if (!trimmed) {
    content = (
      <p className="empty">
        Введите название, чтобы найти {mode === 'books' ? 'книги' : 'фильмы'}.
      </p>
    );
  } else if (loading) {
    content = <p className="status" role="status">Загрузка...</p>;
  } else if (current.error) {
    content = <p className="status" role="status">{current.error}</p>;
  } else if (mode === 'books') {
    content = <BookList books={items} onSelect={setSelected} />;
  } else {
    content = <MovieList movies={items} onSelect={setSelected} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Поиск книг и фильмов</h1>
        <div className="mode-switcher">
          <button
            type="button"
            className={mode === 'books' ? 'active' : ''}
            aria-pressed={mode === 'books'}
            onClick={() => changeMode('books')}
          >
            Книги
          </button>
          <button
            type="button"
            className={mode === 'movies' ? 'active' : ''}
            aria-pressed={mode === 'movies'}
            onClick={() => changeMode('movies')}
          >
            Фильмы
          </button>
        </div>
      </header>

      <SearchBar
        ref={searchBarRef}
        placeholder={mode === 'books' ? 'Название книги...' : 'Название фильма...'}
        onChange={setQuery}
      />

      {content}

      {selected && (
        <DetailsModal
          kind={mode === 'books' ? 'book' : 'movie'}
          item={selected}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
