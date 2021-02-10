import Link from 'next/link';
import { getAddonURL } from 'utils';
import { isRtlLang } from 'i18n/utils_next';
import LoadingText from '../LoadingText';
import { addQueryParams } from 'utils';

import styles from './styles.module.scss';

type Props = {|
  addon: AddonType | null,
  as?: string,
  linkToAddon?: boolean,
  queryParamsForAttribution?: { [name: string]: string },
|};

type InternalProps = {|
  ...Props,
  i18n: I18nType,
  isRTL: boolean,
|};

export const AddonTitleBase = ({
  addon,
  as: Component = 'h1',
  i18n,
  isRTL,
  linkToAddon = false,
  queryParamsForAttribution = {},
}: InternalProps) => {
  const authors = [];

  if (addon && addon.authors) {
    const addonAuthors = addon.authors;

    // translators: A comma, used in a list of authors: a1, a2, a3.
    const comma = i18n.gettext(',');
    const separator = isRTL ? ` ${comma}` : `${comma} `;

    addonAuthors.forEach((author, index) => {
      authors.push(
        author.url ? (
          <Link key={author.id} to={`/user/${author.id}/`}>
            {author.name}
          </Link>
        ) : (
          author.name
        ),
      );

      if (index + 1 < addonAuthors.length) {
        authors.push(separator);
      }
    });
  }

  return (
    <Component className="AddonTitle">
      {addon ? (
        <>
          {linkToAddon ? (
            <Link
              to={addQueryParams(
                getAddonURL(addon.slug),
                queryParamsForAttribution,
              )}
            >
              {addon.name}
            </Link>
          ) : (
            addon.name
          )}
          {authors.length > 0 && (
            <span className="AddonTitle-author">
              {' '}
              {isRTL ? (
                <>
                  {authors}{' '}
                  {
                    // translators: Example: add-on "by" some authors
                    i18n.gettext('by')
                  }
                </>
              ) : (
                <>
                  {i18n.gettext('by')} {authors}
                </>
              )}
            </span>
          )}
        </>
      ) : (
        <LoadingText width={80} />
      )}
    </Component>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isRTL: isRtlLang(state.api.lang || ''),
  };
};

const AddonTitle: React.ComponentType<Props> = compose(
  translate(),
  connect(mapStateToProps),
)(AddonTitleBase);

export default AddonTitle;