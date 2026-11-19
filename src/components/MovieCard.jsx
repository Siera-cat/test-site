import PropTypes from 'prop-types';
import Cover from './Cover';
import { movieShape } from '../propTypes';

const has = (v) => v && v !== 'N/A';

function MovieCard({ movie, onSelect }) {
  const { Title, Year, Director, imdbRating, Plot, Poster } = movie;

  return (
    <article className="card">
      <button type="button" className="card-hit" onClick={() => onSelect(movie)}>
        <Cover key={Poster} className="card-cover" src={has(Poster) ? Poster : null} alt={`Постер «${Title}»`} />
        <span className="card-body">
          <span className="card-title">{Title}</span>
          <span className="card-meta">
            <span>{Year}</span>
            {has(Director) && <span>{Director}</span>}
          </span>
          {has(imdbRating) && <span className="card-rating">★ IMDb {imdbRating}</span>}
          <span className="card-description">{has(Plot) ? Plot : 'Описание отсутствует.'}</span>
          <span className="card-more">Подробнее →</span>
        </span>
      </button>
    </article>
  );
}

MovieCard.propTypes = {
  movie: movieShape.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MovieCard;
