import makeClassName from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

export default function Card({
  children,
  className,
  footer: footerNode,
  footerLink,
  footerText,
  header,
  photonStyle = false,
}) {
  let footer;
  let footerClass;

  if (
    (footerText && footerLink) ||
    (footerLink && footerNode) ||
    (footerText && footerNode)
  ) {
    throw new Error(`You can only specify exactly one of these props:
        footer, footerLink or footerText.`);
  } else if (footerText) {
    footer = footerText;
    footerClass = 'Card-footer-text';
  } else if (footerLink) {
    footer = footerLink;
    footerClass = 'Card-footer-link';
  } else {
    footer = footerNode;
  }

  return (
    <section
      className={makeClassName(styles.Card, className, {
        [styles['Card--photon']]: photonStyle,
        [styles['Card--no-header']]: !header,
        [styles['Card--no-footer']]: !footer,
      })}
    >
      {header ? (
        <header className={`${styles['Card-header']}`}>{header}</header>
      ) : null}

      {children ? (
        <div className={`${styles['Card-contents']}`}>{children}</div>
      ) : null}

      {footer ? (
        <footer
          className={makeClassName(`${styles['Card-footer']}`, footerClass)}
        >
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  footer: PropTypes.node,
  footerLink: PropTypes.node,
  footerText: PropTypes.node,
  header: PropTypes.node,
  // Photon is the name of the new Firefox design language. This flag
  // modifies the card style to left-align the header, add padding, and tweak
  // the styles to be in line with the new photon mocks while we migrate the
  // rest of the site over.
  photonStyle: PropTypes.bool,
};
