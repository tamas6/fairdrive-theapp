import React, { useContext } from 'react';

// Hooks
import useStyles from './sidebarStyles';

// Contexts
import { ThemeContext } from 'src/contexts/themeContext/themeContext';
import { StoreContext } from 'src/store/store';

// Components
import SidebarItem from 'src/components/sidebarItem/sidebarItem';
// import { Drive, Dashboard, Globe } from '../../components/icons/icons';
import { Drive } from 'src/components/icons/icons';

export interface Props {
  showPodSidebar: boolean;
  setShowPodSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarItem: string;
  setSidebarItem: React.Dispatch<React.SetStateAction<string>>;
}

function Sidebar(props: Props) {
  const { state } = useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const { showPodSidebar, setShowPodSidebar, sidebarItem, setSidebarItem } =
    props;
  const classes = useStyles({ ...props, ...theme });
  //Load pods
  const switchPages = async (pageName: string) => {
    if (pageName === sidebarItem) {
      setShowPodSidebar(!showPodSidebar);
    } else {
      setSidebarItem(pageName);
    }
  };
  return (
    state.userData && (
      <div className={classes.Sidebar}>
        {/* <SidebarItem
          onClick={() => {
            switchPages("Overview");
          }}
          Icon={Dashboard}
          title="Overview"
        /> */}
        <SidebarItem
          onClick={() => {
            switchPages('Drive');
          }}
          Icon={Drive}
          title="Drive"
        />
        {/* <SidebarItem
          onClick={() => {
            switchPages("Explore");
          }}
          Icon={Globe}
          title="Explore"
        /> */}
      </div>
    )
  );
}

export default React.memo(Sidebar);