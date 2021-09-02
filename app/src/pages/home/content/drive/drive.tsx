import React, { useContext, useEffect, useState } from 'react';

// Contexts
import { ThemeContext } from 'src/contexts/themeContext/themeContext';

// Store
import { StoreContext } from 'src/store/store';
import { receiveFileInfo } from 'src/services/file';

import { sharePod } from 'src/services/pod';

import { createDirectory } from 'src/services/directory';

// Components
import { DriveHeader } from './header/driveHeader';
import { DriveModalGroup } from './modalGroup/modalGroup';

import CardGrid from 'src/components/cardGrid/cardGrid';
import FileCard from 'src/components/cards/fileCard';

import ButtonNavbar from '../../../../components/buttonNavbar/buttonNavbar';
import FileList from '../../../../components/fileList/fileList';

// Hooks and helpers
import useStyles from './driveStyles';
import { sortyByCurrentFilter } from 'src/helpers/sort';

// Types
import { IFile } from 'src/types/models/File';
import { IDirectory } from 'src/types/models/Directory';
import { State, StateTagsEnum } from 'src/types/drive-state-machine/State';
import { OpenRightSidebar } from 'src/pages/home/home';
import { RIGHT_SIDEBAR_VARIANTS } from 'src/pages/home/partials/rightSidebar/rightSidebar';

// Icons
import { Search as SearchIcon } from 'src/components/icons/icons';
export interface Props {
  isPodBarOpen: boolean;
  setRightSidebarContent: (data: OpenRightSidebar) => void;
}

export type TCurrentFilter =
  | 'least-recent'
  | 'file-type'
  | 'increasing-size'
  | 'decreasing-size'
  | 'ascending-abc'
  | 'descending-abc';

function Drive(props: Props) {
  // Contexts
  const { state, actions } = useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const classes = useStyles({ ...props, ...theme });

  // Manage state machine
  const [machineTag, setMachineTag] = useState<State>({
    tag: StateTagsEnum.INITIAL,
  });

  // Detect when pod if any pod is opened
  useEffect(() => {
    setMachineTag({
      tag:
        state.podsOpened.length > 0
          ? StateTagsEnum.POD_OPENED
          : StateTagsEnum.INITIAL,
    });
  }, [state.podsOpened]);

  // Detect if directory other than root is opened
  useEffect(() => {
    if (state.directory !== 'root') {
      setMachineTag({ tag: StateTagsEnum.DIRECTORY_OPENED });
    }
    if (machineTag.tag === StateTagsEnum.DIRECTORY_OPENED) {
      setMachineTag({ tag: StateTagsEnum.POD_OPENED });
    }
  }, [state.directory]);

  const isTagOtherThanInitial = () => machineTag.tag !== StateTagsEnum.INITIAL;

  const chooseProperEmptyMessage = () => {
    if (machineTag.tag === StateTagsEnum.POD_OPENED) {
      return 'This Pod is empty.';
    }
    if (machineTag.tag === StateTagsEnum.DIRECTORY_OPENED) {
      return 'This Directory is empty.';
    }
  };

  // Local store of files and directories
  const [files, setFiles] = useState<IFile[] | null>([]);
  const [folders, setFolders] = useState<IDirectory[] | null>([]);

  useEffect(() => {
    setFiles(state.entries);
    setFolders(state.dirs);
  }, [state.entries, state.dirs]);

  // Toggle grid or list
  const [showGrid, setShowGrid] = useState(true);

  // Manage state of modals
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] =
    useState(false);
  const [isCreateFileModalVisible, setIsCreateFileModalVisible] =
    useState(false);

  // Confirmation of successful creation
  const [responseCreation, setResponseCreation] = useState(false);

  async function loadDirectory() {
    try {
      if (state.podName.length > 0) {
        setFiles(null);
        setFolders(null);
        actions.getDirectory({
          directory: state.directory,
          podName: state.podName,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // On depandency change reload data
  useEffect(() => {
    loadDirectory();
    state.isFileUploaded = false;
    state.searchQuery = null;
  }, [
    state.isFileUploaded,
    state.directory,
    responseCreation,
    state.fileDeleted,
  ]);

  // Handle filtering data by search query
  useEffect(() => {
    if (state.entries) {
      setFiles(state.entries);
    }
    if (state.dirs) {
      setFolders(state.dirs);
    }

    if (state.searchQuery !== null) {
      if (state.entries) {
        const filterFiles = state.entries.filter((file) =>
          file.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        setFiles(filterFiles);
      }
      if (state.dirs) {
        const filterFolders = state.dirs.filter((dir) =>
          dir.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        setFolders(filterFolders);
      }
    }
  }, [state.searchQuery]);

  // Handle sharing content
  const [showSharePodPopup, setShowSharePodPopup] = useState(false);
  const [refLink, setRefLink] = useState('0000000000000');

  const handleShare = async () => {
    const res = await sharePod(state.password, state.podName);
    setRefLink(res);
    setShowSharePodPopup(true);
  };

  useEffect(() => {
    if (responseCreation === true) {
      setIsCreateFolderModalVisible(false);
      setResponseCreation(false);
    }
  }, [responseCreation]);

  // Handle creating folder
  const [folderName, setFolderName] = useState('');

  const createNewFolder = async () => {
    setResponseCreation(
      await createDirectory(state.directory, folderName, state.podName)
    );
  };

  // Handle creating file
  const [fileName, setFileName] = useState('');

  const createNewfile = async () => {
    setResponseCreation(
      await receiveFileInfo(fileName, state.podName, state.directory)
    );
  };

  // Manage filters
  const [currentFilter, setCurrentFilter] =
    useState<TCurrentFilter>('least-recent');

  const isSearchQuerySetted = () =>
    state.searchQuery && state.searchQuery !== '';

  const isFilesNotEmpty = () => files && files.length > 0;

  const isFoldersNotEmpty = () => folders && folders.length > 0;

  return (
    <>
      {isTagOtherThanInitial() && (
        <div className={classes.Drive}>
          <div className={classes.navBarWrapper}>
            <ButtonNavbar
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              handleShare={handleShare}
              currentFilter={currentFilter}
              setCurrentFilter={(selectedFilter) =>
                setCurrentFilter(selectedFilter)
              }
            />
          </div>

          <div className={classes.layoutContent}>
            {state.podName !== '' && (
              <DriveHeader
                isSearchResults={isSearchQuerySetted()}
                isPrivatePod={state.isPrivatePod}
                onOpenCreateFolderModal={() =>
                  setIsCreateFolderModalVisible(true)
                }
                onOpenImportFileModal={() => setIsCreateFileModalVisible(true)}
                onOpenUploadModal={() =>
                  props.setRightSidebarContent({
                    variant: RIGHT_SIDEBAR_VARIANTS.UPLOAD,
                  })
                }
              />
            )}

            <DriveModalGroup
              folderName={folderName}
              setFolderName={(newFolderName) => setFolderName(newFolderName)}
              fileName={fileName}
              setFileName={(newFileName) => setFileName(newFileName)}
              createFolderModal={{
                isCreateFolderModalVisible: () => isCreateFolderModalVisible,
                onCreate: () => createNewFolder(),
                onClose: () => setIsCreateFolderModalVisible(false),
              }}
              createFileModal={{
                isCreateFileModalVisible: () => isCreateFileModalVisible,
                onCreate: () => createNewfile(),
                onClose: () => setIsCreateFileModalVisible(false),
              }}
              sharePodModal={{
                isSharePodModalVisible: () => showSharePodPopup,
                refLink: () => refLink,
                onClose: () => setShowSharePodPopup(false),
              }}
            />

            {isSearchQuerySetted() && (
              <div className={classes.searchDivider}>
                <SearchIcon className={classes.searchIcon} />
                <span>{state.searchQuery}</span>
              </div>
            )}

            {isFilesNotEmpty() || isFoldersNotEmpty() ? (
              showGrid ? (
                <CardGrid className={classes.cardGrid}>
                  {state.dirs &&
                    sortyByCurrentFilter(folders, currentFilter).map(
                      (dir: IDirectory, index) => (
                        <FileCard
                          key={`${dir.name}_${index}`}
                          file={dir}
                          isDirectory={true}
                        />
                      )
                    )}

                  {state.entries &&
                    sortyByCurrentFilter(files, currentFilter).map(
                      (file: IFile, index) => (
                        <FileCard
                          key={`${file.name}_${index}`}
                          file={file}
                          isDirectory={false}
                          onFileClick={() =>
                            props.setRightSidebarContent({
                              payload: file,
                              variant: RIGHT_SIDEBAR_VARIANTS.PREVIEW_FILE,
                            })
                          }
                        />
                      )
                    )}

                  {!!state.dirs ||
                    !!state.entries ||
                    (state.entries === undefined &&
                      state.dirs === undefined && <div>Loading files..</div>)}
                </CardGrid>
              ) : (
                <FileList
                  currentFilter={currentFilter}
                  isPodBarOpen={props.isPodBarOpen}
                ></FileList>
              )
            ) : (
              <p className={classes.noSearchQueryMatches}>
                {isSearchQuerySetted()
                  ? 'Sorry, no entries match search query'
                  : chooseProperEmptyMessage()}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(Drive);
