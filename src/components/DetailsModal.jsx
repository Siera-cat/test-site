import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Cover from './Cover';
import { bookShape, movieShape } from '../propTypes';
import { fetchBookDescription, fetchMovieDetails } from '../api';

const has = (v) => v && v !== 'N/A';

// Приводим книгу и фильм к одному виду для отображения
function toView(kind, item, extra) {
  if (kind === 'book') {
    const { title, author_name, first_publish_year, cover_i, ratings_average } = item;
    return {
      title,
      cover: cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg` : null,
      creatorLabel: 'Автор',
      creator: author_name?.join(', ') || 'неизвестен',
      year: first_publish_year ? String(first_publish_year) : null,
      rating: ratings_average ? `★ ${ratings_average.toFixed(1)} / 5` : null,
      facts: [],
      description: extra,
    };
  }
  const d = extra && typeof extra === 'object' ? extra : item;
  return {
    title: d.Title,
    cover: has(d.Poster) ? d.Poster : null,
    creatorLabel: 'Режиссёр',
    creator: has(d.Director) ? d.Director : 'неизвестен',
    year: has(d.Year) ? d.Year : null,
    rating: has(d.imdbRating) ? `★ IMDb ${d.imdbRating} / 10` : null,
    facts: [
      has(d.Genre) && ['Жанр', d.Genre],
      has(d.Runtime) && ['Длительность', d.Runtime],
      has(d.Actors) && ['В ролях', d.Actors],
    ].filter(Boolean),
    description: has(d.Plot) ? d.Plot : 'Описание отсутствует.',
  };
}

function DetailsModal({ kind, item, onClose }) {
  const [extra, setExtra] = useState(null); // подробности, загруженные из API
  const closeRef = useRef(null);

  // Загрузка полного описания
  useEffect(() => {
    const controller = new AbortController();
    const request =
      kind === 'book'
        ? fetchBookDescription(item.key, controller.signal)
        : fetchMovieDetails(item.imdbID, controller.signal);
    request.then(setExtra).catch(() => {});
    return () => controller.abort();
  }, [kind, item]);

  // Закрытие по Escape + фокус на кнопке закрытия
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const { title, cover, creatorLabel, creator, year, rating, facts, description } = toView(
    kind,
    item,
    extra
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <Cover key={cover} className="modal-cover" src={cover} alt={`Обложка «${title}»`} />
        <div className="modal-body">
          <h2>{title}</h2>
          <p className="modal-meta">
            <span>{creatorLabel}: {creator}</span>
            {year && <span>{year}</span>}
          </p>
          {rating && <p className="card-rating">{rating}</p>}
          {facts.map(([label, value]) => (
            <p key={label} className="modal-fact"><b>{label}:</b> {value}</p>
          ))}
          <p className="modal-description">
            {description ?? 'Загрузка описания...'}
          </p>
        </div>
      </div>
    </div>
  );
}

DetailsModal.propTypes = {
  kind: PropTypes.oneOf(['book', 'movie']).isRequired,
  item: PropTypes.oneOfType([bookShape, movieShape]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailsModal;
