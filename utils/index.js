import url from 'url';

import invariant from 'invariant';
import getConfig from 'next/config';

// import purify from './purify';
import log from './logger_next';
import { BADGE_CATEGORIES, SPONSORED, VERIFIED } from '../constants';

/* eslint-disable react/prop-types */
// import url from 'url';

// import config from 'config';
// import { AllHtmlEntities } from 'html-entities';
// import invariant from 'invariant';
// import qhistory from 'qhistory';
// import { stringify, parse } from 'qs';

// import {
//   API_ADDON_TYPES_MAPPING,
//   OS_ALL,
//   OS_ANDROID,
//   OS_LINUX,
//   OS_MAC,
//   OS_WINDOWS,
//   VISIBLE_ADDON_TYPES_MAPPING,
// } from 'core/constants';
// import log from 'core/logger';
// import purify from 'core/purify';
// import {
//   USER_AGENT_OS_ANDROID,
//   USER_AGENT_OS_BSD_DRAGONFLY,
//   USER_AGENT_OS_BSD_FREEBSD,
//   USER_AGENT_OS_BSD_NETBSD,
//   USER_AGENT_OS_BSD_OPENBSD,
//   USER_AGENT_OS_BSD_PC,
//   USER_AGENT_OS_LINUX,
//   USER_AGENT_OS_LINUX_ARCH,
//   USER_AGENT_OS_LINUX_CENTOS,
//   USER_AGENT_OS_LINUX_DEBIAN,
//   USER_AGENT_OS_LINUX_FEDORA,
//   USER_AGENT_OS_LINUX_GENTOO,
//   USER_AGENT_OS_LINUX_GNU,
//   USER_AGENT_OS_LINUX_LINPUS,
//   USER_AGENT_OS_LINUX_PC,
//   USER_AGENT_OS_LINUX_REDHAT,
//   USER_AGENT_OS_LINUX_SLACKWARE,
//   USER_AGENT_OS_LINUX_SUSE,
//   USER_AGENT_OS_LINUX_UBUNTU,
//   USER_AGENT_OS_LINUX_VECTOR,
//   USER_AGENT_OS_LINUX_ZENWALK,
//   USER_AGENT_OS_MAC,
//   USER_AGENT_OS_UNIX,
//   USER_AGENT_OS_WINDOWS,
// } from 'core/reducers/api';

// export function getClientConfig(_config) {
//   const clientConfig = {};
//   for (const key of _config.get('clientConfigKeys')) {
//     clientConfig[key] = _config.get(key);
//   }
//   return clientConfig;
// }

// export function convertBoolean(value) {
//   switch (value) {
//     case true:
//     case 1:
//     case '1':
//     case 'true':
//       return true;
//     default:
//       return false;
//   }
// }

// /*
//  * This is a very simplistic check of the user-agent string in order to redirect to
//  * the right set of AMO data.
//  *
//  * More complete UA detection for compatibility will take place elsewhere.
//  *
//  */
// export function getClientApp(userAgentString) {
//   // We are going to return android as the application if it's *any* android browser.
//   // whereas the previous behaviour was to only return 'android' for FF Android.
//   // This way we are showing more relevant content, and if we prompt for the user to download
//   // firefox we can prompt them to download Firefox for Android.
//   if (/android/i.test(userAgentString)) {
//     return 'android';
//   }
//   return 'firefox';
// }

// export function isValidClientApp(value, { _config = config } = {}) {
//   return _config.get('validClientApplications').includes(value);
// }

// export function sanitizeHTML(text, allowTags = [], _purify = purify) {
export function sanitizeHTML(text, allowTags = []) {
  // TODO: Accept tags to allow and run through dom-purify.
  return { __html: text };
}

// // Convert new lines to HTML breaks.
// export function nl2br(text) {
//   return (text || '').replace(/(\r\n|\r|\n)(?!<\/?(li|ul|ol)>)/g, '<br />');
// }

// /*
//  * Sanitizes user inputted HTML, allowing some tags.
//  *
//  * This also converts new lines to breaks (<br />) as a convenience when
//  * users did not write entirely in HTML.
//  *
//  * This is meant to display things like an add-on's description or version
//  * release notes. The allowed tags are meant to match what you see in the
//  * Developer Hub when you hover over the *Some HTML Supported* link under
//  * the textarea field.
//  */
// export function sanitizeUserHTML(text) {
//   return sanitizeHTML(nl2br(text), [
//     'a',
//     'abbr',
//     'acronym',
//     'b',
//     'blockquote',
//     'br',
//     'code',
//     'em',
//     'i',
//     'li',
//     'ol',
//     'strong',
//     'ul',
//   ]);
// }

export function isAddonAuthor({ addon, userId }) {
  if (!addon || !addon.authors || !addon.authors.length || !userId) {
    return false;
  }

  return addon.authors.some((author) => {
    return author.id === userId;
  });
}

// export function isAllowedOrigin(
//   urlString,
//   { allowedOrigins = [config.get('amoCDN')] } = {},
// ) {
//   let parsedURL;
//   try {
//     parsedURL = url.parse(urlString);
//   } catch (e) {
//     log.error(`invalid urlString provided to isAllowedOrigin: ${urlString}`);
//     return false;
//   }

//   return allowedOrigins.includes(`${parsedURL.protocol}//${parsedURL.host}`);
// }

// export function apiAddonTypeIsValid(addonType) {
//   return Object.prototype.hasOwnProperty.call(
//     API_ADDON_TYPES_MAPPING,
//     addonType,
//   );
// }

// export function apiAddonType(addonType) {
//   if (!apiAddonTypeIsValid(addonType)) {
//     throw new Error(`"${addonType}" not found in API_ADDON_TYPES_MAPPING`);
//   }
//   return API_ADDON_TYPES_MAPPING[addonType];
// }

// export function visibleAddonType(addonType) {
//   if (
//     !Object.prototype.hasOwnProperty.call(
//       VISIBLE_ADDON_TYPES_MAPPING,
//       addonType,
//     )
//   ) {
//     throw new Error(`"${addonType}" not found in VISIBLE_ADDON_TYPES_MAPPING`);
//   }
//   return VISIBLE_ADDON_TYPES_MAPPING[addonType];
// }

// export function removeProtocolFromURL(urlWithProtocol) {
//   invariant(urlWithProtocol, 'urlWithProtocol is required');

//   // `//test.com` is a valid, protocol-relative URL which we'll allow.
//   return urlWithProtocol.replace(/^(https?:|)\/\//, '');
// }

// export function isValidLocaleUrlException(value, { _config = config } = {}) {
//   return _config.get('validLocaleUrlExceptions').includes(value);
// }

// export function isValidClientAppUrlException(value, { _config = config } = {}) {
//   return _config.get('validClientAppUrlExceptions').includes(value);
// }

// export function isValidTrailingSlashUrlException(
//   value,
//   { _config = config } = {},
// ) {
//   return _config.get('validTrailingSlashUrlExceptions').includes(value);
// }

// /*
//  * Make sure a callback returns a rejected promise instead of throwing an error.
//  *
//  * If the callback throws an error, a rejected promise will be returned
//  * instead. If the callback runs without an error, its return value is not
//  * altered. In other words, it may or may not return a promise and that's ok.
//  */
// export const safePromise = (callback) => (...args) => {
//   try {
//     return callback(...args);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

export function trimAndAddProtocolToUrl(urlToCheck) {
  let urlToReturn = urlToCheck ? urlToCheck.trim() : null;
  if (urlToReturn && !urlToReturn.match(/^https?:\/\//)) {
    urlToReturn = `http://${urlToReturn}`;
  }
  return urlToReturn;
}

// /*
//  * Decodes HTML entities into their respective symbols.
//  */
// export const decodeHtmlEntities = (string) => {
//   const entities = new AllHtmlEntities();
//   return entities.decode(string);
// };

// /*
//  * Return an ID for a filename.
//  *
//  * This will normalize the representation of a filename on both client and
//  * server. The result may not be a valid filename.
//  *
//  * We need this because the babel polyfill for `__filename` on the client
//  * returns a relative path but `__filename` on the server returns an
//  * absolute path.
//  */
// export const normalizeFileNameId = (filename) => {
//   let fileId = filename;
//   if (!fileId.startsWith('src')) {
//     fileId = fileId.replace(/^.*src/, 'src');
//   }

//   return fileId;
// };

// export const getDisplayName = (component) => {
//   return component.displayName || component.name || 'Component';
// };

// export const addQueryParamsToHistory = ({
//   history,
//   _parse = parse,
//   _stringify = stringify,
// }) => {
//   return qhistory(history, _stringify, _parse);
// };

// export const userAgentOSToPlatform = {
//   [USER_AGENT_OS_ANDROID.toLowerCase()]: OS_ANDROID,
//   [USER_AGENT_OS_MAC.toLowerCase()]: OS_MAC,
//   [USER_AGENT_OS_WINDOWS.toLowerCase()]: OS_WINDOWS,
//   // Not all of these are strictly Linux but giving them a Linux XPI
//   // will probably work 99% of the time.
//   [USER_AGENT_OS_BSD_DRAGONFLY.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_BSD_FREEBSD.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_BSD_NETBSD.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_BSD_OPENBSD.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_BSD_PC.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_ARCH.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_CENTOS.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_DEBIAN.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_FEDORA.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_GENTOO.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_GNU.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_LINPUS.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_PC.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_REDHAT.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_SLACKWARE.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_SUSE.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_UBUNTU.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_VECTOR.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_LINUX_ZENWALK.toLowerCase()]: OS_LINUX,
//   [USER_AGENT_OS_UNIX.toLowerCase()]: OS_LINUX,
// };

// export const findFileForPlatform = ({ userAgentInfo, platformFiles }) => {
//   invariant(userAgentInfo, 'userAgentInfo is required');
//   invariant(platformFiles, 'platformFiles is required');

//   const agentOsName =
//     userAgentInfo.os.name && userAgentInfo.os.name.toLowerCase();
//   const platform = agentOsName && userAgentOSToPlatform[agentOsName];
//   return (platform && platformFiles[platform]) || platformFiles[OS_ALL];
// };

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

// export function sanitizeHTML(text, allowTags, _purify = purify) {
//   // TODO: Accept tags to allow and run through dom-purify.
//   return {
//     __html: _purify.sanitize(text, { ALLOWED_TAGS: allowTags }),
//   };
// }

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
