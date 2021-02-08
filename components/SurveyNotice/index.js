import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { withCookies, Cookies } from 'react-cookie';

import { useGlobalState } from '../../context/global';
import { useI18nState } from '../../context/i18n';
import {
  SURVEY_ACTION_DISMISSED,
  SURVEY_ACTION_SHOWN,
  SURVEY_ACTION_VISITED,
  SURVEY_CATEGORY,
} from '../../constants';
import tracking from '../../utils/tracking';
import { addQueryParams, configGetPulic } from '../../utils';
import Notice from '../Notice';
import styles from './styles.module.scss';

export default function SurveyNotice({
  _supportedLangs = [
    'de',
    'en-US',
    'es',
    'fr',
    'ja',
    'pl',
    'pt-BR',
    'ru',
    'zh-CN',
    'zh-TW',
  ],
}) {
  const surveyNoticeId = 'survey-notice';
  const { i18n } = useI18nState();
  const { asPath } = useRouter();
  const { dismissedNotices, lang, setDismissedNotices } = useGlobalState();
  const wasDismissed = dismissedNotices.includes(surveyNoticeId);

  function track(action) {
    tracking.sendEvent({
      action,
      category: SURVEY_CATEGORY,
    });
  }

  function shouldShowNotice() {
    return (
      configGetPulic('enableFeatureExperienceSurvey') &&
      !wasDismissed &&
      _supportedLangs.includes(lang)
    );
  }

  useEffect(() => {
    if (shouldShowNotice()) {
      track(SURVEY_ACTION_SHOWN);
    }
  });

  function dismissNotice() {
    setDismissedNotices([...dismissedNotices, surveyNoticeId]);
    // Even though a dismissal action is dispatched here, also save a
    // cookie to manually synchronize state. The server code will load
    // the cookie and synchronize state as part of the request.
    // TODO: make this synchronization more automatic.
    // See https://github.com/mozilla/addons-frontend/issues/5617
    // cookies.set(configGetPulic('dismissedExperienceSurveyCookieName'), '', {
    //   // Expire 180 days from now. This value is in seconds.
    //   maxAge: 24 * 60 * 60 * 180,
    //   path: '/',
    // });
  }

  function onDismiss() {
    dismissNotice();
    track(SURVEY_ACTION_DISMISSED);
  }

  function onClickSurveyLink() {
    dismissNotice();
    track(SURVEY_ACTION_VISITED);
  }

  if (!shouldShowNotice()) {
    return null;
  }

  // Pass along a source derived from the current URL path but with
  // the preceding language path removed.
  const surveyUrl = addQueryParams(
    'https://qsurvey.mozilla.com/s3/addons-mozilla-org-survey',
    {
      source: asPath.split('/').slice(2).join('/'),
    },
  );

  return (
    <Notice
      actionHref={surveyUrl}
      actionOnClick={onClickSurveyLink}
      actionTarget="_blank"
      actionText={i18n.gettext('Take short survey')}
      againstGrey20
      className={styles.SurveyNotice}
      dismissible
      id="amo-experience-survey"
      onDismiss={onDismiss}
      type="generic"
    >
      {i18n.gettext(
        'Thanks for visiting this site! Please take a minute or two to tell Firefox about your experience.',
      )}
    </Notice>
  );
}

// TODO: Need to deal with cookies HOC
// const SurveyNotice: React.ComponentType<Props> = compose(
//   connect(mapStateToProps),
//   translate(),
//   withCookies,
// )(SurveyNoticeBase);

SurveyNotice.propTypes = {
  _supportedLangs: PropTypes.array,
};
