export const LANDING_PAGE_EXTENSION_COUNT = 4;
export const LANDING_PAGE_THEME_COUNT = 3;

// Client App types
export const CLIENT_APP_ANDROID = 'android';
export const CLIENT_APP_FIREFOX = 'firefox';

// Add-on types
export const ADDON_TYPE_DICT = 'dictionary';
export const ADDON_TYPE_EXTENSION = 'extension';
export const ADDON_TYPE_LANG = 'language';
export const ADDON_TYPE_STATIC_THEME = 'statictheme';

export const DEFAULT_API_PAGE_SIZE = 25;

export const DEFAULT_UTM_SOURCE = 'addons.mozilla.org';
export const DEFAULT_UTM_MEDIUM = 'referral';

// Promoted categories
export const LINE = 'line';
export const RECOMMENDED = 'recommended';
export const SPONSORED = 'sponsored';
export const SPOTLIGHT = 'spotlight';
export const STRATEGIC = 'strategic';
export const VERIFIED = 'verified';

export const ALL_PROMOTED_CATEGORIES = [
  LINE,
  RECOMMENDED,
  SPONSORED,
  SPOTLIGHT,
  STRATEGIC,
  VERIFIED,
];
export const BADGE_CATEGORIES = [LINE, RECOMMENDED, VERIFIED];
export const EXCLUDE_WARNING_CATEGORIES = [
  LINE,
  RECOMMENDED,
  SPONSORED,
  SPOTLIGHT,
  VERIFIED,
];

export const USER_AGENT_OS_IOS = 'iOS';

// Tracking add-on types
export const TRACKING_TYPE_EXTENSION = 'addon';
export const TRACKING_TYPE_STATIC_THEME = ADDON_TYPE_STATIC_THEME;
export const TRACKING_TYPE_INVALID = 'invalid';

// Tracking install actions.
export const ENABLE_ACTION = 'enable';
export const INSTALL_ACTION = 'install';
export const INSTALL_CANCELLED_ACTION = 'install:cancelled';
export const INSTALL_DOWNLOAD_FAILED_ACTION = 'install:download-failed';
export const INSTALL_STARTED_ACTION = 'install:started';
export const UNINSTALL_ACTION = 'uninstall';

// Tracking Event Categories.
// WARNING: Do not change these without notifying data + metrics teams.
// Changing these strings will break existing statistics without
// updating the category matching at the same time.
export const ENABLE_EXTENSION_CATEGORY = 'AMO Addon Activation';
export const ENABLE_THEME_CATEGORY = 'AMO Theme Activation';

export const INSTALL_EXTENSION_CATEGORY = 'AMO Addon Installs';
export const INSTALL_THEME_CATEGORY = 'AMO Theme Installs';

export const INSTALL_CANCELLED_EXTENSION_CATEGORY =
  'AMO Addon Installs Cancelled';
export const INSTALL_CANCELLED_THEME_CATEGORY = 'AMO Theme Installs Cancelled';

export const INSTALL_DOWNLOAD_FAILED_EXTENSION_CATEGORY =
  'AMO Addon Installs Download Failed';
export const INSTALL_DOWNLOAD_FAILED_THEME_CATEGORY =
  'AMO Theme Installs Download Failed';

export const INSTALL_STARTED_EXTENSION_CATEGORY = 'AMO Addon Installs Started';
export const INSTALL_STARTED_THEME_CATEGORY = 'AMO Theme Installs Started';

export const UNINSTALL_EXTENSION_CATEGORY = 'AMO Addon Uninstalls';
export const UNINSTALL_THEME_CATEGORY = 'AMO Theme Uninstalls';

export const CLICK_CATEGORY = 'AMO Addon / Theme Clicks';

export const SURVEY_CATEGORY = 'AMO Addon / Experience Survey Notice';
export const SURVEY_ACTION_DISMISSED = 'Dismissed survey notice';
export const SURVEY_ACTION_SHOWN = 'Shown survey notice';
export const SURVEY_ACTION_VISITED = 'Visited survey';

// Add-on Search Sort Values
export const SEARCH_SORT_TRENDING = 'hotness';
export const SEARCH_SORT_TOP_RATED = 'rating';
export const SEARCH_SORT_POPULAR = 'users';
export const SEARCH_SORT_RANDOM = 'random';
export const SEARCH_SORT_RELEVANCE = 'relevance';
export const SEARCH_SORT_UPDATED = 'updated';
export const SEARCH_SORT_RECOMMENDED = 'recommended';

// View Contexts that aren't an addonType
export const VIEW_CONTEXT_EXPLORE = 'VIEW_CONTEXT_EXPLORE';
export const VIEW_CONTEXT_HOME = 'VIEW_CONTEXT_HOME';
// Language tools contain both ADDON_TYPE_DICT and ADDON_TYPE_LANG so
// we share a custom view context for both add-on types.
export const VIEW_CONTEXT_LANGUAGE_TOOLS = 'VIEW_CONTEXT_LANGUAGE_TOOLS';

// Allows viewing and editing of any add-ons details in developer tools.
export const ADDONS_EDIT = 'Addons:Edit';
// Can access the add-on reviewer tools to approve/reject add-on submissions.
export const ADDONS_REVIEW = 'Addons:Review';
// Can view statistics for all addons, regardless of privacy settings.
export const STATS_VIEW = 'Stats:View';
// Can edit all Mozilla-owned collections.
export const MOZILLA_COLLECTIONS_EDIT = 'Admin:Curation';
// Can edit the special Featured Themes collection.
export const FEATURED_THEMES_COLLECTION_EDIT = 'Collections:Contribute';
// The slug for the special Featured Themes collection.
export const FEATURED_THEMES_COLLECTION_SLUG = 'featured-personas';
// Can approve add-ons content.
export const ADDONS_CONTENT_REVIEW = 'Addons:ContentReview';
// Can review unlisted add-ons.
export const ADDONS_REVIEW_UNLISTED = 'Addons:ReviewUnlisted';
// Can moderate user ratings on add-ons.
export const RATINGS_MODERATE = 'Ratings:Moderate';
// Can edit user accounts.
export const USERS_EDIT = 'Users:Edit';
// Super powers. It means absolutely all permissions.
export const ALL_SUPER_POWERS = '*:*';
// Can view only the reviewer tools.
export const REVIEWER_TOOLS_VIEW = 'ReviewerTools:View';
// Can review recommend(ed|able) add-ons.
export const ADDONS_RECOMMENDED_REVIEW = 'Addons:RecommendedReview';
// Can review a static theme.
export const STATIC_THEMES_REVIEW = 'Addons:ThemeReview';
