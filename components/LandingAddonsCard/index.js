import makeClassName from 'classnames';
import AddonsCard from 'amo/components/AddonsCard';
import Link from 'next/link';
import {
  LANDING_PAGE_EXTENSION_COUNT,
  LANDING_PAGE_THEME_COUNT,
} from '../../constants';
import { convertFiltersToQueryParams } from 'amo/searchUtils';

import './styles.scss';

type Props = {|
  addonInstallSource?: string,
  addons?: Array<AddonType> | null,
  className?: string,
  footerLink?: Object | string | null,
  footerText?: string,
  header?: React.Node,
  isTheme?: boolean,
  loading: boolean,
  placeholderCount: number,
|};

export default class LandingAddonsCard extends React.Component<Props> {
  static defaultProps = {
    placeholderCount: LANDING_PAGE_EXTENSION_COUNT,
  };

  render() {
    const {
      addonInstallSource,
      addons,
      className,
      footerLink,
      footerText,
      header,
      isTheme,
      loading,
      placeholderCount,
    } = this.props;

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
      footerLinkHtml = <Link to={linkTo}>{footerText}</Link>;
    }

    return (
      <AddonsCard
        addonInstallSource={addonInstallSource}
        addons={addons}
        className={makeClassName('LandingAddonsCard', className, {
          'LandingAddonsCard-Themes': isTheme,
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
}