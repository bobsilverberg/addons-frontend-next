import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { getAddonURL } from 'utils';
import { isRtlLang } from 'i18n/utils_next';
import LoadingText from '../LoadingText';
import { addQueryParams } from 'utils';
import { useI18nState } from 'context/i18n';

import styles from './styles.module.scss';

export default function AddonTitle({
  addon,
  as: Component = 'h1',
  linkToAddon = false,
  queryParamsForAttribution = {},
}) {
  const { i18n } = useI18nState();
  const router = useRouter();
  const { lang } = router.query;

  const isRTL = isRtlLang(lang || '');
  const authors = [];

  if (addon && addon.authors) {
    const addonAuthors = addon.authors;

    // translators: A comma, used in a list of authors: a1, a2, a3.
    const comma = i18n.gettext(',');
    const separator = isRTL ? ` ${comma}` : `${comma} `;

    addonAuthors.forEach((author, index) => {
      authors.push(
        author.url ? (
          <Link key={author.id} href={`/user/${author.id}/`}>
            <a>{author.name}</a>
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
    <Component className={styles.AddonTitle}>
      {addon ? (
        <>
          {linkToAddon ? (
            <Link
              href={addQueryParams(
                getAddonURL(addon.slug),
                queryParamsForAttribution,
              )}
            >
              <a>{addon.name}</a>
            </Link>
          ) : (
            addon.name
          )}
          {authors.length > 0 && (
            <span className={styles['AddonTitle-author']}>
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
}

AddonTitle.propTypes = {
  addon: PropTypes.object,
  as: PropTypes.string,
  linkToAddon: PropTypes.bool,
  queryParamsForAttribution: PropTypes.object,
};
