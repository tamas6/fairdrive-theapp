import { FC, useContext, useState } from 'react';
import FileSaver from 'file-saver';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import PodContext from '@context/PodContext';
import { useFdpStorage } from '@context/FdpStorageContext';

import { downloadFile, deleteFile } from '@api/files';
import { deleteDirectory } from '@api/directory';

import { ShareFileModal, ConfirmDeleteModal } from '@components/Modals';

import formatDirectory from '@utils/formatDirectory';

interface DriveItemMenuProps {
  type: 'folder' | 'file';
  data: {
    name: string;
  };
  showDropdown: boolean;
  setShowDropdown: (open: boolean) => void;
  openClick: () => void;
  updateDrive: () => void;
  handlePreviewClick?: () => void;
}

const DriveItemMenu: FC<DriveItemMenuProps> = ({
  type,
  data,
  showDropdown,
  setShowDropdown,
  openClick,
  updateDrive,
  handlePreviewClick,
}) => {
  const { trackEvent } = useMatomo();
  const { activePod, directoryName } = useContext(PodContext);
  const { fdpClient } = useFdpStorage();
  const [showShareFileModal, setShowShareFileModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const previewLabel = type === 'file' ? 'Preview' : 'Open';

  const handleOpenClick = () => {
    setShowDropdown(false);
    openClick();
  };

  const handleDownloadClick = () => {
    setShowDropdown(false);

    downloadFile(fdpClient, {
      filename: data?.name,
      directory: directoryName,
      podName: activePod,
    })
      .then((response) => {
        FileSaver.saveAs(response, data?.name);

        trackEvent({
          category: 'File',
          action: `Download File`,
          name: `Download File: ${data?.name}`,
          documentTitle: 'Drive Page',
          href: window.location.href,
        });
      })
      .catch(() => {
        console.log('File could not be downloaded!');
      });
  };

  const handleShareClick = () => {
    setShowDropdown(false);
    setShowShareFileModal(true);
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setShowConfirmDeleteModal(true);
  };

  const handleDeleteFile = () => {
    setShowDropdown(false);

    deleteFile(fdpClient, {
      file_name: data?.name,
      podName: activePod,
      path: formatDirectory(directoryName),
    })
      .then(() => {
        trackEvent({
          category: 'File',
          action: `Delete File`,
          name: `Delete File: ${data?.name}`,
          documentTitle: 'Drive Page',
          href: window.location.href,
        });

        setShowConfirmDeleteModal(false);
        updateDrive();
      })
      .catch(() => {
        console.log('File could not be deleted!');
      });
  };

  const handleDeleteFolder = () => {
    setShowDropdown(false);

    const deletePath =
      (directoryName !== 'root' ? '/' + directoryName + '/' : '/') + data.name;

    deleteDirectory(fdpClient, {
      podName: activePod,
      path: deletePath,
    })
      .then(() => {
        trackEvent({
          category: 'Folder',
          action: `Delete Folder`,
          name: `Delete Folder: ${data?.name}`,
          documentTitle: 'Drive Page',
          href: window.location.href,
        });

        setShowConfirmDeleteModal(false);
        updateDrive();
      })
      .catch(() => {
        console.log('Folder could not be deleted!');
      });
  };

  return (
    <>
      {showDropdown ? (
        <div className="absolute -left-32 w-48 p-5 bg-color-shade-dark-1-day dark:bg-color-shade-dark-3-night text-left rounded-md shadow z-30">
          <h4 className="mb-3 pb-3 font-semibold text-color-shade-white-day dark:text-color-shade-white-night text-base border-b-2 border-color-shade-light-1-day dark:border-color-shade-light-1-night">
            {handlePreviewClick ? (
              <span onClick={handlePreviewClick}>{previewLabel}</span>
            ) : (
              previewLabel
            )}
          </h4>

          <div className="space-y-4">
            {/* <span
              className="block w-auto font-normal text-color-shade-white-day dark:text-color-shade-white-night text-base cursor-pointer"
              onClick={handleOpenClick}
            >
              Open
            </span> */}

            {type === 'file' ? (
              <span
                className="block w-auto font-normal text-color-shade-white-day dark:text-color-shade-white-night text-base cursor-pointer"
                onClick={handleDownloadClick}
              >
                Download
              </span>
            ) : null}

            {type === 'file' ? (
              <span
                className="block w-auto font-normal text-color-shade-white-day dark:text-color-shade-white-night text-base cursor-pointer"
                onClick={handleShareClick}
              >
                Share
              </span>
            ) : null}

            <span
              className="block w-auto font-normal text-color-shade-white-day dark:text-color-shade-white-night text-base cursor-pointer"
              onClick={handleDeleteClick}
            >
              Delete
            </span>
          </div>
        </div>
      ) : null}

      {showShareFileModal ? (
        <ShareFileModal
          showModal={showShareFileModal}
          closeModal={() => setShowShareFileModal(false)}
          fileName={data?.name}
          podName={activePod}
          path={formatDirectory(directoryName)}
        />
      ) : null}

      {showConfirmDeleteModal ? (
        <ConfirmDeleteModal
          showModal={showConfirmDeleteModal}
          closeModal={() => setShowConfirmDeleteModal(false)}
          type={type}
          name={data?.name}
          deleteHandler={
            type === 'file' ? handleDeleteFile : handleDeleteFolder
          }
        />
      ) : null}
    </>
  );
};

export default DriveItemMenu;