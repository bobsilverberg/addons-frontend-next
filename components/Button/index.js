/* @flow */
import makeClassName from 'classnames';
import { oneLine } from 'common-tags';
import Link from 'next/link';
import PropTypes from 'prop-types';

import log from '../../utils/logger_next';
import styles from './styles.module.scss';

const BUTTON_TYPES = [
  'neutral',
  'light',
  'action',
  'cancel',
  'confirm',
  'alert',
  'none',
];

export default function Button({
  buttonType = 'none',
  children,
  className,
  disabled = false,
  href,
  htmlType = 'submit',
  micro = false,
  noLink = false,
  prependClientApp = false,
  prependLang = false,
  puffy = false,
  to,
  ...rest
}) {
  const props = { ...rest };

  if (!BUTTON_TYPES.includes(buttonType)) {
    throw new Error(oneLine`buttonType="${buttonType}" supplied but that is
        not a valid button type`);
  }

  const getClassName = (...classConfig) => {
    return makeClassName(
      styles.Button,
      styles[`Button--${buttonType}`],
      className,
      ...classConfig,
      {
        [styles['Button--disabled']]: disabled,
        [styles['Button--micro']]: micro,
        [styles['Button--puffy']]: puffy,
      },
    );
  };

  if (noLink) {
    return (
      <span className={getClassName()} title={rest.title}>
        {children}
      </span>
    );
  }

  if (href || to) {
    if (href) {
      props.href = href;
      // If this button should be a link we don't want to prefix the URL.
      props.prependClientApp = false;
      props.prependLang = false;
    } else if (to) {
      props.href = to;
    }

    // Only a Link needs a disabled css class. This is because button
    // is styled based on its disabled property.
    props.className = getClassName({ [styles.disabled]: disabled });

    if (disabled) {
      props.onClick = (event) => {
        event.preventDefault();
        log.warn(oneLine`Not calling onClick() for Button link to
            ${href || to} because it is disabled`);
      };
    }
    return <Link {...props}>{children}</Link>;
  }

  return (
    // eslint-disable-next-line react/button-has-type
    <button className={getClassName()} type={htmlType} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  buttonType: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  externalDark: PropTypes.bool,
  href: PropTypes.string,
  htmlType: PropTypes.string,
  micro: PropTypes.bool,
  name: PropTypes.string,
  noLink: PropTypes.bool,
  onClick: PropTypes.func,
  prependClientApp: PropTypes.bool,
  prependLang: PropTypes.bool,
  puffy: PropTypes.bool,
  title: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  target: PropTypes.string,
  type: PropTypes.string,
};
