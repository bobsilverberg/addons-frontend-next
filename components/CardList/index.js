import makeClassName from 'classnames';
import PropTypes from 'prop-types';

import Card from '../Card';
import styles from './styles.module.scss';

export default function CardList({ children, className, ...cardProps }) {
  return (
    <Card
      {...cardProps}
      className={makeClassName(`${styles.CardList}`, className)}
      photonStyle
    >
      {/* Children in this case is expected to be an unordered list, */}
      {/* which will be styled correctly. */}
      {children}
    </Card>
  );
}

CardList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
