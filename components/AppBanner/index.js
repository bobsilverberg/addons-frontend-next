import makeClassName from 'classnames';
import PropTypes from 'prop-types';

import SiteNotices from '../SiteNotices';
import SurveyNotice from '../SurveyNotice';
import styles from './styles.module.scss';

export default function AppBanner({ className }) {
  return (
    <div className={makeClassName(styles.AppBanner, className)}>
      <SiteNotices />
      <SurveyNotice />
    </div>
  );
}

AppBanner.propTypes = {
  className: PropTypes.string,
};
