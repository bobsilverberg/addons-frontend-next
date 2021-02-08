/* global navigator, window */
import { oneLine } from 'common-tags';
import invariant from 'invariant';

import {
  ADDON_TYPE_DICT,
  ADDON_TYPE_EXTENSION,
  ADDON_TYPE_LANG,
  ADDON_TYPE_STATIC_THEME,
  ENABLE_ACTION,
  ENABLE_EXTENSION_CATEGORY,
  ENABLE_THEME_CATEGORY,
  INSTALL_CANCELLED_ACTION,
  INSTALL_CANCELLED_EXTENSION_CATEGORY,
  INSTALL_CANCELLED_THEME_CATEGORY,
  INSTALL_DOWNLOAD_FAILED_ACTION,
  INSTALL_DOWNLOAD_FAILED_EXTENSION_CATEGORY,
  INSTALL_DOWNLOAD_FAILED_THEME_CATEGORY,
  INSTALL_EXTENSION_CATEGORY,
  INSTALL_STARTED_ACTION,
  INSTALL_STARTED_EXTENSION_CATEGORY,
  INSTALL_STARTED_THEME_CATEGORY,
  INSTALL_THEME_CATEGORY,
  TRACKING_TYPE_EXTENSION,
  TRACKING_TYPE_INVALID,
  TRACKING_TYPE_STATIC_THEME,
  UNINSTALL_ACTION,
  UNINSTALL_EXTENSION_CATEGORY,
  UNINSTALL_THEME_CATEGORY,
} from '../constants';
import log from './logger_next';

import { configGetPulic, convertBoolean } from './index';

export function isDoNotTrackEnabled({
  _navigator = typeof navigator !== 'undefined' ? navigator : null,
  _window = typeof window !== 'undefined' ? window : null,
} = {}) {
  if (!_navigator || !_window) {
    return false;
  }

  // We ignore things like `msDoNotTrack` because they are for older,
  // unsupported browsers and don't really respect the DNT spec. This
  // covers new versions of IE/Edge, Firefox from 32+, Chrome, Safari, and
  // any browsers built on these stacks (Chromium, Tor Browser, etc.).
  const dnt = _navigator.doNotTrack || _window.doNotTrack;
  if (dnt === '1') {
    log.info('Do Not Track is enabled');
    return true;
  }

  // Known DNT values not set, so we will assume it's off.
  return false;
}

export class Tracking {
  logPrefix;

  trackingEnabled;

  // Tracking ID
  id;

  constructor({ _isDoNotTrackEnabled = isDoNotTrackEnabled, _log = log } = {}) {
    if (typeof window === 'undefined') {
      return;
    }

    this._log = _log;
    this.logPrefix = '[GA]'; // this gets updated below
    this.id = configGetPulic('trackingId');

    if (!convertBoolean(configGetPulic('trackingEnabled'))) {
      this.log('GA disabled because trackingEnabled was false');
      this.trackingEnabled = false;
    } else if (!this.id) {
      this.log('GA Disabled because trackingId was empty');
      this.trackingEnabled = false;
    } else if (_isDoNotTrackEnabled()) {
      this.log(oneLine`Do Not Track Enabled; Google Analytics not
        loaded and tracking disabled`);
      this.trackingEnabled = false;
    } else {
      this.log('Google Analytics is enabled');
      this.trackingEnabled = true;
    }

    this.logPrefix = `[GA: ${this.trackingEnabled ? 'ON' : 'OFF'}]`;

    if (this.trackingEnabled) {
      /* eslint-disable */
      // Snippet from Google UA docs: http://bit.ly/1O6Dsdh
      window.ga =
        window.ga ||
        function () {
          (ga.q = ga.q || []).push(arguments);
        };
      ga.l = +new Date();
      /* eslint-enable */
      ga('create', this.id, 'auto');
      ga('set', 'transport', 'beacon');
      if (convertBoolean(configGetPulic('trackingSendInitPageView'))) {
        ga('send', 'pageview');
      }
      // Set a custom dimension; this allows us to tell which front-end
      // (addons-frontend vs addons-server) is being used in analytics.
      ga('set', 'dimension3', 'addons-frontend');
    }
  }

  log(message, obj) {
    if (this._log) {
      const pattern = typeof obj === 'undefined' ? '%s %s' : '%s %s: %o';
      // eslint-disable-next-line amo/only-log-strings
      this._log.info(pattern, this.logPrefix, message, obj);
    }
  }

  _ga(...args) {
    if (this.trackingEnabled) {
      window.ga(...args);
    }
  }

  /*
   * Param          Type    Required  Description
   * obj.category   String  Yes       Typically the object that
   *                                  was interacted with (e.g. button)
   * obj.action     String  Yes       The type of interaction (e.g. click)
   * obj.label      String  No        Useful for categorizing events
   *                                  (e.g. nav buttons)
   * obj.value      Number  No        Values must be non-negative.
   *                                  Useful to pass counts (e.g. 4 times)
   */
  sendEvent({ category, action, label, value } = {}) {
    if (!category) {
      throw new Error('sendEvent: category is required');
    }
    if (!action) {
      throw new Error('sendEvent: action is required');
    }
    const data = {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    };
    this._ga('send', data);
    this.log('sendEvent', data);
  }

  /*
   * Should be called when a view changes or a routing update.
   */
  setPage(page) {
    if (!page) {
      throw new Error('setPage: page is required');
    }
    this._ga('set', 'page', page);
    this.log('setPage', page);
  }

  pageView(data) {
    // See: https://developers.google.com/analytics/devguides/collection/analyticsjs/pages#pageview_fields
    this._ga('send', { hitType: 'pageview', ...data });
    this.log('pageView', data);
  }

  /*
   * Can be called to set a dimension which will be sent with all subsequent
   * calls to GA.
   */
  setDimension({ dimension, value }) {
    invariant(dimension, 'A dimension is required');
    invariant(value, 'A value is required');

    this._ga('set', dimension, value);
    this.log('set', { dimension, value });
  }
}

export function getAddonTypeForTracking(type) {
  return (
    {
      [ADDON_TYPE_DICT]: TRACKING_TYPE_EXTENSION,
      [ADDON_TYPE_EXTENSION]: TRACKING_TYPE_EXTENSION,
      [ADDON_TYPE_LANG]: TRACKING_TYPE_EXTENSION,
      [ADDON_TYPE_STATIC_THEME]: TRACKING_TYPE_STATIC_THEME,
    }[type] || TRACKING_TYPE_INVALID
  );
}

export const getAddonEventCategory = (type, installAction) => {
  const isThemeType = ADDON_TYPE_STATIC_THEME === type;

  switch (installAction) {
    case ENABLE_ACTION:
      return isThemeType ? ENABLE_THEME_CATEGORY : ENABLE_EXTENSION_CATEGORY;
    case INSTALL_CANCELLED_ACTION:
      return isThemeType
        ? INSTALL_CANCELLED_THEME_CATEGORY
        : INSTALL_CANCELLED_EXTENSION_CATEGORY;
    case INSTALL_DOWNLOAD_FAILED_ACTION:
      return isThemeType
        ? INSTALL_DOWNLOAD_FAILED_THEME_CATEGORY
        : INSTALL_DOWNLOAD_FAILED_EXTENSION_CATEGORY;
    case INSTALL_STARTED_ACTION:
      return isThemeType
        ? INSTALL_STARTED_THEME_CATEGORY
        : INSTALL_STARTED_EXTENSION_CATEGORY;
    case UNINSTALL_ACTION:
      return isThemeType
        ? UNINSTALL_THEME_CATEGORY
        : UNINSTALL_EXTENSION_CATEGORY;
    default:
      return isThemeType ? INSTALL_THEME_CATEGORY : INSTALL_EXTENSION_CATEGORY;
  }
};

export const sendBeacon = ({
  _isDoNotTrackEnabled = isDoNotTrackEnabled,
  _log = log,
  _navigator = typeof navigator !== 'undefined' ? navigator : null,
  urlString,
  data,
}) => {
  if (_isDoNotTrackEnabled()) {
    _log.debug('Do Not Track Enabled; Not sending a beacon.');
    return;
  }

  if (_navigator && _navigator.sendBeacon) {
    _navigator.sendBeacon(urlString, data);
    _log.debug(`Sending beacon to ${urlString}`);
  } else {
    _log.warn('navigator does not exist. Not sending a beacon.');
  }
};

export const formatDataForBeacon = ({ data, key, type }) => {
  const formData = new FormData();
  formData.append(key, data);
  if (type) {
    formData.append('type', type);
  }
  return formData;
};

export default new Tracking();
