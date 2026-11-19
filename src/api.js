// Ключ OMDB можно переопределить через .env (VITE_OMDB_KEY)
const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
const OMDB_URL = 'https://www.omdbapi.com/';
const OPEN_LIBRARY = 'https://openlibrary.org';

async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Ошибка сети (${res.status})`);
  return res.json();
}

/* ─────────────── Книги (Open Library) ─────────────── */

const BOOK_FIELDS =
  'key,title,author_name,first_publish_year,cover_i,ratings_average';

export async function searchBooks(query, signal) {
  const data = await getJson(
    `${OPEN_LIBRARY}/search.json?q=${encodeURIComponent(query)}&limit=12&fields=${BOOK_FIELDS}`,
    signal
  );
  return data.docs || [];
}

export async function fetchBookDescription(key, signal) {
  try {
    const data = await getJson(`${OPEN_LIBRARY}${key}.json`, signal);
    const d = data.description;
    if (typeof d === 'string' && d.trim()) return d;
    if (d?.value) return d.value;
    return 'Описание отсутствует.';
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return 'Не удалось загрузить описание.';
  }
}

/* ─────────────── Фильмы (OMDB) ─────────────── */

const EMPTY_ANSWERS = ['Movie not found!', 'Too many results.'];

export async function searchMovies(query, signal) {
  if (!OMDB_KEY) throw new Error('Не задан ключ OMDB (VITE_OMDB_KEY)');
  const search = await getJson(
    `${OMDB_URL}?apikey=${OMDB_KEY}&type=movie&s=${encodeURIComponent(query)}`,
    signal
  );

  if (search.Response === 'False') {
    if (EMPTY_ANSWERS.includes(search.Error)) return [];
    throw new Error(search.Error || 'Ошибка OMDB');
  }

  const details = await Promise.all(
    search.Search.slice(0, 8).map(({ imdbID }) =>
      getJson(`${OMDB_URL}?apikey=${OMDB_KEY}&i=${imdbID}&plot=short`, signal)
    )
  );
  return details.filter((m) => m.Response !== 'False');
}

export function fetchMovieDetails(imdbID, signal) {
  return getJson(`${OMDB_URL}?apikey=${OMDB_KEY}&i=${imdbID}&plot=full`, signal);
}
