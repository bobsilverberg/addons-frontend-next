import makeClassName from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export default function Icon({ alt, children, className, name, ...props }) {
  let altSpan;
  // If alt text was included, we'll render that in a hidden span.
  if (alt) {
    altSpan = <span className="visually-hidden">{alt}</span>;
  }

  return (
    <span
      className={makeClassName(
        styles.Icon,
        `${styles[`Icon-${name}`]}`,
        className,
      )}
      {...props}
    >
      {altSpan}
      {children}
    </span>
  );
}

Icon.propTypes = {
  alt: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  className: PropTypes.string,
  name: PropTypes.string,
};
