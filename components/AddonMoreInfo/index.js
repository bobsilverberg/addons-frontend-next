// import AddonAdminLinks from 'amo/components/AddonAdminLinks';
// import AddonAuthorLinks from 'amo/components/AddonAuthorLinks';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { STATS_VIEW } from '../../constants';
import { hasPermission } from 'amo/reducers/users';
import { isAddonAuthor } from 'utils';
import Card from 'components/Card';
import DefinitionList, { Definition } from 'components/DefinitionList';
import LoadingText from 'components/LoadingText';
import { addQueryParams, getQueryParametersForAttribution } from 'utils';
import { useI18nState } from 'context/i18n';

export default function AddonMoreInfo({ addon }) {
  const { i18n } = useI18nState();

  function renderDefinitions({
    homepage = null,
    supportUrl = null,
    supportEmail = null,
    statsLink = null,
    privacyPolicyLink = null,
    eulaLink = null,
    filesize = null,
    version = null,
    versionLastUpdated,
    versionLicenseLink = null,
    versionHistoryLink = null,
  }) {
    return (
      <>
        <DefinitionList className="AddonMoreInfo-dl">
          {(homepage || supportUrl || supportEmail) && (
            <Definition
              className="AddonMoreInfo-links"
              term={i18n.gettext('Add-on Links')}
            >
              <ul className="AddonMoreInfo-links-contents-list">
                {homepage}
                {supportUrl}
                {supportEmail}
              </ul>
            </Definition>
          )}
          {version && (
            <Definition
              className="AddonMoreInfo-version"
              term={i18n.gettext('Version')}
            >
              {version}
            </Definition>
          )}
          {filesize && (
            <Definition
              className="AddonMoreInfo-filesize"
              term={i18n.gettext('Size')}
            >
              {filesize}
            </Definition>
          )}
          {versionLastUpdated && (
            <Definition
              className="AddonMoreInfo-last-updated"
              term={i18n.gettext('Last updated')}
            >
              {versionLastUpdated}
            </Definition>
          )}
          {versionLicenseLink && (
            <Definition
              className="AddonMoreInfo-license"
              term={i18n.gettext('License')}
            >
              {versionLicenseLink}
            </Definition>
          )}
          {privacyPolicyLink && (
            <Definition
              className="AddonMoreInfo-privacy-policy"
              term={i18n.gettext('Privacy Policy')}
            >
              {privacyPolicyLink}
            </Definition>
          )}
          {eulaLink && (
            <Definition
              className="AddonMoreInfo-eula"
              term={i18n.gettext('End-User License Agreement')}
            >
              {eulaLink}
            </Definition>
          )}
          {versionHistoryLink && (
            <Definition
              className="AddonMoreInfo-version-history"
              term={i18n.gettext('Version History')}
            >
              <ul className="AddonMoreInfo-links-contents-list">
                {versionHistoryLink}
              </ul>
            </Definition>
          )}
          {statsLink && (
            <Definition
              className="AddonMoreInfo-stats"
              term={i18n.gettext('Usage Statistics')}
            >
              {statsLink}
            </Definition>
          )}
        </DefinitionList>
        {/* <AddonAdminLinks addon={addon} />
        <AddonAuthorLinks addon={addon} /> */}
      </>
    );
  }

  function listContent() {
    if (!addon) {
      return renderDefinitions({
        versionLastUpdated: <LoadingText minWidth={20} />,
        versionLicense: <LoadingText minWidth={20} />,
      });
    }

    let homepage = addon.homepage && addon.homepage.outgoing;
    if (homepage) {
      homepage = (
        <li>
          <a
            className="AddonMoreInfo-homepage-link"
            href={homepage}
            title={addon.homepage && addon.homepage.url}
          >
            {i18n.gettext('Homepage')}
          </a>
        </li>
      );
    }

    let supportUrl = addon.support_url && addon.support_url.outgoing;
    if (supportUrl) {
      supportUrl = (
        <li>
          <a
            className="AddonMoreInfo-support-link"
            href={supportUrl}
            title={addon.support_url && addon.support_url.url}
          >
            {i18n.gettext('Support site')}
          </a>
        </li>
      );
    }

    let supportEmail = addon.support_email;
    if (supportEmail && /.+@.+/.test(supportEmail)) {
      supportEmail = (
        <li>
          <a
            className="AddonMoreInfo-support-email"
            href={`mailto:${supportEmail}`}
          >
            {i18n.gettext('Support Email')}
          </a>
        </li>
      );
    } else {
      supportEmail = null;
    }

    let statsLink = null;
    if (isAddonAuthor({ addon, userId }) || hasStatsPermission) {
      statsLink = (
        <Link
          className="AddonMoreInfo-stats-link"
          href={addQueryParams(
            `/addon/${addon.slug}/statistics/`,
            getQueryParametersForAttribution(location),
          )}
        >
          {i18n.gettext('Visit stats dashboard')}
        </Link>
      );
    }

    const lastUpdated = versionInfo && versionInfo.created;

    const license = currentVersion && currentVersion.license;
    let versionLicenseLink = null;

    if (license) {
      const linkProps = license.isCustom
        ? {
            to: addQueryParams(
              `/addon/${addon.slug}/license/`,
              getQueryParametersForAttribution(location),
            ),
          }
        : { href: license.url, prependClientApp: false, prependLang: false };
      const licenseName = license.name || i18n.gettext('Custom License');

      versionLicenseLink = license.url ? (
        <Link className="AddonMoreInfo-license-link" {...linkProps}>
          {licenseName}
        </Link>
      ) : (
        <span className="AddonMoreInfo-license-name">{licenseName}</span>
      );
    }

    return renderDefinitions({
      homepage,
      supportUrl,
      supportEmail,
      statsLink,
      version: currentVersion ? currentVersion.version : null,
      filesize: versionInfo && versionInfo.filesize,
      versionLastUpdated: lastUpdated
        ? i18n.sprintf(
            // translators: This will output, in English:
            // "2 months ago (Dec 12 2016)"
            i18n.gettext('%(timeFromNow)s (%(date)s)'),
            {
              timeFromNow: i18n.moment(lastUpdated).fromNow(),
              date: i18n.moment(lastUpdated).format('ll'),
            },
          )
        : null,
      versionLicenseLink,
      privacyPolicyLink: addon.has_privacy_policy ? (
        <Link
          className="AddonMoreInfo-privacy-policy-link"
          to={addQueryParams(
            `/addon/${addon.slug}/privacy/`,
            getQueryParametersForAttribution(location),
          )}
        >
          {i18n.gettext('Read the privacy policy for this add-on')}
        </Link>
      ) : null,
      eulaLink: addon.has_eula ? (
        <Link
          className="AddonMoreInfo-eula-link"
          to={addQueryParams(
            `/addon/${addon.slug}/eula/`,
            getQueryParametersForAttribution(location),
          )}
        >
          {i18n.gettext('Read the license agreement for this add-on')}
        </Link>
      ) : null,
      versionHistoryLink: (
        <li>
          <Link
            className="AddonMoreInfo-version-history-link"
            to={addQueryParams(
              `/addon/${addon.slug}/versions/`,
              getQueryParametersForAttribution(location),
            )}
          >
            {i18n.gettext('See all versions')}
          </Link>
        </li>
      ),
    });
  }

  return (
    <Card className="AddonMoreInfo" header={i18n.gettext('More information')}>
      {listContent()}
    </Card>
  );
}

// export const mapStateToProps = (state: AppState, ownProps: Props) => {
//   const { addon, i18n } = ownProps;
//   let currentVersion = null;
//   let versionInfo = null;

//   if (addon && addon.currentVersionId) {
//     currentVersion = getVersionById({
//       id: addon.currentVersionId,
//       state: state.versions,
//     });
//   }

//   if (currentVersion) {
//     versionInfo = getVersionInfo({
//       i18n,
//       state: state.versions,
//       userAgentInfo: state.api.userAgentInfo,
//       versionId: currentVersion.id,
//     });
//   }

//   return {
//     currentVersion,
//     versionInfo,
//     hasStatsPermission: hasPermission(state, STATS_VIEW),
//     userId: state.users.currentUserID,
//   };
// };

// const AddonMoreInfo: React.ComponentType<Props> = compose(
//   withRouter,
//   translate(),
//   connect(mapStateToProps),
// )(AddonMoreInfoBase);

// export default AddonMoreInfo;
AddonMoreInfo.propTypes = { addon: PropTypes.object };
// Add propTypes
// type Props = {|
//     addon: AddonType | null,
//     i18n: I18nType,
//   |};

//   type InternalProps = {|
//     ...Props,
//     hasStatsPermission: boolean,
//     userId: number | null,
//     currentVersion: AddonVersionType | null,
//     versionInfo: VersionInfoType | null,
//     location: ReactRouterLocationType,

//   |};
