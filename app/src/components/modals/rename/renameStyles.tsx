import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from 'src/contexts/themeContext/themes';
import { Props } from './rename';

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      font: (style: Props & Theme) => style.typography.caption2,
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
    },
    input: {
      background: (style: Props & Theme) => style.backgroundDark2,
      border: (style: Props & Theme) => `1px solid ${style.backgroundLight3}`,
      padding: '1.5rem',
      width: '100%',
      marginBottom: '2rem',
      borderRadius: '0.5rem',
    },
  })
);

export default useStyles;
