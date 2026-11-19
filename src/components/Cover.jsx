import { useState } from 'react';
import PropTypes from 'prop-types';

// Локальная заглушка (SVG data-URI) — не зависит от внешних сервисов
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="300" height="450" fill="#E7DCC4"/>
      <rect x="95" y="150" width="110" height="150" rx="8" fill="none" stroke="#A39A92" stroke-width="6"/>
      <path d="M115 270l25-35 20 25 15-18 25 28z" fill="#A39A92"/>
      <circle cx="132" cy="190" r="12" fill="#A39A92"/>
      <text x="150" y="350" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#77685D">Нет изображения</text>
    </svg>`
  );

// Если картинка не загрузилась — подставляем заглушку
function Cover({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      className={className}
      src={!src || failed ? PLACEHOLDER : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

Cover.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Cover;
