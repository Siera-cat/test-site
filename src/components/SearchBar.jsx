import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

// Управляемая форма + рефы (на input и наружу через forwardRef)
const SearchBar = forwardRef(function SearchBar({ placeholder, onChange }, ref) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const update = (next) => {
    setValue(next);
    onChange(next);
  };

  const handleClear = () => {
    update('');
    inputRef.current?.focus();
  };

  return (
    <form className="search-bar" onSubmit={(e) => e.preventDefault()} role="search">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => update(e.target.value)}
        placeholder={placeholder}
        aria-label="Поиск"
      />
      {value && (
        <button type="button" className="search-clear" onClick={handleClear} aria-label="Очистить">
          ×
        </button>
      )}
    </form>
  );
});

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
