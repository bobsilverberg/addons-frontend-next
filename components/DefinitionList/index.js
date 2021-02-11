import makeClassName from 'classnames';
import PropTypes from 'prop-types';

export function Definition({ children, className, term }) {
  return (
    <>
      <dt className="Definition-dt">{term}</dt>
      <dd className={makeClassName('Definition-dd', className)}>{children}</dd>
    </>
  );
}

Definition.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  term: PropTypes.node,
};

export default function DefinitionList({ className, children }) {
  return (
    <dl className={makeClassName('DefinitionList', className)}>{children}</dl>
  );
}

DefinitionList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
