import PropTypes from 'prop-types';
import Cover from './Cover';
import { bookShape } from '../propTypes';

function BookCard({ book, onSelect }) {
  const { title, author_name, first_publish_year, cover_i, ratings_average } = book;

  const coverUrl = cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    : null;

  return (
    <article className="card">
      <button type="button" className="card-hit" onClick={() => onSelect(book)}>
        <Cover key={coverUrl} className="card-cover" src={coverUrl} alt={`Обложка «${title}»`} />
        <span className="card-body">
          <span className="card-title">{title}</span>
          <span className="card-meta">
            <span>{author_name?.join(', ') || 'Автор неизвестен'}</span>
            {first_publish_year && <span>{first_publish_year}</span>}
          </span>
          {ratings_average ? (
            <span className="card-rating">★ {ratings_average.toFixed(1)} / 5</span>
          ) : null}
          <span className="card-more">Подробнее →</span>
        </span>
      </button>
    </article>
  );
}

BookCard.propTypes = {
  book: bookShape.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default BookCard;
