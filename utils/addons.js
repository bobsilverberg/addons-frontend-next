import { selectLocalizedContent } from '.';

export const createInternalPreviews = (previews, lang) => {
  return previews.map((preview) => ({
    h: preview.image_size[1],
    src: preview.image_url,
    thumbnail_h: preview.thumbnail_size[1],
    thumbnail_src: preview.thumbnail_url,
    thumbnail_w: preview.thumbnail_size[0],
    title: selectLocalizedContent(preview.caption, lang),
    w: preview.image_size[0],
  }));
};

export const selectLocalizedUrlWithOutgoing = (url, lang) => {
  if (url && url.url && url.outgoing) {
    return {
      url: selectLocalizedContent(url.url, lang),
      outgoing: selectLocalizedContent(url.outgoing, lang),
    };
  }

  return null;
};

export const createInternalAddon = (apiAddon, lang) => {
  const addon = {
    authors: apiAddon.authors,
    average_daily_users: apiAddon.average_daily_users,
    categories: apiAddon.categories,
    contributions_url: apiAddon.contributions_url,
    created: apiAddon.created,
    default_locale: apiAddon.default_locale,
    description: selectLocalizedContent(apiAddon.description, lang),
    developer_comments: selectLocalizedContent(
      apiAddon.developer_comments,
      lang,
    ),
    edit_url: apiAddon.edit_url,
    guid: apiAddon.guid,
    has_eula: apiAddon.has_eula,
    has_privacy_policy: apiAddon.has_privacy_policy,
    homepage: selectLocalizedUrlWithOutgoing(apiAddon.homepage, lang),
    icon_url: apiAddon.icon_url,
    id: apiAddon.id,
    is_disabled: apiAddon.is_disabled,
    is_experimental: apiAddon.is_experimental,
    // This no longer seems to exist
    // is_source_public: apiAddon.is_source_public,
    last_updated: apiAddon.last_updated,
    latest_unlisted_version: apiAddon.latest_unlisted_version || null,
    // This no longer seems to exist
    // locale_disambiguation: apiAddon.locale_disambiguation,
    name: selectLocalizedContent(apiAddon.name, lang),
    previews: apiAddon.previews
      ? createInternalPreviews(apiAddon.previews, lang)
      : undefined,
    promoted: apiAddon.promoted,
    ratings: apiAddon.ratings,
    requires_payment: apiAddon.requires_payment,
    review_url: apiAddon.review_url,
    slug: apiAddon.slug,
    status: apiAddon.status,
    summary: selectLocalizedContent(apiAddon.summary, lang),
    support_email: selectLocalizedContent(apiAddon.support_email, lang),
    support_url: selectLocalizedUrlWithOutgoing(apiAddon.support_url, lang),
    tags: apiAddon.tags,
    target_locale: apiAddon.target_locale || null,
    type: apiAddon.type,
    url: apiAddon.url,
    weekly_downloads: apiAddon.weekly_downloads,

    // These are custom properties not in the API response.
    currentVersionId: apiAddon.current_version
      ? apiAddon.current_version.id
      : null,
    isRestartRequired: false,
    isWebExtension: false,
    isMozillaSignedExtension: false,
  };

  const currentVersion = apiAddon.current_version;

  if (
    currentVersion &&
    currentVersion.files &&
    currentVersion.files.length > 0
  ) {
    addon.isRestartRequired = currentVersion.files.some(
      (file) => !!file.is_restart_required,
    );
    // The following checks are a bit fragile since only one file needs
    // to contain the flag. However, it is highly unlikely to create an
    // add-on with mismatched file flags in the current DevHub.
    addon.isWebExtension = currentVersion.files.some(
      (file) => !!file.is_webextension,
    );
    addon.isMozillaSignedExtension = currentVersion.files.some(
      (file) => !!file.is_mozilla_signed_extension,
    );
  }

  return addon;
};

export const createInternalShelf = (shelf, lang) => {
  return {
    ...shelf,
    addons: shelf.addons.map((addon) => createInternalAddon(addon, lang)),
  };
};
