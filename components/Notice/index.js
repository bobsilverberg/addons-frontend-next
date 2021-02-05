import makeClassName from 'classnames';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { useI18nState } from '../../context/i18n';
import Button from '../Button';
import IconXMark from '../IconXMark';
import styles from './styles.module.scss';

export const errorType = 'error';
export const genericType = 'generic';
export const genericWarningType = 'genericWarning';
export const firefoxRequiredType = 'firefox';
export const successType = 'success';
export const warningInfoType = 'warningInfo';
export const warningType = 'warning';

const validTypes = [
  errorType,
  genericType,
  genericWarningType,
  firefoxRequiredType,
  successType,
  warningInfoType,
  warningType,
];

/*
 * A Photon style notification bar.
 *
 * See https://design.firefox.com/photon/components/message-bars.html
 */
export default function Notice({
      actionHref,
      actionOnClick,
      actionTarget,
      actionText,
      actionTo,
      againstGrey20,
      children,
      className,
      dismissible,
      light,
  onDismiss,
      type,
}) {
    invariant(validTypes.includes(type), `Unknown type: ${type}`);
  const { i18n } = useI18nState();
  const [wasDismissed, setWasDismissed] = useState(false);

  const onDismissNotice = (event) => {
    setWasDismissed(true);
    if (onDismiss) {
      onDismiss(event);
    }
  };

  if (dismissible && wasDismissed) {
      return null;
    }

    const buttonProps = {
      href: actionHref || undefined,
      onClick: actionOnClick || undefined,
      to: actionTo || undefined,
    };

    let actionButton;
    if (Object.values(buttonProps).some((val) => val !== undefined)) {
      invariant(
        actionText,
        'When specifying an action button, actionText is required',
      );
      actionButton = (
        <Button
        className={styles['Notice-button']}
          micro
          target={actionTarget}
          {...buttonProps}
        >
          {actionText}
        </Button>
      );
    }

  const finalClass = makeClassName(
    styles.Notice,
    styles[`Notice-${type}`],
    styles[className],
    {
      [styles['Notice-againstGrey20']]: againstGrey20,
      [styles['Notice-dismissible']]: dismissible,
      [styles['Notice-light']]: light,
    },
  );
    return (
      <div className={finalClass}>
      <div className={styles['Notice-icon']} />
      <div className={styles['Notice-column']}>
        <div className={styles['Notice-content']}>
          <p className={styles['Notice-text']}>{children}</p>
            {actionButton}
          </div>
        </div>
        {dismissible && (
        <div className={styles['Notice-dismisser']}>
            <Button
            className={styles['Notice-dismisser-button']}
            onClick={onDismissNotice}
            >
              <IconXMark
              className={styles['Notice-dismisser-icon']}
                alt={i18n.gettext('Dismiss this notice')}
              />
            </Button>
          </div>
        )}
      </div>
    );
  }

Notice.propTypes = {
  actionHref: PropTypes.string,
  actionOnClick: PropTypes.func,
  // This will be passed to Button and then <a>, e.g. target=_blank
  actionTarget: PropTypes.string,
  actionText: PropTypes.string,
  actionTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // This declares that the Notice component will be rendered against
  // a $grey-20 background.
  againstGrey20: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  id: PropTypes.string,
  light: PropTypes.bool,
  onDismiss: PropTypes.func,
  type: PropTypes.string,
};
