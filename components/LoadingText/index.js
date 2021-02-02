/* @flow */
import makeClassName from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const possibleWidths = [20, 40, 60, 80, 100];

export default function LoadingText({ className, width, minWidth = 20 }) {
  // We start each animation with a slightly different delay so content
  // doesn't appear to be pulsing all at once.
  const delayStart = Math.floor(Math.random() * 3) + 1;

  let finalWidth = width;
  if (
    typeof finalWidth === 'undefined' ||
    !possibleWidths.includes(finalWidth)
  ) {
    const widths = possibleWidths.filter((w) => w >= minWidth);
    finalWidth = widths[Math.floor(Math.random() * widths.length)];
  }

  return (
    <span
      className={makeClassName(
        styles.LoadingText,
        `${styles[`LoadingText--delay-${delayStart}`]}`,
        `${styles[`LoadingText--width-${finalWidth}`]}`,
        className,
      )}
    />
  );
}

LoadingText.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  minWidth: PropTypes.number,
};
