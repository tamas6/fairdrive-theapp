import React, { useState } from 'react';
import { useTheme } from 'src/contexts/themeContext/themeContext';
import useStyles from './alertBannerStyles';
import { Warning } from '../icons/icons';

export interface Props {}

function AlertBanner(props: Props) {
  const { theme } = useTheme();
  const classes = useStyles({ ...props, ...theme });

  const [showBanner, setShowBanner] = useState(false);

  return (
    <>
      {showBanner && (
        <div className={classes.AlertBanner}>
          <Warning className={classes.warningIcon} />
          <div className={classes.betaWarningText}>
            Fairdrive is in Beta and provided for evaluation only! File
            integrity, persistence and security are not assured!{' '}
            <a href="https://github.com/fairDataSociety/fairdrive-theapp/issues">
              Report Bugs
            </a>
            .
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className={classes.agree}
          >
            Ok, I Agree!
          </button>
        </div>
      )}
    </>
  );
}

export default React.memo(AlertBanner);