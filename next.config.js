const addonsServerDevCDN = 'https://addons-dev-cdn.allizom.org';
const addonsServerProdCDN = 'https://addons.cdn.mozilla.net';
const addonsServerStageCDN = 'https://addons-stage-cdn.allizom.org';

const devDomain = 'addons-dev.allizom.org';
const prodDomain = 'addons.mozilla.org';
const stageDomain = 'addons.allizom.org';

const apiDevHost = `https://${devDomain}`;
const apiProdHost = `https://${prodDomain}`;
const apiStageHost = `https://${stageDomain}`;

const baseUrlDev = apiDevHost;
const baseUrlProd = apiProdHost;
const baseUrlStage = apiStageHost;

const sentryHost = 'https://sentry.prod.mozaws.net';
const analyticsHost = 'https://www.google-analytics.com';

const addonsFrontendCDN = 'https://addons-amo.cdn.mozilla.net';

module.exports = {
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    // Supported languages.
    langs: [
      'af',
      'ar',
      'ast',
      'az',
      'bg',
      'bn',
      'bs',
      'ca',
      'cak',
      'cs',
      'da',
      'de',
      'dsb',
      'el',
      'en-CA',
      'en-GB',
      'en-US',
      'es',
      'et',
      'eu',
      'fa',
      'fi',
      'fr',
      'fy-NL',
      'ga-IE',
      'he',
      'hr',
      'hsb',
      'hu',
      'ia',
      'id',
      'it',
      'ja',
      'ka',
      'kab',
      'ko',
      'lt',
      'lv',
      'mk',
      'mn',
      'ms',
      'mt',
      'nb-NO',
      'nl',
      'nn-NO',
      'pa-IN',
      'pl',
      'pt-BR',
      'pt-PT',
      'ro',
      'ru',
      'sk',
      'sl',
      'sq',
      'sv-SE',
      'te',
      'th',
      'tr',
      'uk',
      'ur',
      'vi',
      'zh-CN',
      'zh-TW',
    ],
    // Exclusion list of unsupported locales for alternate links, see:
    // https://github.com/mozilla/addons-frontend/issues/6644
    unsupportedHrefLangs: ['ast', 'cak', 'dsb', 'hsb', 'kab'],
    // Map of locale aliases for "alternate" links, see:
    // https://github.com/mozilla/addons-frontend/issues/6644
    hrefLangsMap: {
      'x-default': 'en-US',
      en: 'en-US',
      pt: 'pt-PT',
    },
    // Map of langs, usually short to longer ones but can also be used to
    // redirect long langs to shorter ones.
    langMap: {
      'bn-BD': 'bn',
      en: 'en-US',
      ga: 'ga-IE',
      pt: 'pt-PT',
      sv: 'sv-SE',
      zh: 'zh-CN',
    },
    rtlLangs: ['ar', 'fa', 'he', 'ur'],
    defaultLang: 'en-US',
    // Some missing moment locales can be mapped to existing ones. Note: moment
    // locales are lowercase and do not use an underscore.
    // See: https://github.com/mozilla/addons-frontend/issues/1515
    momentLangMap: {
      'fy-nl': 'fy',
      'nb-no': 'nb',
      'nn-no': 'nn',
      'pt-pt': 'pt',
      'sv-se': 'sv',
    },
    // The CDN host for AMO.
    amoCDN: addonsServerProdCDN,
    staticHost: addonsFrontendCDN,
    apiHost: apiProdHost,
    apiPath: '/api/',
    apiVersion: 'v5',
    enableFeatureExperienceSurvey: 'true',
  },
};
