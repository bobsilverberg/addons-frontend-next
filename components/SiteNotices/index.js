// import PropTypes from 'prop-types';
import useSWR from 'swr';

import { useI18nState } from '../../context/i18n';
// import { useSiteState } from '../../context/site';
import { LOG_IN_USER, LOG_OUT_USER, useUserContext } from '../../context/user';
import { sanitizeHTML, nl2br } from '../../utils';
// import Notice from './Notice';
import styles from './styles.module.scss';

function useSiteData() {
  const { data, error } = useSWR(
    `https://addons-dev.allizom.org/api/v5/site/`,
    // fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

// This is needed because of https://github.com/mozilla/addons-frontend/issues/8616
//
// We cannot use `sanitizeUserHTML()` on a `<span />`, which is required to
// avoid the UI glitch so we configure our own sanitize function to make sure
// it is safe to use `<span />`.
const sanitizeNoticeHTML = (text) => {
  return sanitizeHTML(nl2br(text), ['a', 'b', 'br', 'em', 'i', 'strong']);
};

export default function SiteNotices() {
  const { i18n } = useI18nState();
  const { data } = useSiteData();
  const { notice, readOnly } = data || {};
  const { dispatch, state: userState } = useUserContext();
  const { currentUserWasLoggedOut } = userState;
  const notices = [];
  console.log('----- in SiteNotices, notice: ', notice);
  console.log('----- in SiteNotices, readOnly: ', readOnly);
  if (notice) {
    notices.push(
      <Notice
        className={styles.SiteNotices}
        id="amo-site-notice"
        type="warning"
        key="amo-site-notice"
      >
        <span
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={sanitizeNoticeHTML(notice)}
        />
      </Notice>,
    );
  }

  if (readOnly) {
    notices.push(
      <Notice
        className={styles.SiteNotices}
        id="amo-site-read-only"
        type="warning"
        key="amo-site-read-only"
      >
        {i18n.gettext(`Some features are temporarily disabled while we
              perform website maintenance. We'll be back to full capacity
              shortly.`)}
      </Notice>,
    );
  }

  if (currentUserWasLoggedOut) {
    notices.push(
      <Notice
        className="SiteNotices"
        id="user-was-logged-out"
        type="warning"
        key="user-was-logged-out"
      >
        {i18n.gettext('You have been logged out.')}
      </Notice>,
    );
  }

  return (
    <>
      <div>
        <p>index page</p>
        <button
          onClick={() =>
            dispatch({
              type: LOG_IN_USER,
              payload: { user: { id: 123 } },
            })
          }
        >
          login
        </button>
        <button onClick={() => dispatch({ type: LOG_OUT_USER })}>logout</button>
        {JSON.stringify(userState)}
      </div>
    </>
  );
}
