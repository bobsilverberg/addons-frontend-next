/* @flow */
import makeClassName from 'classnames';
// import invariant from 'invariant';

// import EditableCollectionAddon from 'amo/components/EditableCollectionAddon';
import SearchResult from 'amo/components/SearchResult';
import {
  ADDON_TYPE_STATIC_THEME,
  DEFAULT_API_PAGE_SIZE,
} from '../../constants';
import CardList from '../CardList';

import './styles.scss';

type Props = {|
  addonInstallSource?: string,
  addons?: $ReadOnlyArray<AddonType | CollectionAddonType> | null,
  children?: React.Node,
  className?: string,
  editing?: boolean,
  loading?: boolean,
  useThemePlaceholder?: boolean,
  // When loading, this is the number of placeholders
  // that will be rendered.
  placeholderCount: number,
  type?: 'horizontal' | 'vertical',
  showMetadata?: boolean,
  showPromotedBadge?: boolean,
  showSummary?: boolean,

  // These are all passed through to Card.
  footer?: React.Node,
  footerLink?: Object | string | null,
  footerText?: string,
  header?: React.Node,

  // These are passed through to EditableCollectionAddon.
  deleteNote?: DeleteAddonNoteFunc,
  removeAddon?: RemoveCollectionAddonFunc,
  saveNote?: SaveAddonNoteFunc,

  // These are passed through to SearchResult.
  onAddonClick?: (addon: AddonType | CollectionAddonType) => void,
  onAddonImpression?: (addon: AddonType | CollectionAddonType) => void,
|};

export default class AddonsCard extends React.Component<Props> {
  static defaultProps = {
    editing: false,
    loading: false,
    placeholderCount: DEFAULT_API_PAGE_SIZE,
    showPromotedBadge: true,
    useThemePlaceholder: false,
  };

  render() {
    const {
      addonInstallSource,
      addons,
      children,
      className,
      deleteNote,
      editing,
      loading,
      removeAddon,
      saveNote,
      onAddonClick,
      onAddonImpression,
      placeholderCount,
      useThemePlaceholder,
      showMetadata,
      showPromotedBadge,
      showSummary,
      type,
      ...otherProps
    } = this.props;

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
          addonElements.push(
            <EditableCollectionAddon
              addon={addon}
              deleteNote={deleteNote}
              key={addon.slug}
              removeAddon={removeAddon}
              saveNote={saveNote}
            />,
          );
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
          <SearchResult
            key={count}
            useThemePlaceholder={useThemePlaceholder}
          />,
        );
      }
    }

    const allClassNames = makeClassName(
      'AddonsCard',
      className,
      type && `AddonsCard--${type}`,
    );
    return (
      <CardList {...otherProps} className={allClassNames}>
        {children}
        {addonElements.length ? (
          <ul className="AddonsCard-list">{addonElements}</ul>
        ) : null}
      </CardList>
    );
  }
}