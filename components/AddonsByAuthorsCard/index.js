import makeClassName from 'classnames';
import deepEqual from 'deep-eql';
import invariant from 'invariant';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import AddonsCard from '../AddonsCard';
import LoadingText from '../LoadingText';
// import Paginate from '../Paginate';
// import {
//   fetchAddonsByAuthors,
//   getAddonsForAuthorIds,
//   getCountForAuthorIds,
//   getLoadingForAuthorIds,
// } from 'amo/reducers/addonsByAuthors';
// import Paginate from 'amo/components/Paginate';
import {
  ADDON_TYPE_DICT,
  ADDON_TYPE_EXTENSION,
  ADDON_TYPE_LANG,
  ADDON_TYPE_STATIC_THEME,
  SEARCH_SORT_POPULAR,
} from '../../constants';
import { createInternalAddon } from 'utils/addons';
// import { withErrorHandler } from 'amo/errorHandler';
import styles from './styles.module.scss';
import { useI18nState } from 'context/i18n';
import { useGlobalState } from 'context/global';

export default function AddonsByAuthorsCard({
  addonType,
  authorDisplayName,
  authorIds,
  className,
  count,
  forAddonSlug,
  numberOfAddons,
  page,
  pageParam = 'page',
  paginate = false,
  pathname,
  showMore = true,
  showSummary = false,
  type = 'horizontal',
}) {
  if (!authorIds) {
    return null;
  }

  const { setNumberOfAddonsByAuthors } = useGlobalState();
  const { i18n } = useI18nState();
  const router = useRouter();
  const { lang } = router.query;

  function getCurrentPage() {
    // We don't want to set a `page` when there is no pagination.
    if (!paginate) {
      return undefined;
    }

    const currentPage = parseInt(router.query[pageParam], 10);

    return Number.isNaN(currentPage) || currentPage < 1
      ? '1'
      : currentPage.toString();
  }

  function useAddons() {
    const params = {
      page: undefined,
      sort: undefined,
    };

    if (paginate) {
      invariant(page, 'page is required when paginate is `true`.');

      params.page = getCurrentPage({ paginate, pageParam });
      params.sort = SEARCH_SORT_POPULAR;
    }

    // TODO: Code to covert params to a querystring
    const { data, error } = useSWR(
      `https://addons-dev.allizom.org/api/v5/addons/search/?app=firefox&appversion=85.0&author=${authorIds}&exclude_addons=${forAddonSlug}&page=1&page_size=${numberOfAddons}&sort=hotness&type=${addonType}&lang=en-US`,
    );

    return {
      addons: data
        ? data.results.map((addon) => createInternalAddon(addon, lang))
        : null,
      isLoading: !error && !data,
      isError: error,
    };
  }

  const { addons, isLoading, isError } = useAddons();

  useEffect(() => {
    // Store the number of add-ons in global state so the add-on detail page can
    // access it.
    if (addons) {
      setNumberOfAddonsByAuthors(addons.length);
    }
  }, [addons]);

  if (!isLoading && (!addons || !addons.length)) {
    return null;
  }

  let header = <LoadingText />;
  if (authorIds) {
    switch (addonType) {
      case ADDON_TYPE_DICT:
        header = showMore
          ? i18n.ngettext(
              i18n.sprintf(i18n.gettext('More dictionaries by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('More dictionaries by these translators'),
              authorIds.length,
            )
          : i18n.ngettext(
              i18n.sprintf(i18n.gettext('Dictionaries by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('Dictionaries by these translators'),
              authorIds.length,
            );
        break;
      case ADDON_TYPE_EXTENSION:
        header = showMore
          ? i18n.ngettext(
              i18n.sprintf(i18n.gettext('More extensions by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('More extensions by these developers'),
              authorIds.length,
            )
          : i18n.ngettext(
              i18n.sprintf(i18n.gettext('Extensions by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('Extensions by these developers'),
              authorIds.length,
            );
        break;
      case ADDON_TYPE_LANG:
        header = showMore
          ? i18n.ngettext(
              i18n.sprintf(i18n.gettext('More language packs by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('More language packs by these translators'),
              authorIds.length,
            )
          : i18n.ngettext(
              i18n.sprintf(i18n.gettext('Language packs by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('Language packs by these translators'),
              authorIds.length,
            );
        break;
      case ADDON_TYPE_STATIC_THEME:
        header = showMore
          ? i18n.ngettext(
              i18n.sprintf(i18n.gettext('More themes by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('More themes by these artists'),
              authorIds.length,
            )
          : i18n.ngettext(
              i18n.sprintf(i18n.gettext('Themes by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('Themes by these artists'),
              authorIds.length,
            );
        break;
      default:
        header = showMore
          ? i18n.ngettext(
              i18n.sprintf(i18n.gettext('More add-ons by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('More add-ons by these developers'),
              authorIds.length,
            )
          : i18n.ngettext(
              i18n.sprintf(i18n.gettext('Add-ons by %(author)s'), {
                author: authorDisplayName,
              }),
              i18n.gettext('Add-ons by these developers'),
              authorIds.length,
            );
    }

    const classnames = makeClassName(styles.AddonsByAuthorsCard, className, {
      [styles['AddonsByAuthorsCard--theme']]:
        ADDON_TYPE_STATIC_THEME === addonType,
    });

    let paginator = null;

    // if (paginate) {
    //   invariant(pathname, 'pathname is required when paginate is `true`.');

    //   const currentPage = getCurrentPage({
    //     paginate,
    //     pageParam,
    //   });

    //   paginator =
    //     count && count > numberOfAddons ? (
    //       <Paginate
    //         LinkComponent={Link}
    //         count={count}
    //         currentPage={currentPage}
    //         pageParam={pageParam}
    //         pathname={pathname}
    //         perPage={numberOfAddons}
    //         queryParams={router.query}
    //       />
    //     ) : null;
    // }

    console.log('---- in AddonsByAuthorsCard, returning AddonsCard...');
    return (
      <AddonsCard
        addons={addons}
        className={classnames}
        footer={paginator}
        header={header}
        loading={isLoading}
        placeholderCount={numberOfAddons}
        showMetadata
        showSummary={showSummary}
        type={type}
      />
    );
  }
}

// Add propTypes
//
// type Props = {|
//     addonType?: string,
//     authorDisplayName: string | null,
//     authorIds: Array<number> | null,
//     className?: string,
//     errorHandler?: ErrorHandlerType,
//     forAddonSlug?: string,
//     numberOfAddons: number,
//     pageParam: string,
//     paginate: boolean,
//     pathname?: string,
//     showMore?: boolean,

//     // AddonsCard accepts these props which are drilled in.
//     showSummary?: boolean,
//     type?: 'horizontal' | 'vertical',
//   |};

//   type InternalProps = {|
//     ...Props,
//     addons: Array<AddonType> | null,
//     count: number | null,
//     dispatch: DispatchFunc,
//     i18n: I18nType,
//     loading: boolean | null,
//     location: ReactRouterLocationType,
//   |};
