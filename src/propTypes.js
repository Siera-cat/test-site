import PropTypes from 'prop-types';

// Единые описания структуры объектов, приходящих из API.
export const bookShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author_name: PropTypes.arrayOf(PropTypes.string),
  first_publish_year: PropTypes.number,
  cover_i: PropTypes.number,
  ratings_average: PropTypes.number,
});

export const movieShape = PropTypes.shape({
  imdbID: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Year: PropTypes.string,
  Director: PropTypes.string,
  Genre: PropTypes.string,
  Actors: PropTypes.string,
  Runtime: PropTypes.string,
  imdbRating: PropTypes.string,
  Plot: PropTypes.string,
  Poster: PropTypes.string,
});
