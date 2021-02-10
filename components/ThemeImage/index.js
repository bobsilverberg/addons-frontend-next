import makeClassName from 'classnames';
import PropTypes from 'prop-types';
import { useI18nState } from 'context/i18n';
import { getPreviewImage } from 'utils/imageUtils';

import { ADDON_TYPE_STATIC_THEME } from '../../constants';
import styles from './styles.module.scss';

export default function ThemeImage({
  addon,
  roundedCorners = false,
  useStandardSize = true,
}) {
  const { i18n } = useI18nState();

  if (addon && ADDON_TYPE_STATIC_THEME === addon.type) {
    const label = i18n.sprintf(i18n.gettext('Preview of %(title)s'), {
      title: addon.name,
    });

    return (
      <div
        className={makeClassName(styles.ThemeImage, {
          [styles['ThemeImage--rounded-corners']]: roundedCorners,
        })}
        role="presentation"
      >
        <img
          alt={label}
          className={styles['ThemeImage-image']}
          src={getPreviewImage(addon, { useStandardSize })}
        />
      </div>
    );
  }

  return null;
}

ThemeImage.propTypes = {
  addon: PropTypes.object,
  roundedCorners: PropTypes.bool,
  useStandardSize: PropTypes.bool,
};
