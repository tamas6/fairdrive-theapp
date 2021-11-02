import React, { useContext } from 'react';
import { useTheme } from 'src/contexts/themeContext/themeContext';
import useStyles from './fileListStyles';
import FileListHeader from './fileListHeader/fileListHeader';
import FileListFooter from './fileListFooter/fileListFooter';
import FileListBody from './fileListBody/fileListBody';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

import { PodProviderContext } from 'src/machines/pod';

import { TCurrentFilter } from '../../pages/home/content/drive/drive';
import { sortyByCurrentFilter } from 'src/helpers/sort';

export interface Props {
  currentFilter: TCurrentFilter;
  isPodBarOpen: boolean;
}

function FileList(props: Props) {
  const { PodMachineStore } = useContext(PodProviderContext);
  const { theme } = useTheme();
  const classes = useStyles({ ...props, ...theme });

  const getDirectories = () => PodMachineStore.context.directoryData.dirs;
  const getFiles = () => PodMachineStore.context.directoryData.files;

  return (
    getFiles() !== null && (
      <div className={classes.container}>
        <FileListHeader isPodBarOpen={props.isPodBarOpen} />
        <div>
          {getDirectories() !== undefined &&
            sortyByCurrentFilter(getDirectories(), props.currentFilter).map(
              (directory, index) => {
                return (
                  <FileListBody
                    key={`${directory.name}_${index}`}
                    name={directory.name}
                    type={directory.content_type}
                    size={directory.size}
                    created={moment
                      .unix(parseInt(directory.creation_time))
                      .format('DD/MM/YYYY')}
                    modified={moment
                      .unix(parseInt(directory.modification_time))
                      .format('DD/MM/YYYY')}
                    file={directory}
                    isPodBarOpen={props.isPodBarOpen}
                  />
                );
              }
            )}
          {getFiles() !== undefined &&
            sortyByCurrentFilter(getFiles(), props.currentFilter).map(
              (entry, index) => {
                return (
                  <FileListBody
                    key={`${entry.name}_${index}`}
                    name={entry.name}
                    type={entry.content_type}
                    size={prettyBytes(parseInt(entry.size))}
                    created={moment
                      .unix(parseInt(entry.creation_time))
                      .format('DD/MM/YYYY')}
                    modified={moment
                      .unix(parseInt(entry.modification_time))
                      .format('DD/MM/YYYY')}
                    file={entry}
                    isPodBarOpen={props.isPodBarOpen}
                  />
                );
              }
            )}
        </div>
        <FileListFooter />
      </div>
    )
  );
}

export default React.memo(FileList);