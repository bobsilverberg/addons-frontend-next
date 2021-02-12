import url from 'url';

import invariant from 'invariant';
import getConfig from 'next/config';

// import purify from './purify';
import log from './logger_next';
import { BADGE_CATEGORIES, SPONSORED, VERIFIED } from '../constants';

// export function sanitizeHTML(text, allowTags = [], _purify = purify) {
export function sanitizeHTML(text, allowTags = []) {
  // TODO: Accept tags to allow and run through dom-purify.
  return { __html: text };
}

export function isAddonAuthor({ addon, userId }) {
  if (!addon || !addon.authors || !addon.authors.length || !userId) {
    return false;
  }

  return addon.authors.some((author) => {
    return author.id === userId;
  });
}

export function trimAndAddProtocolToUrl(urlToCheck) {
  let urlToReturn = urlToCheck ? urlToCheck.trim() : null;
  if (urlToReturn && !urlToReturn.match(/^https?:\/\//)) {
    urlToReturn = `http://${urlToReturn}`;
  }
  return urlToReturn;
}

export const configGetPulic = (key) => {
  const { publicRuntimeConfig } = getConfig();
  if (key in publicRuntimeConfig) {
    return publicRuntimeConfig[key];
  }
  return undefined;
};

export function getAddonURL({ clientApp, lang, slug }) {
  return `/${lang}/${clientApp}/addon/${slug}/`;
}

// Convert new lines to HTML breaks.
export function nl2br(text) {
  return (text || '').replace(/(\r\n|\r|\n)(?!<\/?(li|ul|ol)>)/g, '<br />');
}

export function isAllowedOrigin(urlString, { allowedOrigins } = {}) {
  const allowed =
    allowedOrigins !== undefined ? allowedOrigins : configGetPulic('amoCDN');

  let parsedURL;
  try {
    parsedURL = url.parse(urlString);
  } catch (e) {
    log.error(`invalid urlString provided to isAllowedOrigin: ${urlString}`);
    return false;
  }

  return allowed.includes(
    `${parsedURL.protocol || ''}//${parsedURL.host || ''}`,
  );
}

export const getPromotedCategory = ({
  addon,
  clientApp,
  forBadging = false,
}) => {
  let category = null;
  if (addon && addon.promoted && addon.promoted.apps.includes(clientApp)) {
    category = addon.promoted.category;
  }

  // Special logic if we're using the category for badging.
  if (forBadging) {
    // SPONSORED is badged as VERIFIED.
    if (category === SPONSORED) {
      category = VERIFIED;
    }

    // We only have badges for certain categories.
    if (!BADGE_CATEGORIES.includes(category)) {
      category = null;
    }
  }

  return category;
};

export function removeUndefinedProps(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] !== 'undefined') {
      newObject[key] = object[key];
    }
  });
  return newObject;
}

/**
 * Returns a new URL with query params appended to `urlString`.
 *
 * Note: undefined query parameters will be omitted.
 */
export function addQueryParams(urlString, queryParams = {}) {
  const urlObj = url.parse(urlString, true);
  // Clear search, since query object will only be used if search property
  // doesn't exist.
  urlObj.search = null;
  // $FlowFixMe: I'm not sure why Flow won't accept this.
  urlObj.query = removeUndefinedProps({
    ...urlObj.query,
    ...queryParams,
  });

  return url.format(urlObj);
}

export const selectLocalizedContent = (field, lang) => {
  invariant(lang, 'lang must not be empty');
  if (!field) {
    return null;
  }

  if (!field[lang]) {
    return field[field._default];
  }

  return field[lang];
};

export function convertBoolean(value) {
  switch (value) {
    case true:
    case 1:
    case '1':
    case 'true':
      return true;
    default:
      return false;
  }
}

export function getQueryParametersForAttribution(router) {
  return {
    utm_campaign: router.query.utm_campaign,
    utm_content: router.query.utm_content,
    utm_medium: router.query.utm_medium,
    utm_source: router.query.utm_source,
  };
}
