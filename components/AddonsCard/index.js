/* @flow */
import makeClassName from 'classnames';
import invariant from 'invariant';
import PropTypes from 'prop-types';

// import EditableCollectionAddon from 'amo/components/EditableCollectionAddon';
import SearchResult from '../SearchResult';
import {
  ADDON_TYPE_STATIC_THEME,
  DEFAULT_API_PAGE_SIZE,
} from '../../constants';
import CardList from '../CardList';
import styles from './styles.module.scss';

export default function AddonsCard({
  addonInstallSource,
  addons,
  children,
  className,
  deleteNote,
  editing = false,
  footer,
  footerLink,
  footerText,
  header,
  loading = false,
  removeAddon,
  saveNote,
  onAddonClick,
  onAddonImpression,
  placeholderCount = DEFAULT_API_PAGE_SIZE,
  showMetadata,
  showPromotedBadge = true,
  showSummary,
  type,
  useThemePlaceholder = false,
  ...otherProps
}) {
  const addonElements = [];

  if (addons && addons.length) {
    addons.forEach((addon) => {
      // Because a static theme is technically an extension, it has a summary
      // field, but we want it to look like a theme, which does not display
      // any summary or description.
      if (editing) {
        invariant(deleteNote, 'deleteNote() is undefined');
        invariant(removeAddon, 'removeAddon() is undefined');
        invariant(saveNote, 'saveNote() is undefined');
        // addonElements.push(
        //   <EditableCollectionAddon
        //     addon={addon}
        //     deleteNote={deleteNote}
        //     key={addon.slug}
        //     removeAddon={removeAddon}
        //     saveNote={saveNote}
        //   />,
        // );
      } else {
        addonElements.push(
          <SearchResult
            addonInstallSource={addonInstallSource}
            addon={addon}
            key={`${addon.slug}-${addon.type}`}
            onClick={onAddonClick}
            onImpression={onAddonImpression}
            showMetadata={showMetadata}
            showPromotedBadge={showPromotedBadge}
            showSummary={
              ADDON_TYPE_STATIC_THEME !== addon.type ? showSummary : false
            }
          />,
        );
      }
    });
  } else if (loading) {
    for (let count = 0; count < placeholderCount; count++) {
      addonElements.push(
        <SearchResult key={count} useThemePlaceholder={useThemePlaceholder} />,
      );
    }
  }

  const allClassNames = makeClassName(
    styles.AddonsCard,
    className,
    type && styles[`AddonsCard--${type}`],
  );
  return (
    <CardList {...otherProps} className={allClassNames}>
      {children}
      {addonElements.length ? (
        <ul className={styles['AddonsCard-list']}>{addonElements}</ul>
      ) : null}
    </CardList>
  );
}

// Add propTypes
AddonsCard.propTypes = {
  addonInstallSource: PropTypes.string,
  addons: PropTypes.array,
  children: PropTypes.node,
  className: PropTypes.string,
  editing: PropTypes.bool,
  loading: PropTypes.bool,
  useThemePlaceholder: PropTypes.bool,
  // When loading, this is the number of placeholders
  // that will be rendered.
  placeholderCount: PropTypes.number,
  type: PropTypes.string,
  showMetadata: PropTypes.bool,
  showPromotedBadge: PropTypes.bool,
  showSummary: PropTypes.bool,
  // These are all passed through to Card.
  footer: PropTypes.node,
  footerLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  footerText: PropTypes.string,
  header: PropTypes.node,
  // These are passed through to EditableCollectionAddon.
  deleteNote: PropTypes.func,
  removeAddon: PropTypes.func,
  saveNote: PropTypes.func,
  // These are passed through to SearchResult.
  onAddonClick: PropTypes.func,
  onAddonImpression: PropTypes.func,
};
