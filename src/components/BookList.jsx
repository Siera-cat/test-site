import React from 'react';
import PropTypes from 'prop-types';
import BookCard from './BookCard';
import { bookShape } from '../propTypes';

// Классовый компонент
class BookList extends React.Component {
  render() {
    const { books, onSelect } = this.props;
    return (
      <div className="card-grid">
        {books.map((book) => (
          <BookCard key={book.key} book={book} onSelect={onSelect} />
        ))}
      </div>
    );
  }
}

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default BookList;
