import React from 'react';
import { useTheme } from 'src/contexts/themeContext/themeContext';
import useStyles from './dropDownStyles';

type Variants = 'primary' | 'secondary' | 'tertiary';

export interface Props {
  variant: Variants;
  children: React.ReactNode;
  heading: string;
  subheading?: string;
}

function DropDown(props: Props) {
  const { theme } = useTheme();
  const classes = useStyles({ ...props, ...theme });

  return (
    <div className={classes.wrapper}>
      <div className={classes.heading}>{props.heading}</div>
      <div className={classes.subheading}>{props.subheading}</div>
      <div className={classes.divider}></div>
      <div className={classes.body}>{props.children}</div>
    </div>
  );
}

export default React.memo(DropDown);
