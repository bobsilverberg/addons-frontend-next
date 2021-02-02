/* @flow */
import makeClassName from 'classnames';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
// import { compose } from 'redux';
import Link from 'next/link';

import {
  addQueryParams,
  getAddonURL,
  getPromotedCategory,
  nl2br,
  sanitizeHTML,
} from '../../utils';
import {
  ADDON_TYPE_STATIC_THEME,
  DEFAULT_UTM_SOURCE,
  DEFAULT_UTM_MEDIUM,
} from '../..constants';
// import translate from 'amo/i18n/translate';
import { getAddonIconUrl, getPreviewImage } from '../../utils/imageUtils';
import Icon from 'amo/components/Icon';
import LoadingText from 'amo/components/LoadingText';
import Rating from 'amo/components/Rating';
import PromotedBadge from 'amo/components/PromotedBadge';

import './styles.modules.scss';

type Props = {|
  addon?: AddonType | CollectionAddonType,
  addonInstallSource?: string,
  onClick?: (addon: AddonType | CollectionAddonType) => void,
  onImpression?: (addon: AddonType | CollectionAddonType) => void,
  showMetadata?: boolean,
  showPromotedBadge?: boolean,
  showSummary?: boolean,
  useThemePlaceholder?: boolean,
|};

type InternalProps = {|
  ...Props,
  _getPromotedCategory: typeof getPromotedCategory,
  clientApp: string,
  history: ReactRouterHistoryType,
  i18n: I18nType,
  lang: string,
|};

export class SearchResultBase extends React.Component<InternalProps> {
  static defaultProps = {
    _getPromotedCategory: getPromotedCategory,
    showMetadata: true,
    showPromotedBadge: true,
    showSummary: true,
    useThemePlaceholder: false,
  };

  getAddonLink(
    addon: AddonType | CollectionAddonType,
    addonInstallSource?: string,
  ) {
    let linkTo = getAddonURL(addon.slug);

    if (addonInstallSource) {
      linkTo = addQueryParams(linkTo, {
        utm_source: DEFAULT_UTM_SOURCE,
        utm_medium: DEFAULT_UTM_MEDIUM,
        utm_content: addonInstallSource,
      });
    }

    return linkTo;
  }

  onClickAddon = (e: SyntheticEvent<HTMLAnchorElement>) => {
    const { addon, onClick } = this.props;

    e.stopPropagation();
    if (addon && onClick) {
      onClick(addon);
    }
  };

  renderResult() {
    const {
      _getPromotedCategory,
      addon,
      addonInstallSource,
      clientApp,
      i18n,
      onImpression,
      showMetadata,
      showPromotedBadge,
      showSummary,
      useThemePlaceholder,
    } = this.props;

    if (addon && onImpression) {
      onImpression(addon);
    }

    const averageDailyUsers = addon ? addon.average_daily_users : null;

    // Fall-back to default icon if invalid icon url.
    const iconURL = getAddonIconUrl(addon);

    let imageURL = iconURL;
    let addonTitle = <LoadingText />;

    if (addon) {
      addonTitle = (
        <Link
          className="SearchResult-link"
          to={this.getAddonLink(addon, addonInstallSource)}
          onClick={this.onClickAddon}
        >
          {addon.name}
        </Link>
      );
    }

    if (addon && addon.type === ADDON_TYPE_STATIC_THEME) {
      imageURL = getPreviewImage(addon);
    }

    // Sets classes to handle fallback if theme preview is not available.
    const iconWrapperClassnames = makeClassName('SearchResult-icon-wrapper', {
      'SearchResult-icon-wrapper--no-theme-image': addon
        ? imageURL === null
        : useThemePlaceholder,
    });

    let addonAuthors = null;
    const addonAuthorsData =
      addon && addon.authors && addon.authors.length ? addon.authors : null;
    if (!addon || addonAuthorsData) {
      // TODO: list all authors.
      // https://github.com/mozilla/addons-frontend/issues/4461
      const author = addonAuthorsData && addonAuthorsData[0];
      addonAuthors = (
        <h3 className="SearchResult-author SearchResult--meta-section">
          {author ? author.name : <LoadingText />}
        </h3>
      );
    }

    let summary = null;
    if (showSummary) {
      const summaryProps = {};
      if (addon) {
        summaryProps.dangerouslySetInnerHTML = sanitizeHTML(addon.summary);
      } else {
        summaryProps.children = <LoadingText />;
      }

      summary = <p className="SearchResult-summary" {...summaryProps} />;
    }

    const promotedCategory = _getPromotedCategory({
      addon,
      clientApp,
      forBadging: true,
    });

    return (
      <div className="SearchResult-wrapper">
        <div className="SearchResult-result">
          <div className={iconWrapperClassnames}>
            {(addon && imageURL) || (!addon && !useThemePlaceholder) ? (
              <img
                className={makeClassName('SearchResult-icon', {
                  'SearchResult-icon--loading': !addon,
                })}
                src={imageURL}
                alt={addon ? `${addon.name}` : ''}
              />
            ) : (
              <p className="SearchResult-notheme">
                {i18n.gettext('No theme preview available')}
              </p>
            )}
          </div>

          <div className="SearchResult-contents">
            <h2 className="SearchResult-name">
              {addonTitle}
              {showPromotedBadge && addon && promotedCategory ? (
                <PromotedBadge
                  category={promotedCategory}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                />
              ) : null}
            </h2>
            {summary}

            {showMetadata ? (
              <div className="SearchResult-metadata">
                <div className="SearchResult-rating">
                  <Rating
                    rating={addon && addon.ratings ? addon.ratings.average : 0}
                    readOnly
                    styleSize="small"
                  />
                </div>
                {addonAuthors}
              </div>
            ) : null}

            {addon && addon.notes && (
              <div className="SearchResult-note">
                <h4 className="SearchResult-note-header">
                  <Icon name="comments-blue" />
                  {i18n.gettext('Add-on note')}
                </h4>
                <p
                  className="SearchResult-note-content"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={sanitizeHTML(nl2br(addon.notes), [
                    'br',
                  ])}
                />
              </div>
            )}
          </div>

          <h3 className="SearchResult-users SearchResult--meta-section">
            <Icon className="SearchResult-users-icon" name="user-fill" />
            <span className="SearchResult-users-text">
              {averageDailyUsers !== null && averageDailyUsers !== undefined ? (
                i18n.sprintf(
                  i18n.ngettext(
                    '%(total)s user',
                    '%(total)s users',
                    averageDailyUsers,
                  ),
                  { total: i18n.formatNumber(averageDailyUsers) },
                )
              ) : (
                <LoadingText width={80} />
              )}
            </span>
          </h3>
        </div>
      </div>
    );
  }

  onClickResult = () => {
    const {
      addon,
      addonInstallSource,
      clientApp,
      history,
      lang,
      onClick,
    } = this.props;

    if (addon) {
      history.push(
        `/${lang}/${clientApp}${this.getAddonLink(addon, addonInstallSource)}`,
      );

      if (onClick) {
        onClick(addon);
      }
    }
  };

  render() {
    const { addon, useThemePlaceholder } = this.props;

    const result = this.renderResult();
    const resultClassnames = makeClassName('SearchResult', {
      'SearchResult--theme': addon
        ? ADDON_TYPE_STATIC_THEME === addon.type
        : useThemePlaceholder,
    });

    return (
      // Note: The link in question is still keyboard accessible because we've
      // added an actual link to the h2 tag.
      // eslint-disable-next-line max-len
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
      <li onClick={this.onClickResult} className={resultClassnames}>
        {result}
      </li>
    );
  }
}

export const mapStateToProps = (state: AppState) => {
  return {
    clientApp: state.api.clientApp,
    lang: state.api.lang,
  };
};

const SearchResult: React.ComponentType<Props> = compose(
  withRouter,
  connect(mapStateToProps),
  translate(),
)(SearchResultBase);

export default SearchResult;
