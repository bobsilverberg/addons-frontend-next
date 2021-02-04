import makeClassName from 'classnames';
import Link from 'next/link';
import PropTypes from 'prop-types';
import AddonsCard from 'components/AddonsCard';
import { convertFiltersToQueryParams } from 'utils/searchUtils';

import {
  LANDING_PAGE_EXTENSION_COUNT,
  LANDING_PAGE_THEME_COUNT,
} from '../../constants';
import styles from './styles.module.scss';

export default function LandingAddonsCard({
  addonInstallSource,
  addons,
  className,
  footerLink,
  footerText,
  header,
  isTheme,
  loading,
  placeholderCount = LANDING_PAGE_EXTENSION_COUNT,
}) {
  let footerLinkHtml = null;
  const count = isTheme ? LANDING_PAGE_THEME_COUNT : placeholderCount;
  if (addons && addons.length >= count) {
    let linkTo = footerLink;
    if (linkTo && typeof linkTo === 'object') {
      // As a convenience, fix the query parameter.
      linkTo = {
        ...linkTo,
        query: convertFiltersToQueryParams(linkTo.query),
      };
    }
    footerLinkHtml = (
      <Link href={linkTo}>
        <a>{footerText}</a>
      </Link>
    );
  }

  return (
    <AddonsCard
      addonInstallSource={addonInstallSource}
      addons={addons}
      className={makeClassName(styles.LandingAddonsCard, className, {
        [styles['LandingAddonsCard-Themes']]: isTheme,
      })}
      footerLink={footerLinkHtml}
      header={header}
      showPromotedBadge={false}
      type="horizontal"
      loading={loading}
      placeholderCount={count}
      useThemePlaceholder={isTheme}
    />
  );
}

LandingAddonsCard.propTypes = {
  addonInstallSource: PropTypes.string,
  addons: PropTypes.array,
  className: PropTypes.string,
  footerLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  footerText: PropTypes.string,
  header: PropTypes.node,
  isTheme: PropTypes.bool,
  loading: PropTypes.bool,
  placeholderCount: PropTypes.number,
};
