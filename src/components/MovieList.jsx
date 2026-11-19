import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';
import { movieShape } from '../propTypes';

// Классовый компонент
class MovieList extends React.Component {
  render() {
    const { movies, onSelect } = this.props;
    return (
      <div className="card-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onSelect={onSelect} />
        ))}
      </div>
    );
  }
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(movieShape).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MovieList;
