import React, { useContext } from 'react';
import { ThemeContext } from 'src/contexts/themeContext/themeContext';
import useStyles from './buttonPillStyles';

export interface Props {
  clickFunction: () => void;
  text: string;
  color?: string;
  textColor?: string;
  size?: string;
}

function ButtonPill(props: Props) {
  const { theme } = useContext(ThemeContext);
  const { text, clickFunction } = props;
  const classes = useStyles({ ...props, ...theme });
  // useEffect(() => {
  //   if (props.setFiles) {
  //     props.setFiles(state.entries);
  //   }
  // }, [state.entries]);
  return (
    <div className={classes.button} onClick={clickFunction}>
      {text}
    </div>
  );
}

export default React.memo(ButtonPill);
